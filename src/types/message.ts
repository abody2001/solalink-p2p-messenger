export type Message = {
  id: string;
  sender: string;
  senderUsername?: string;
  recipient: string;
  content: string;
  nonce?: Uint8Array;
  timestamp: number;
  fileUrl?: string;
  fileName?: string;
  status: 'sent' | 'delivered';
};


export interface Peer {
  address: string;
  lastSeen: number;
}

export interface UserProfile {
  username: string;
}



