import React, { useEffect, useState } from 'react';
import { Language, TranslationContent } from '../translations';
import { cn } from '../utils/cn';
import personBg from '../assets/person/person_3.jpg';
import { PerspectiveGallery } from './PerspectiveGallery';
import { TRANSFORMATION_SNAPSHOT } from '../data/transformationPhotos';
import type { TransformationPhoto } from '../utils/cloudinary';

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
  const photos = useTransformationPhotos();

  const Card = (
    <div
      className="mx-auto max-w-xl flex flex-col justify-center px-4 text-center"
    >
      <span className="mx-auto mb-3 sm:mb-4 inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#E5484D]">
        {lang === 'en' ? 'Transformation' : 'التحول'}
      </span>
      <h2
        className={cn(
          'text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white [text-wrap:balance]',
          lang === 'en' ? 'font-sport' : 'font-cairo'
        )}
      >
        {lang === 'en' ? (
          <>Trusted by <span className="text-[#E5484D]">500+ clients</span> who changed their physique</>
        ) : (
          <>وثق بنا <span className="text-[#E5484D]">أكثر من 500 متدرب</span> غيّروا شكل أجسامهم</>
        )}
      </h2>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-neutral-300">
        {lang === 'en'
          ? 'Every photo here is a real client, coached end-to-end by Dr. Ahmed Assem.'
          : 'كل صورة هنا لمتدرب حقيقي، تابعه د. أحمد عاصم خطوة بخطوة من البداية للنهاية.'}
      </p>
      <button
        type="button"
        onClick={onOpenConsultation}
        className="mx-auto mt-4 sm:mt-5 inline-flex min-h-[38px] sm:min-h-[40px] items-center justify-center bg-[#B8232F] px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#E9E9E4] transition-colors hover:bg-[#9C1D28] cursor-pointer whitespace-nowrap"
      >
        {t.hero.ctaStart}
      </button>
    </div>
  );

  const altText = lang === 'en' ? 'Client transformations' : 'تحولات المتدربين';

  return (
    <section id="transformations" className="relative overflow-hidden pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-28">
      {/* Backdrop photo, not fixed-attachment (iOS/mobile renders `background-attachment: fixed`
          unreliably — it either glitches or silently falls back to scroll, and still costs the
          same paint either way), faded top and bottom so it blends into the sections around it. */}
      <img
        src={personBg}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/45 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-28 sm:h-40 bg-gradient-to-b from-[#1C1F24] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-40 bg-gradient-to-t from-[#1C1F24] to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative">
        <div className="mb-8 sm:mb-10">{Card}</div>
        {photos.length > 0 && <PerspectiveGallery photos={photos} alt={altText} />}
      </div>
    </section>
  );
};
