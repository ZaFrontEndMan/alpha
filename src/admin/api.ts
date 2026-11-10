/** Thin client for /api/admin. Every call carries the session cookie; writes also send the CSRF header. */
export class AdminApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function adminCall<T = any>(
  action: string,
  opts: { method?: 'GET' | 'POST'; body?: unknown; query?: Record<string, string> } = {}
): Promise<T> {
  const q = new URLSearchParams({ action, ...(opts.query ?? {}) });
  const res = await fetch(`/api/admin?${q}`, {
    method: opts.method ?? 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'admin' },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AdminApiError(data?.error || `Request failed (${res.status})`, res.status);
  return data as T;
}

export interface UploadedImage {
  public_id: string;
  width: number;
  height: number;
  format: string;
  version: number;
}

/** Signed, direct browser → Cloudinary upload into `folder`. */
export async function uploadImage(file: File, folder: string): Promise<UploadedImage> {
  if (!file.type.startsWith('image/')) throw new Error('الملف لازم يكون صورة.');
  if (file.size > 10 * 1024 * 1024) throw new Error('حجم الصورة أكبر من 10MB.');
  const s = await adminCall<{ cloudName: string; apiKey: string; signature: string; params: Record<string, string | number> }>(
    'sign-upload',
    { method: 'POST', body: { folder } }
  );
  const form = new FormData();
  form.set('file', file);
  form.set('api_key', s.apiKey);
  form.set('signature', s.signature);
  Object.entries(s.params).forEach(([k, v]) => form.set(k, String(v)));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || 'فشل رفع الصورة.');
  return data as UploadedImage;
}
