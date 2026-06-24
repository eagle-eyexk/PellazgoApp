// Credentials are verified against SHA-256 hashes only.
// Plaintext credentials are NEVER stored anywhere in this codebase.

const U_HASH = '1fe60bf2be6193da4c188fd0fff9e2676ac9cf2de53eb9c1f480128d86338252';
const P_HASH = '9997d81415ae368971b9a5bf9a40f91567fcf673d09536e134eb4f9608b75f8e';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminCredentials(username, password) {
  const [uH, pH] = await Promise.all([sha256(username.trim()), sha256(password)]);
  return uH === U_HASH && pH === P_HASH;
}

const KEY = '_pg_s';
const TTL = 4 * 60 * 60 * 1000; // 4 hours

export function setAdminSession() {
  sessionStorage.setItem(KEY, String(Date.now() + TTL));
}

export function isAdminSessionValid() {
  const v = sessionStorage.getItem(KEY);
  if (!v) return false;
  if (Date.now() > parseInt(v, 10)) {
    sessionStorage.removeItem(KEY);
    return false;
  }
  return true;
}

export function clearAdminSession() {
  sessionStorage.removeItem(KEY);
}
