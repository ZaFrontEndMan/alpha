import React, { useEffect, useRef, useState } from 'react';
import { Language, TranslationContent } from '../translations';
import { cn } from '../utils/cn';
import { prefersReducedMotion } from './fx';
import personBg from '../assets/person/person_3.jpg';
import { TransformationsSlider } from './TransformationsSlider';
import { TRANSFORMATION_SNAPSHOT } from '../data/transformationPhotos';
import { cldSrcSet, cldUrl, isNearSquare, TransformationPhoto } from '../utils/cloudinary';

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

const DESKTOP_TILE_COUNT = 18;

interface TransformationsShowcaseProps {
  lang: Language;
  t: TranslationContent;
  onOpenConsultation: () => void;
}

/** One photo tile. Reveals once via the shared observer below, then stays put — never re-measured, never re-animated. */
const Tile: React.FC<{ photo: TransformationPhoto; alt: string; className?: string }> = ({ photo, alt, className }) => (
  <div
    data-tile
    className={cn(
      'reveal-tile relative w-full aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-[#121614] border border-neutral-800/80 shadow-md sm:shadow-2xl',
      className
    )}
  >
    <img
      src={cldUrl(photo, 400, 'fill')}
      srcSet={cldSrcSet(photo, [300, 400, 600, 800], 'fill')}
      sizes="(min-width: 1280px) 256px, 20vw"
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  </div>
);

const Column: React.FC<{ children: React.ReactNode; offset?: string; hide?: string }> = ({
  children,
  offset = '',
  hide = '',
}) => (
  <div className={cn('flex min-w-0 flex-1 flex-col gap-2 sm:gap-3 md:gap-4', offset, hide)}>{children}</div>
);

export const TransformationsShowcase: React.FC<TransformationsShowcaseProps> = ({
  lang,
  t,
  onOpenConsultation,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const photos = useTransformationPhotos();

  // Desktop collage: square shots crop cleanly into square tiles; the wider before/after
  // composites stay in the mobile slider, where they're shown whole.
  const squares = photos.filter(isNearSquare);
  const grid = (squares.length >= DESKTOP_TILE_COUNT ? squares : photos).slice(0, DESKTOP_TILE_COUNT);
  const gridKey = grid.map((p) => p.id).join('|');

  // Scroll-triggered reveal: each tile gets a fixed 0.2s step, but the steps are shuffled across
  // the tiles first, so the grid doesn't visibly sweep left-to-right — it pops in at random.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-tile]:not(.is-in)'));
    if (tiles.length === 0) return;

    if (prefersReducedMotion()) {
      tiles.forEach((el) => el.classList.add('is-in'));
      return;
    }

    // Fisher–Yates shuffle of step indices, capped so the longest wait stays short on mobile.
    const STEP = 0.2;
    const CAP = 6; // 0, 0.2s … 1.0s, then wraps
    const steps = tiles.map((_, i) => i % CAP);
    for (let i = steps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [steps[i], steps[j]] = [steps[j], steps[i]];
    }
    tiles.forEach((el, i) => {
      el.style.transitionDelay = `${(steps[i] * STEP).toFixed(1)}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    tiles.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // re-run when the live list swaps in different photos (new tile elements)
  }, [gridKey]);

  const Card = (
    <div
      data-tile
      className="reveal-tile flex flex-col justify-center p-4 sm:p-6 lg:p-5 xl:p-6 text-center "
    >
      <span className="mx-auto mb-3 sm:mb-4 inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8cffdb]">
        {lang === 'en' ? 'Transformation' : 'التحول'}
      </span>
      <h2
        className={cn(
          'text-xl sm:text-2xl lg:text-xl xl:text-2xl font-black leading-tight text-white [text-wrap:balance]',
          lang === 'en' ? 'font-sport' : 'font-cairo'
        )}
      >
        {lang === 'en' ? (
          <>Trusted by <span className="text-[#8cffdb]">500+ clients</span> who changed their physique</>
        ) : (
          <>وثق بنا <span className="text-[#8cffdb]">أكثر من 500 متدرب</span> غيّروا شكل أجسامهم</>
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
        className="mx-auto mt-4 sm:mt-5 inline-flex min-h-[38px] sm:min-h-[40px] items-center justify-center bg-[#8cffdb] px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-[#77d9ba] cursor-pointer whitespace-nowrap"
      >
        {t.hero.ctaStart}
      </button>
    </div>
  );

  const altText = lang === 'en' ? 'Client transformation' : 'تحول المتدرب';
  const at = (i: number) => grid[i % grid.length];

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
      <div className="absolute inset-x-0 top-0 h-28 sm:h-40 bg-gradient-to-b from-[#090b0a] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-40 bg-gradient-to-t from-[#090b0a] to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={rootRef} className="relative">
          {/* Mobile & tablet (< lg): pitch card, then a swipeable slider with every photo */}
          <div className="lg:hidden">
            <div className="mb-6 sm:mb-8">{Card}</div>
            <TransformationsSlider photos={photos} lang={lang} />
          </div>

          {/* Desktop (lg+): 5-column collage with the card in the centre */}
          {grid.length > 0 && (
            <div className="hidden lg:flex gap-2 sm:gap-3 md:gap-4">
              <Column>
                {[0, 1, 2, 3].map((i) => (
                  <Tile key={`d1-${i}`} photo={at(i)} alt={altText} />
                ))}
              </Column>

              <Column offset="mt-6 sm:mt-8 md:mt-10">
                {[4, 5, 6, 7].map((i) => (
                  <Tile key={`d2-${i}`} photo={at(i)} alt={altText} />
                ))}
              </Column>

              <Column>
                <Tile photo={at(8)} alt={altText} />
                {Card}
                <Tile photo={at(9)} alt={altText} />
              </Column>

              <Column offset="mt-6 sm:mt-8 md:mt-10">
                {[10, 11, 12, 13].map((i) => (
                  <Tile key={`d4-${i}`} photo={at(i)} alt={altText} />
                ))}
              </Column>

              <Column>
                {[14, 15, 16, 17].map((i) => (
                  <Tile key={`d5-${i}`} photo={at(i)} alt={altText} />
                ))}
              </Column>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
