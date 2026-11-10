import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import { useSiteConfig } from '../config/SiteConfigContext';
import { tx } from '../config/siteConfig';

interface WorkoutsSectionProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const WorkoutsSection: React.FC<WorkoutsSectionProps> = ({ t, lang, onOpenConsultation }) => {
  const { cfg, img } = useSiteConfig();
  const en = lang === 'en';

  const cards = [
    {
      titleLead: tx(cfg.content.workouts.cards[0].titleLead, lang),
      title: tx(cfg.content.workouts.cards[0].title, lang),
      body: tx(cfg.content.workouts.cards[0].body, lang),
    },
    {
      titleLead: tx(cfg.content.workouts.cards[1].titleLead, lang),
      title: tx(cfg.content.workouts.cards[1].title, lang),
      body: tx(cfg.content.workouts.cards[1].body, lang),
    },
  ];

  return (
    <section id="workouts" className="relative overflow-hidden py-20 md:py-28 bg-canvas @container">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Photo */}
          <div className="lg:col-span-5 relative">
            <img
              src={img(cfg.content.workouts.image)}
              alt={tx(cfg.content.workouts.image.alt, lang)}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5] object-cover rounded-xl"
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-canvas/70 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="text-xs font-bold tracking-widest text-accent uppercase mb-3">
              {tx(cfg.content.workouts.badge, lang)}
            </div>

            <div className="space-y-8">
              {cards.map((card) => (
                <div key={card.title}>
                  <h3
                    className={cn(
                      'text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight [text-wrap:balance]',
                      en ? 'font-sport' : 'font-cairo'
                    )}
                  >
                    <span className="text-accent">{card.titleLead}</span> {card.title}
                  </h3>
                  <p className="mt-3 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">{card.body}</p>
                </div>
              ))}
            </div>

            {cfg.ctas.start.visible && (
              <button
                type="button"
                onClick={onOpenConsultation}
                className="mt-9 inline-flex min-h-[44px] items-center justify-center bg-brand px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white transition-colors hover:bg-brand-hover cursor-pointer"
              >
                {t.hero.ctaStart}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
