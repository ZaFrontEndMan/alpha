/**
 * GET /api/transformations
 * Lists every image in the Cloudinary "assem" folder (oldest file name first) so the
 * Transformations section picks up new uploads without a redeploy.
 *
 * Server-only env vars (never prefix with VITE_):
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   CLOUDINARY_TRANSFORMATIONS_FOLDER (optional, defaults to "assem")
 */

interface CloudinaryResource {
  public_id: string;
  width: number;
  height: number;
  version: number;
  format: string;
}

export default async function handler(
  request: { method?: string },
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
  const folder = process.env.CLOUDINARY_TRANSFORMATIONS_FOLDER || 'assem';

  if (!cloud || !key || !secret) {
    return response.status(503).json({ error: 'Cloudinary is not configured on the server.' });
  }

  try {
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const photos: { id: string; w: number; h: number; v: number; f: string }[] = [];
    let cursor: string | undefined;

    // Search API pages at 500; loop so the folder can grow past that.
    do {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/resources/search`, {
        method: 'POST',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression: `asset_folder="${folder.replace(/"/g, '\\"')}" AND resource_type:image`,
          sort_by: [{ public_id: 'asc' }],
          max_results: 500,
          fields: 'public_id,width,height,version,format',
          ...(cursor ? { next_cursor: cursor } : {}),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Cloudinary search failed (${res.status}): ${text.slice(0, 200)}`);
      }

      const data = (await res.json()) as { resources?: CloudinaryResource[]; next_cursor?: string };
      (data.resources ?? []).forEach((r) =>
        photos.push({ id: r.public_id, w: r.width, h: r.height, v: r.version, f: r.format })
      );
      cursor = data.next_cursor;
    } while (cursor && photos.length < 2000);

    // CDN-cache for 5 min, serve stale for a day while revalidating: one Cloudinary call per edge, not per visitor.
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return response.status(200).json({ photos });
  } catch (error) {
    console.error('[api/transformations]', error);
    return response.status(502).json({ error: 'Could not load transformation photos.' });
  }
}
