import * as NodeRSA from 'node-rsa';

const key = new NodeRSA({ b: 512 });
const prikey = key.exportKey('pkcs8-private');
const pubkey = key.exportKey('pkcs8-public');

export function getPublicKey(): string {
  return pubkey;
}

export function encrypt(data: string): string {
  return new NodeRSA(pubkey, 'pkcs8-public').encrypt(data, 'base64');
}

export function decrypt(data: string): string {
  return new NodeRSA(prikey, 'pkcs8-private').decrypt(data, 'utf8');
}
