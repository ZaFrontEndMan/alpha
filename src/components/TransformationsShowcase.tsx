import React, { useEffect, useState } from 'react';
import { Language, TranslationContent } from '../translations';
import { cn } from '../utils/cn';
import { PerspectiveGallery } from './PerspectiveGallery';
import { TRANSFORMATION_SNAPSHOT } from '../data/transformationPhotos';
import type { TransformationPhoto } from '../utils/cloudinary';
import { useSiteConfig } from '../config/SiteConfigContext';
import { tx } from '../config/siteConfig';

/**
 * Client photos come from the Cloudinary "assem" folder. The baked-in snapshot paints immediately;
 * the live list from /api/transformations then replaces it, so new uploads appear without a deploy.
 * One request per page load, shared by every consumer.
 */
let livePhotos: Promise<TransformationPhoto[] | null> | null = null;
const loadLivePhotos = () =>
  (livePhotos ??= fetch('/api/transformations')
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (Array.isArray(d?.photos) && d.photos.length > 0 ? (d.photos as TransformationPhoto[]) : null))
    .catch(() => null));

function useTransformationPhotos() {
  const [photos, setPhotos] = useState<TransformationPhoto[]>(TRANSFORMATION_SNAPSHOT);
  useEffect(() => {
    let alive = true;
    loadLivePhotos().then((live) => {
      if (alive && live) setPhotos(live);
    });
    return () => {
      alive = false;
    };
  }, []);
  return photos;
}

interface TransformationsShowcaseProps {
  lang: Language;
  t: TranslationContent;
  onOpenConsultation: () => void;
}

export const TransformationsShowcase: React.FC<TransformationsShowcaseProps> = ({
  lang,
  t,
  onOpenConsultation,
}) => {
  const { cfg, img } = useSiteConfig();
  const photos = useTransformationPhotos();

  const Card = (
    <div
      className="mx-auto max-w-xl flex flex-col justify-center px-4 text-center"
    >
      <span className="mx-auto mb-3 sm:mb-4 inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-accent">
        {tx(cfg.content.transformations.badge, lang)}
      </span>
      <h2
        className={cn(
          'text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white [text-wrap:balance]',
          lang === 'en' ? 'font-sport' : 'font-cairo'
        )}
      >
        {tx(cfg.content.transformations.headlineBefore, lang)}
        <span className="text-accent">{tx(cfg.content.transformations.headlineAccent, lang)}</span>
        {tx(cfg.content.transformations.headlineAfter, lang)}
      </h2>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-neutral-300">
        {tx(cfg.content.transformations.subheading, lang)}
      </p>
      {cfg.ctas.start.visible && (
        <button
          type="button"
          onClick={onOpenConsultation}
          className="mx-auto mt-4 sm:mt-5 inline-flex min-h-[38px] sm:min-h-[40px] items-center justify-center bg-brand px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-brand-hover cursor-pointer whitespace-nowrap"
        >
          {t.hero.ctaStart}
        </button>
      )}
    </div>
  );

  const altText = tx(cfg.content.transformations.galleryAlt, lang);

  return (
    <section id="transformations" className="relative overflow-hidden pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-28">
      {/* Backdrop photo, not fixed-attachment (iOS/mobile renders `background-attachment: fixed`
          unreliably — it either glitches or silently falls back to scroll, and still costs the
          same paint either way), faded top and bottom so it blends into the sections around it. */}
      <img
        src={img(cfg.content.transformations.backgroundImage)}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/45 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-28 sm:h-40 bg-gradient-to-b from-canvas to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-40 bg-gradient-to-t from-canvas to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative">
        <div className="mb-8 sm:mb-10">{Card}</div>
        {photos.length > 0 && <PerspectiveGallery photos={photos} alt={altText} />}
      </div>
    </section>
  );
};
