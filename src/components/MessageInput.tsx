import React, { useState } from 'react'

type Peer = {
  address: string
  username?: string
}

type Props = {
  onSendMessage: (content: string, recipientPublicKey: string, file?: File) => void
  recentPeers: Peer[]
}

const MessageInput: React.FC<Props> = ({ onSendMessage, recentPeers }) => {
  const [message, setMessage] = useState('')
  const [recipient, setRecipient] = useState('')
  const [file, setFile] = useState<File | undefined>()

  const handleSend = () => {
    if (message && recipient) {
      onSendMessage(message, recipient, file)
      setMessage('')
      setFile(undefined)
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient Wallet Address"
          className="border p-2 rounded w-full text-sm"
        />
        {recentPeers.length > 0 && (
          <div className="text-xs text-gray-500">
            Recent:{" "}
            {recentPeers.map((p, i) => (
              <button
                key={i}
                className="text-blue-500 mr-2"
                onClick={() => setRecipient(p.address)}
              >
                {p.username || p.address.slice(0, 6) + '...' + p.address.slice(-4)}
              </button>
            ))}
          </div>
        )}
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="border p-2 rounded w-full text-sm"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="text-sm"
        />
      </div>
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
      >
        Send Message
      </button>
    </div>
  )
}

export default MessageInput
