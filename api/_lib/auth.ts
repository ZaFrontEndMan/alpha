/**
 * Admin session for /admin. One account, configured with env vars:
 *   ADMIN_EMAIL, ADMIN_PASSWORD            required
 *   ADMIN_SESSION_SECRET                   optional (a secret is derived from the other secrets if missing)
 * The session is an HttpOnly, SameSite=Strict cookie holding a signed { email, exp } token.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'admin_session';
const MAX_AGE_S = 60 * 60 * 24 * 7;

const sha = (s: string) => createHash('sha256').update(s).digest();
const safeEqual = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));

const secret = () =>
  process.env.ADMIN_SESSION_SECRET ||
  `derived:${process.env.ADMIN_PASSWORD ?? ''}:${process.env.CLOUDINARY_API_SECRET ?? ''}:${process.env.ADMIN_EMAIL ?? ''}`;

export const adminConfigured = () => Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);

export function checkCredentials(email: string, password: string): boolean {
  if (!adminConfigured()) return false;
  // Evaluate both so the time taken doesn't reveal which one was wrong.
  const okEmail = safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase());
  const okPass = safeEqual(password, process.env.ADMIN_PASSWORD!);
  return okEmail && okPass;
}

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const mac = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function createSessionCookie(email: string, secure: boolean): string {
  const payload = b64(JSON.stringify({ email, exp: Date.now() + MAX_AGE_S * 1000 }));
  return `${COOKIE}=${payload}.${mac(payload)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${MAX_AGE_S}${secure ? '; Secure' : ''}`;
}

export const clearSessionCookie = (secure: boolean) =>
  `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure ? '; Secure' : ''}`;

export function readSession(headers: Record<string, string | string[] | undefined>): { email: string } | null {
  if (!adminConfigured()) return null;
  const raw = Array.isArray(headers.cookie) ? headers.cookie.join(';') : headers.cookie ?? '';
  const token = raw.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !safeEqual(sig, mac(payload))) return null;
  try {
    const { email, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email: string; exp: number };
    return exp > Date.now() ? { email } : null;
  } catch {
    return null;
  }
}

// Best-effort brute-force protection. Serverless instances are short-lived, so this limits bursts rather than
// guaranteeing a lockout: pair it with a strong ADMIN_PASSWORD.
const attempts = new Map<string, { n: number; until: number }>();
const MAX_TRIES = 5;
const LOCK_MS = 15 * 60 * 1000;

export function isLocked(ip: string): number {
  const a = attempts.get(ip);
  return a && a.until > Date.now() ? Math.ceil((a.until - Date.now()) / 60000) : 0;
}
export function recordFailure(ip: string) {
  const a = attempts.get(ip) ?? { n: 0, until: 0 };
  a.n += 1;
  if (a.n >= MAX_TRIES) {
    a.n = 0;
    a.until = Date.now() + LOCK_MS;
  }
  attempts.set(ip, a);
}
export const recordSuccess = (ip: string) => attempts.delete(ip);
