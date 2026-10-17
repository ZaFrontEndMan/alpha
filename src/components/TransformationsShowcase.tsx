import React, { useEffect, useRef } from 'react';
import { Language, TranslationContent } from '../translations';
import { cn } from '../utils/cn';
import { prefersReducedMotion } from './fx';

/** Pulls every renamed client photo (1.jpg … n.jpg) in numeric order, no manual import list to maintain. */
const photoModules = import.meta.glob('../assets/transformation/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const PHOTOS = Object.entries(photoModules)
  .sort(([a], [b]) => {
    const na = parseInt(a.match(/(\d+)\.\w+$/)?.[1] ?? '0', 10);
    const nb = parseInt(b.match(/(\d+)\.\w+$/)?.[1] ?? '0', 10);
    return na - nb;
  })
  .map(([, url]) => url);

interface TransformationsShowcaseProps {
  lang: Language;
  t: TranslationContent;
  onOpenConsultation: () => void;
}

/** One photo tile. Reveals once via the shared observer below, then stays put — never re-measured, never re-animated. */
const Tile: React.FC<{ src: string; tall?: boolean; alt: string }> = ({ src, tall, alt }) => (
  <div
    data-tile
    className={cn(
      'reveal-tile relative w-full overflow-hidden rounded-xl bg-[#121614]',
      tall ? 'aspect-[3/4]' : 'aspect-[4/5]'
    )}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
    />
  </div>
);

const Column: React.FC<{ children: React.ReactNode; offset?: string; hide?: string }> = ({
  children,
  offset = '',
  hide = '',
}) => (
  <div className={cn('flex min-w-0 flex-1 flex-col gap-3 sm:gap-4', offset, hide)}>{children}</div>
);

export const TransformationsShowcase: React.FC<TransformationsShowcaseProps> = ({
  lang,
  t,
  onOpenConsultation,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Scroll-triggered reveal: each tile gets a fixed 0.2s step, but the steps are shuffled across
  // the tiles first, so the grid doesn't visibly sweep left-to-right — it pops in at random.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-tile]'));
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
  }, []);

  const Card = (
    <div
      data-tile
      className="reveal-tile flex h-full flex-col justify-center rounded-xl bg-[#0f1311] p-6 text-center sm:p-8"
    >
      <span className="mx-auto mb-4 inline-flex items-center rounded-full border border-neutral-700 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8cffdb]">
        {lang === 'en' ? 'Transformations' : 'التحولات'}
      </span>
      <h2
        className={cn(
          'text-2xl font-black leading-tight text-white sm:text-3xl [text-wrap:balance]',
          lang === 'en' ? 'font-sport' : 'font-cairo'
        )}
      >
        {lang === 'en' ? (
          <>Trusted by <span className="text-[#8cffdb]">500+ clients</span> who changed their physique</>
        ) : (
          <>وثق بنا <span className="text-[#8cffdb]">أكثر من 500 متدرب</span> غيّروا شكل أجسامهم</>
        )}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-300">
        {lang === 'en'
          ? 'Every photo here is a real client, coached end-to-end by Dr. Ahmed Assem.'
          : 'كل صورة هنا لمتدرب حقيقي، تابعه د. أحمد عاصم خطوة بخطوة من البداية للنهاية.'}
      </p>
      <button
        type="button"
        onClick={onOpenConsultation}
        className="mx-auto mt-5 inline-flex min-h-[40px] items-center justify-center bg-[#8cffdb] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-[#77d9ba]"
      >
        {t.hero.ctaStart}
      </button>
    </div>
  );

  return (
    <section className="bg-[#090b0a] py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={rootRef} className="relative">
          {/* Mobile & tablet: the pitch sits above the strip of photos */}
          <div className="mb-8 lg:hidden">{Card}</div>

          <div className="flex gap-3 sm:gap-4">
            <Column>
              {[0, 1, 2, 3, 4].map((i) => (
                <Tile key={i} src={PHOTOS[i % PHOTOS.length]} alt="" />
              ))}
            </Column>

            <Column offset="mt-8 sm:mt-10">
              {[5, 6, 7, 8].map((i) => (
                <Tile key={i} src={PHOTOS[i % PHOTOS.length]} tall alt="" />
              ))}
            </Column>

            <Column hide="hidden lg:flex">
              <Tile src={PHOTOS[9 % PHOTOS.length]} alt="" />
              <div className="aspect-[3/4] w-full">{Card}</div>
              <Tile src={PHOTOS[10 % PHOTOS.length]} alt="" />
            </Column>

            <Column offset="mt-8 sm:mt-10" hide="hidden sm:flex">
              {[11, 12, 13].map((i) => (
                <Tile key={i} src={PHOTOS[i % PHOTOS.length]} tall alt="" />
              ))}
            </Column>

            <Column hide="hidden lg:flex">
              {[14, 15, 16, 17].map((i) => (
                <Tile key={i} src={PHOTOS[i % PHOTOS.length]} alt="" />
              ))}
            </Column>
          </div>
        </div>
      </div>
    </section>
  );
};
