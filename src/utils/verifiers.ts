import { randomBytes, createHash } from 'crypto';

export function getVerifier() {
  const codeVerifier = generateRandomString(45);
  const codeChallenge = getHash(codeVerifier);

  return {
    codeVerifier,
    codeChallenge,
  };
}

export function getAppState() {
  return generateRandomString();
}

function generateRandomString(length = 32) {
  return randomBytes(length).toString('hex');
}

function getHash(code_verifier: string) {
  return createHash('sha256').update(code_verifier).digest('hex');
}
