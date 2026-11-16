/**
 * Single source of truth for everything the admin dashboard can edit.
 *
 * The defaults live in `site-config.default.json` (generated from the site as it shipped, by
 * `scripts/generate-default-config.ts`). The live config published from /admin is stored in Cloudinary and
 * merged over these defaults, so a missing or failed fetch never breaks the site.
 */
import defaultConfig from './site-config.default.json' with { type: 'json' };

/** A bilingual text. Every user-visible string is one of these. */
export interface L {
  en: string;
  ar: string;
}

/** An image: a bundled default (`asset` key, see assets.ts) or one uploaded to Cloudinary (`cloudinaryId`). */
export interface ImageRef {
  asset?: string;
  /** Cloudinary public_id, e.g. "assem/hero/person_1". Wins over `asset` when set. */
  cloudinaryId?: string;
  alt?: L;
}

export type SiteConfig = typeof defaultConfig;
export type SectionEntry = SiteConfig['sections'][number];
export type NavLinkConfig = SiteConfig['navbar']['links'][number];

export const DEFAULT_CONFIG: SiteConfig = defaultConfig;

export type Lang = 'en' | 'ar';

/** Picks the right language; falls back to the other one so a half-translated field never renders empty. */
export const tx = (value: L | undefined, lang: Lang): string => {
  if (!value) return '';
  return (value[lang] || value[lang === 'en' ? 'ar' : 'en'] || '') as string;
};

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

/** Objects merge key by key; arrays and primitives are replaced. Keeps new default keys when a saved config is older. */
export function mergeConfig<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base) || typeof base !== 'object' || base === null) return override as T;
  if (typeof override !== 'object' || Array.isArray(override)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
    out[k] = k in out ? mergeConfig((out as Record<string, Json>)[k], v) : v;
  }
  return out as T;
}

/**
 * Merges a saved config over the defaults, and makes sure sections / nav links that were added to the site after
 * that config was saved still show up (arrays are replaced wholesale by `mergeConfig`, so they would be missing).
 */
export function loadConfig(saved: unknown): SiteConfig {
  const merged = mergeConfig(DEFAULT_CONFIG, saved) as SiteConfig;
  const sections = [...merged.sections];
  for (const d of DEFAULT_CONFIG.sections) if (!sections.some((s) => s.type === d.type)) sections.push(structuredClone(d));
  const links = [...merged.navbar.links];
  for (const d of DEFAULT_CONFIG.navbar.links) if (!links.some((l) => l.key === d.key)) links.push(structuredClone(d));
  return { ...merged, sections, navbar: { ...merged.navbar, links } };
}
