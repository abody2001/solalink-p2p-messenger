import { PublicKey } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletContextProvider } from './components/WalletContextProvider';
import { MessageCircle, Users } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import PeerList from './components/PeerList';
import { ProfileSetup } from './components/ProfileSetup';
import { uploadFile } from './lib/ipfs';
import { encryptMessage } from './lib/crypto';
import { storeMessages, retrieveMessages } from './lib/storage';
import { getLocalProfile } from './lib/profile';
import { getRecentPeers, addRecentPeer, getAddressActivity } from './lib/peers';

import type { Message, Peer, UserProfile } from './types/message';

function MessengerApp() {
  const { publicKey, signMessage } = useWallet();
  const { connection } = useConnection();
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentPeers, setRecentPeers] = useState<Peer[]>([]);
  const [showPeers, setShowPeers] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!publicKey) return;

      const p = await getLocalProfile();
      setProfile(p);

      const peers = await getRecentPeers();
      setRecentPeers(peers);

      const stored = await retrieveMessages();

      const filtered = stored.filter(
        m => m.sender === publicKey.toString() || m.recipient === publicKey.toString()
      );
      setMessages(filtered);
    };
    load();
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey || !connection) return;

    const interval = setInterval(async () => {
      const updated = await Promise.all(
        messages.map(async msg => {
          if (msg.sender === publicKey.toString() && msg.status === 'sent') {
            try {
              const { active } = await getAddressActivity(connection, msg.recipient);
              if (active) {
                return { ...msg, status: 'delivered' } as Message;

              }
            } catch {}
          }
          return msg;
        })
      );

      if (JSON.stringify(updated) !== JSON.stringify(messages)) {
        setMessages(updated);
        await storeMessages(updated);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [publicKey, messages, connection]);

  const handleSendMessage = async (
    content: string,
    recipientPublicKey: string,
    file?: File
  ) => {
    if (!publicKey || !signMessage || !profile) return;

    try {
      let fileUrl;
      let fileName;
      if (file) {
        fileUrl = await uploadFile(file);
        fileName = file.name;
      }

      const { encrypted, nonce } = await encryptMessage(
        content,
        await signMessage(new TextEncoder().encode('Sign to encrypt message')),
        new PublicKey(recipientPublicKey)

      );

      const newMsg: Message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        sender: publicKey.toString(),
        senderUsername: profile.username,
        recipient: recipientPublicKey,
        content,
        nonce,
        timestamp: Date.now(),
        fileUrl,
        fileName,
        status: 'sent'
      };

      const updated = [...messages, newMsg];
      setMessages(updated);
      await storeMessages(updated);
      await addRecentPeer(recipientPublicKey);
      setRecentPeers(await getRecentPeers());
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center space-y-6">
          <MessageCircle className="w-16 h-16 text-blue-500 mx-auto" />
          <h1 className="text-2xl font-bold">Solana P2P Messenger</h1>
          <p className="text-gray-600">
            Connect your wallet to start messaging securely.
          </p>
          <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <ProfileSetup
        publicKey={publicKey.toString()}
        onComplete={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">SolaLink Chat</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Logged in as: <span className="font-medium">{profile.username}</span>
            </span>
            <button
              className="hover:bg-gray-100 p-2 rounded-full"
              onClick={() => setShowPeers(!showPeers)}
            >
              <Users className="w-5 h-5" />
            </button>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto p-4 flex gap-4">
        <div className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
          <MessageList messages={messages} currentWallet={publicKey.toString()} />
          <MessageInput onSendMessage={handleSendMessage} recentPeers={recentPeers} />
        </div>

        {showPeers && (
          <div className="w-80 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Recent Peers</h2>
            <PeerList onSelectPeer={() => setShowPeers(false)} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <WalletContextProvider>
      <MessengerApp />
    </WalletContextProvider>
  );
}




