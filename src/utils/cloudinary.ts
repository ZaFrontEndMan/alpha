/**
 * Client-side Cloudinary helpers. Only the cloud name lives here, which is public by design
 * (it's in every image URL). The API key/secret are read exclusively by /api/transformations.
 */
export const CLOUDINARY_CLOUD_NAME =
  (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || 'ecedoazg';

export interface TransformationPhoto {
  /** Cloudinary public_id */
  id: string;
  w: number;
  h: number;
  /** version, keeps CDN caches correct when a file is replaced */
  v: number;
  /** original format */
  f: string;
}

type Fit = 'fill' | 'limit';

/** Delivery URL with automatic format (AVIF/WebP) and quality, sized for the slot it fills. */
export function cldUrl(photo: TransformationPhoto, width: number, fit: Fit = 'limit'): string {
  const crop = fit === 'fill' ? `c_fill,ar_1:1,g_auto,w_${width}` : `c_limit,w_${width}`;
  const id = photo.id.split('/').map(encodeURIComponent).join('/');
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${crop},f_auto,q_auto/v${photo.v}/${id}.${photo.f}`;
}

export function cldSrcSet(photo: TransformationPhoto, widths: number[], fit: Fit = 'limit'): string {
  return widths
    .filter((w) => w <= Math.max(photo.w, widths[0]))
    .map((w) => `${cldUrl(photo, w, fit)} ${w}w`)
    .join(', ');
}

export const isNearSquare = (p: TransformationPhoto) => {
  const r = p.w / p.h;
  return r > 0.9 && r < 1.1;
};
