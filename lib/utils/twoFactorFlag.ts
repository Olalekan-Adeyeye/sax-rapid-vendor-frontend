export const TWO_FACTOR_MAX_AGE_SEC = 12 * 60 * 60;

const FUTURE_TOLERANCE_SEC = 60;

export function hashString(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function fingerprintToken(token: string): string {
  return hashString(`sax-2fa:${token}`);
}

export function createTwoFactorFlag(
  token: string | null,
  nowSec: number = Math.floor(Date.now() / 1000),
): string | null {
  if (!token) return null;
  const fp = fingerprintToken(token);
  const ts = nowSec;
  const sig = hashString(`${fp}.${ts}.${token}`);
  return `${fp}.${ts}.${sig}`;
}

export function isTwoFactorFlagValid(
  flag: string | null | undefined,
  token: string | null | undefined,
  nowSec: number = Math.floor(Date.now() / 1000),
  maxAgeSec: number = TWO_FACTOR_MAX_AGE_SEC,
): boolean {
  if (!flag || !token) return false;
  const parts = flag.split(".");
  if (parts.length !== 3) return false;
  const [fp, tsRaw, sig] = parts;
  if (!/^[0-9a-f]{8}$/.test(fp) || !/^[0-9a-f]{8}$/.test(sig)) return false;
  if (!/^\d+$/.test(tsRaw)) return false;
  const ts = Number(tsRaw);
  if (!Number.isSafeInteger(ts)) return false;
  if (ts > nowSec + FUTURE_TOLERANCE_SEC) return false;
  if (nowSec - ts > maxAgeSec) return false;
  if (fp !== fingerprintToken(token)) return false;
  return sig === hashString(`${fp}.${ts}.${token}`);
}
