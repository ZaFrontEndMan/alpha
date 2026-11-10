import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CLOUDINARY_CLOUD_NAME } from '../utils/cloudinary';
import { BUNDLED_ASSETS } from './assets';
import { DEFAULT_CONFIG, mergeConfig } from './siteConfig';
import type { ImageRef, Lang, SiteConfig } from './siteConfig';
import { buildTranslations } from './buildTranslations';
export { buildTranslations };

const CACHE_KEY = 'siteConfig:v1';

/** Last config this browser saw. Used for the first paint so a returning visitor never sees the defaults flash. */
const isPreview = () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'draft';

function readCached(): SiteConfig {
  if (isPreview()) return DEFAULT_CONFIG; // the draft is fetched fresh, never cached
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (raw) return mergeConfig(DEFAULT_CONFIG, JSON.parse(raw));
  } catch {
    /* storage blocked or corrupt: ignore */
  }
  return DEFAULT_CONFIG;
}

interface Ctx {
  cfg: SiteConfig;
  /** Resolves an image ref to a URL; pass a width to get a Cloudinary-resized version. */
  img: (ref: ImageRef | undefined, width?: number) => string;
  /** Section visibility by section type ('hero', 'packages' …). */
  isSectionVisible: (type: string) => boolean;
}

const SiteConfigContext = createContext<Ctx | null>(null);

export const cloudinaryImageUrl = (publicId: string, width?: number) => {
  const size = width ? `c_limit,w_${width},` : '';
  const id = publicId.split('/').map(encodeURIComponent).join('/');
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${size}f_auto,q_auto/${id}`;
};

/** Theme colours → CSS variables (Tailwind reads them through the @theme tokens in index.css). */
function applyTheme(cfg: SiteConfig) {
  const s = document.documentElement.style;
  const c = cfg.site.colors;
  s.setProperty('--color-brand', c.primary);
  s.setProperty('--color-brand-hover', c.primaryHover);
  s.setProperty('--color-accent', c.accent);
  s.setProperty('--color-canvas', c.background);
  s.setProperty('--color-neutral-900', c.surface);
  s.setProperty('--color-white', c.text);
  s.setProperty('--color-neutral-100', c.text);
}

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cfg, setCfg] = useState<SiteConfig>(readCached);

  useEffect(() => {
    const controller = new AbortController();
    const preview = isPreview();
    fetch(preview ? '/api/site-config?draft=1' : '/api/site-config', { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { config?: unknown } | null) => {
        if (!data?.config) return;
        setCfg(mergeConfig(DEFAULT_CONFIG, data.config));
        if (preview) return;
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(data.config));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* offline / API not available (e.g. plain `vite preview`): the defaults are already showing */
      });
    return () => controller.abort();
  }, []);

  useEffect(() => applyTheme(cfg), [cfg]);

  const img = useCallback(
    (ref: ImageRef | undefined, width?: number) => {
      if (!ref) return '';
      if (ref.cloudinaryId) return cloudinaryImageUrl(ref.cloudinaryId, width);
      return (ref.asset && BUNDLED_ASSETS[ref.asset]) || '';
    },
    []
  );

  const value = useMemo<Ctx>(
    () => ({
      cfg,
      img,
      isSectionVisible: (type: string) => cfg.sections.some((s) => s.type === type && s.visible),
    }),
    [cfg, img]
  );

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
      {isPreview() && (
        <div className="fixed bottom-3 start-3 z-[200] rounded-md bg-amber-500 px-3 py-1.5 text-xs font-black text-black shadow-lg">
          Draft preview — not published yet
        </div>
      )}
    </SiteConfigContext.Provider>
  );
};

export function useSiteConfig(): Ctx {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used inside <SiteConfigProvider>');
  return ctx;
}

/** `translations[lang]`, built from the live config and memoised per language. */
export function useTranslations(lang: Lang) {
  const { cfg } = useSiteConfig();
  return useMemo(() => buildTranslations(cfg, lang), [cfg, lang]);
}
