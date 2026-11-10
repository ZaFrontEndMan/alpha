/**
 * GET /api/site-config
 * Returns the published site configuration (the JSON saved from /admin), or { config: null } when nothing has been
 * published yet, in which case the site falls back to the defaults bundled in the app.
 *
 * The file lives in Cloudinary as a raw asset: assem/config/site-config.json
 * Server-only env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * We ask the Admin API for the file's current version URL instead of the plain CDN URL, because Cloudinary's CDN can
 * keep serving the previous file for a while after an overwrite. A versioned URL is always the new content.
 * The response is cached for a few seconds at the edge so visitors don't each trigger an Admin API call.
 */


import { DRAFT_ID, PUBLISHED_ID } from './_lib/cloudinary.js';
import { readSession } from './_lib/auth.js';

export default async function handler(
  request: { method?: string; url?: string; headers?: Record<string, string | string[] | undefined> },
  response: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { json: (data: unknown) => void };
  }
) {
  response.setHeader('Content-Type', 'application/json');

  if (request.method && request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud || !key || !secret) {
    // Not configured (e.g. local dev without .env): behave as "nothing published".
    response.setHeader('Cache-Control', 'no-store');
    return response.status(200).json({ config: null });
  }

  try {
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    // ?draft=1 shows the unpublished draft, but only to a signed-in admin (used by the dashboard's Preview button).
    const wantsDraft = new URL(request.url ?? '/', 'http://local').searchParams.get('draft') === '1';
    const useDraft = wantsDraft && Boolean(readSession(request.headers ?? {}));
    const encodedId = (useDraft ? DRAFT_ID : PUBLISHED_ID).split('/').map(encodeURIComponent).join('/');
    const meta = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/resources/raw/upload/${encodedId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (meta.status === 404) {
      response.setHeader('Cache-Control', useDraft ? 'no-store' : 'public, s-maxage=10, stale-while-revalidate=30');
      return response.status(200).json({ config: null });
    }
    if (!meta.ok) throw new Error(`Cloudinary lookup failed (${meta.status})`);

    const { secure_url: url, version } = (await meta.json()) as { secure_url: string; version: number };
    const file = await fetch(url);
    if (!file.ok) throw new Error(`Config download failed (${file.status})`);
    const config = await file.json();

    response.setHeader('Cache-Control', useDraft ? 'private, no-store' : 'public, s-maxage=10, stale-while-revalidate=30');
    return response.status(200).json({ config, version });
  } catch (error) {
    console.error('[api/site-config]', error);
    // The site still works from its bundled defaults / last cached copy.
    response.setHeader('Cache-Control', 'no-store');
    return response.status(502).json({ error: 'Could not load site configuration.' });
  }
}
