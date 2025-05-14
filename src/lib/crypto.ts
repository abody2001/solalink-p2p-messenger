import nacl from 'tweetnacl'
import { PublicKey } from '@solana/web3.js'

export function encryptMessage(
  message: string,
  senderSignature: Uint8Array,
  recipientPublicKey: PublicKey
): { encrypted: Uint8Array; nonce: Uint8Array } {
  const sharedSecret = nacl.hash(
    new Uint8Array([...senderSignature, ...recipientPublicKey.toBytes()])
  ).slice(0, 32)

  const nonce = nacl.randomBytes(24)
  const messageUint8 = new TextEncoder().encode(message)
  const encrypted = nacl.secretbox(messageUint8, nonce, sharedSecret)
  return { encrypted, nonce }
}
export {};