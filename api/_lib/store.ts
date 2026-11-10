/** Published site config, as seen by other serverless functions (e.g. the payment function reads prices from it). */
import { PUBLISHED_ID, getCreds, readRawJson } from './cloudinary.js';

let cache: { at: number; value: any } | null = null;

export async function getPublishedConfig(): Promise<any | null> {
  if (!getCreds()) return null;
  if (cache && Date.now() - cache.at < 10_000) return cache.value;
  try {
    const found = await readRawJson<any>(PUBLISHED_ID);
    cache = { at: Date.now(), value: found?.data ?? null };
    return cache.value;
  } catch (e) {
    console.error('[store] could not read published config', e);
    return null;
  }
}
