import { randomBytes, createHash } from 'crypto';
import base64url from 'base64url';

export function getVerifier() {
  const code_verifier = generateRandomString(45);
  const code_challenge = getHash(code_verifier);

  return {
    code_verifier,
    code_challenge,
  };
}

export function getAppState() {
  return generateRandomString();
}

function generateRandomString(length = 32) {
  const str = randomBytes(length).toString('base64');
  return base64URLEncode(str);
}

export function getHash(code_verifier: string) {
  const hash = createHash('sha256')
    .update(code_verifier)
    .digest()
    .toString('base64');
  return base64URLEncode(hash);
}

function base64URLEncode(str: string) {
  return base64url.fromBase64(str);
}
