import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import { useSiteConfig } from '../config/SiteConfigContext';
import { tx } from '../config/siteConfig';

interface CoachShowcaseProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

/**
 * The coach on his own black studio backdrop, blended into the page so he reads as a cutout,
 * with a giant ghost word behind him.
 */
export const CoachShowcase: React.FC<CoachShowcaseProps> = ({ t, lang, onOpenConsultation }) => {
  const { cfg, img } = useSiteConfig();
  return (
    <section className="relative isolate overflow-hidden bg-canvas py-16 sm:py-24 md:py-32 @container">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8">
        {/* Copy column */}
        <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-5">
          <div className="text-xs font-bold tracking-widest text-accent uppercase mb-3">
            {tx(cfg.content.coach.tag, lang)}
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]',
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}
          >
            {tx(cfg.content.coach.heading, lang)}
          </h2>
          <p className="mt-4 max-w-md text-base sm:text-lg text-neutral-300 leading-relaxed">
            {tx(cfg.content.coach.text, lang)}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 font-mono">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-accent tabular-nums">
                {t.stats.experienceYears}
              </div>
              <div className="text-xs text-neutral-400 uppercase mt-0.5">{t.stats.experienceLabel}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                {t.stats.transformationsCount}
              </div>
              <div className="text-xs text-neutral-400 uppercase mt-0.5">{t.stats.transformationsLabel}</div>
            </div>
          </div>

          {cfg.ctas.start.visible && (
            <button
              type="button"
              onClick={onOpenConsultation}
              className="mt-8 inline-flex min-h-[44px] items-center justify-center bg-brand px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-brand-hover cursor-pointer"
            >
              {t.hero.ctaStart}
            </button>
          )}
        </div>

        {/* Coach photo. `mix-blend-lighten` drops his pure-black studio backdrop into the section
            colour (black never wins a "lighten"), so he reads as a cutout with the ghost word
            showing through around him; the bottom is masked so the crop line fades out too. */}
        <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end">
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center leading-none whitespace-nowrap',
              'text-[30vw] sm:text-[22vw] lg:text-[13vw] font-black tracking-tighter text-accent/[0.09]',
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}
            aria-hidden="true"
          >
            {tx(cfg.content.coach.badge, lang)}
          </div>
          <img
            src={img(cfg.content.coach.image)}
            alt={tx(cfg.content.coach.image.alt, lang)}
            loading="lazy"
            decoding="async"
            className="relative h-[52vh] sm:h-[62vh] lg:h-[72vh] w-auto max-w-full object-contain object-bottom mix-blend-lighten [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
          />
        </div>
      </div>
    </section>
  );
};
