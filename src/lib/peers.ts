import { Connection, PublicKey } from '@solana/web3.js';
import type { Peer } from '../types/message';

export async function getAddressActivity(
  connection: Connection,
  address: string
): Promise<{ active: boolean }> {
  const pubkey = new PublicKey(address); // ✅ Convert string to PublicKey
  const info = await connection.getAccountInfo(pubkey);
  return { active: info !== null };
}
export function getRecentPeers(): Peer[] {
  const raw = localStorage.getItem('peers');
  return raw ? JSON.parse(raw) as Peer[] : [];
}


export function addRecentPeer(address: string) {
  const peers = getRecentPeers();

  // Avoid duplicates
  if (!peers.find(p => p.address === address)) {
    peers.push({ address, lastSeen: Date.now() });

    localStorage.setItem('peers', JSON.stringify(peers));
  }
}
console.log('addRecentPeer loaded:', typeof addRecentPeer); 






