// Unlocks the /form intake page only after a successful Paymob payment.
// Stored per-browser; the payment itself is verified server-side (HMAC) in api/paymob/callback.ts.
const KEY = 'aa_paid_access';

export interface PaidAccess {
  packageId: string;
  ref: string;
  at: number;
}

export function grantFormAccess(access: Omit<PaidAccess, 'at'>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...access, at: Date.now() }));
  } catch {
    /* storage unavailable */
  }
}

export function getFormAccess(): PaidAccess | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PaidAccess) : null;
  } catch {
    return null;
  }
}

export function clearFormAccess() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}
