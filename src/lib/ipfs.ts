import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { CID } from 'multiformats/cid';

let heliaInstance: any = null;

async function getHelia() {
  if (!heliaInstance) {
    heliaInstance = await createHelia();
  }
  return heliaInstance;
}

export async function uploadFile(file: File): Promise<string> {
  const helia = await getHelia();
  const fs = unixfs(helia);
  const buffer = await file.arrayBuffer();
  const cid = await fs.addBytes(new Uint8Array(buffer));
  return `https://ipfs.io/ipfs/${cid.toString()}`;
}

