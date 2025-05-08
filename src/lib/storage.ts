import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { Message } from '../types/message'

let heliaInstance: any = null

export async function uploadFile(file: File): Promise<string> {
  if (!heliaInstance) {
    heliaInstance = await createHelia()
  }
  const fs = unixfs(heliaInstance)
  const buf = await file.arrayBuffer()
  const cid = await fs.addBytes(new Uint8Array(buf))
  return `https://ipfs.io/ipfs/${cid}`
}

const STORAGE_KEY = 'solalink-messages'

export async function storeMessages(messages: Message[]): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export async function retrieveMessages(): Promise<Message[]> {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}
