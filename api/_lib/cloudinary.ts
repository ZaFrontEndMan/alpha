/**
 * Small Cloudinary client for the serverless functions (no SDK: just fetch + the signing rule).
 * Files starting with "_" inside /api are helpers, not endpoints, so they don't count as Vercel functions.
 *
 * Server-only env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
import { createHash } from 'node:crypto';

export const PUBLISHED_ID = 'assem/config/site-config.json';
export const DRAFT_ID = 'assem/config/site-config.draft.json';
export const BACKUP_PREFIX = 'assem/config/backups/';
export const MAX_BACKUPS = 25;

export interface CloudinaryCreds {
  cloud: string;
  key: string;
  secret: string;
}

export function getCreds(): CloudinaryCreds | null {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  return cloud && key && secret ? { cloud, key, secret } : null;
}

const need = (): CloudinaryCreds => {
  const c = getCreds();
  if (!c) throw new Error('Cloudinary is not configured on the server.');
  return c;
};

const basic = (c: CloudinaryCreds) => `Basic ${Buffer.from(`${c.key}:${c.secret}`).toString('base64')}`;
const encodeId = (id: string) => id.split('/').map(encodeURIComponent).join('/');

/** Cloudinary's signing rule: sha1 of the sorted "k=v&k=v" string + the API secret. */
export function sign(params: Record<string, string | number | boolean>, secret: string): string {
  const base = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return createHash('sha1').update(base + secret).digest('hex');
}

/** Reads a raw JSON asset. Goes through the Admin API to get the *current version's* URL, so it is never stale. */
export async function readRawJson<T = unknown>(publicId: string): Promise<{ data: T; version: number } | null> {
  const c = need();
  const meta = await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/resources/raw/upload/${encodeId(publicId)}`, {
    headers: { Authorization: basic(c) },
  });
  if (meta.status === 404) return null;
  if (!meta.ok) throw new Error(`Cloudinary lookup failed (${meta.status})`);
  const { secure_url: url, version } = (await meta.json()) as { secure_url: string; version: number };
  const file = await fetch(url);
  if (!file.ok) throw new Error(`Cloudinary download failed (${file.status})`);
  return { data: (await file.json()) as T, version };
}

/** Writes (or overwrites) a raw JSON asset and invalidates the CDN copy. */
export async function writeRawJson(publicId: string, data: unknown): Promise<number> {
  const c = need();
  const folder = publicId.split('/').slice(0, -1).join('/');
  const params = {
    asset_folder: folder,
    invalidate: 'true',
    overwrite: 'true',
    public_id: publicId,
    timestamp: Math.floor(Date.now() / 1000),
  };
  const form = new FormData();
  form.set('file', `data:application/json;base64,${Buffer.from(JSON.stringify(data)).toString('base64')}`);
  form.set('api_key', c.key);
  form.set('signature', sign(params, c.secret));
  Object.entries(params).forEach(([k, v]) => form.set(k, String(v)));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/raw/upload`, { method: 'POST', body: form });
  const body = (await res.json().catch(() => ({}))) as { version?: number; error?: { message?: string } };
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${body.error?.message ?? res.status}`);
  return body.version ?? 0;
}

export async function listRaw(prefix: string, max = 100) {
  const c = need();
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${c.cloud}/resources/raw/upload?prefix=${encodeURIComponent(prefix)}&max_results=${max}`,
    { headers: { Authorization: basic(c) } }
  );
  if (!res.ok) throw new Error(`Cloudinary list failed (${res.status})`);
  const data = (await res.json()) as { resources?: { public_id: string; created_at: string; bytes: number; version: number }[] };
  return (data.resources ?? []).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function deleteRaw(publicIds: string[]) {
  if (!publicIds.length) return;
  const c = need();
  const q = publicIds.map((id) => `public_ids[]=${encodeURIComponent(id)}`).join('&');
  await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/resources/raw/upload?${q}&invalidate=true`, {
    method: 'DELETE',
    headers: { Authorization: basic(c) },
  });
}

/** Images under the "assem" folder tree, newest first. */
export async function listImages(folder: string, cursor?: string) {
  const c = need();
  const safe = folder.replace(/"/g, '');
  const expression = `(asset_folder="${safe}" OR asset_folder:"${safe}/*") AND resource_type:image`;
  const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/resources/search`, {
    method: 'POST',
    headers: { Authorization: basic(c), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      expression,
      sort_by: [{ created_at: 'desc' }],
      max_results: 60,
      fields: 'public_id,width,height,version,format,asset_folder,bytes,created_at',
      ...(cursor ? { next_cursor: cursor } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Cloudinary search failed (${res.status})`);
  return (await res.json()) as { resources: unknown[]; next_cursor?: string; total_count: number };
}

/** Parameters the browser needs to upload an image straight to Cloudinary into `folder`. */
export function signUpload(folder: string) {
  const c = need();
  const params = {
    asset_folder: folder,
    timestamp: Math.floor(Date.now() / 1000),
    unique_filename: 'true',
    use_filename: 'true',
  };
  return { cloudName: c.cloud, apiKey: c.key, signature: sign(params, c.secret), params };
}
