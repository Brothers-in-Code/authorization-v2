import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';
const algorithm = 'aes-256-ctr';

type EncryptedHashType = {
  iv: string;
  text: string;
};

export function encrypt(text: string, secretKey: string): EncryptedHashType {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    text: encrypted.toString('hex'),
  };
}

export function decrypt(hash: EncryptedHashType, secretKey: string): string {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, 'hex'),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.text, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString();
}
