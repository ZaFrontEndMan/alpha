import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import { useSiteConfig } from '../config/SiteConfigContext';
import { tx } from '../config/siteConfig';

interface FeaturesSectionProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  t,
  lang,
  onOpenConsultation,
}) => {
  const { cfg, img } = useSiteConfig();
  return (
    <section id="features" className="py-20 md:py-28 section-blend @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold tracking-widest text-accent uppercase mb-3">
            {t.features.tag}
          </div>
          <h2 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {t.features.heading}
          </h2>
        </div>

        {/* 3 Core Features Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Feature 1: Meal Plan */}
          <div className="bg-canvas border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              {/* Feature Icon Header */}
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-accent font-mono font-bold mb-6 group-hover:border-brand transition-colors">
                01
              </div>

              <h3 className={cn(
                "text-xl sm:text-2xl font-bold text-white mb-4",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {t.features.mealPlanTitle}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {t.features.mealPlanDesc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{tx(cfg.content.features.cards[0].footerLabel, lang)}</span>
              <span className="text-accent font-bold">{tx(cfg.content.features.cards[0].footerValue, lang)}</span>
            </div>
          </div>

          {/* Feature 2: Workout Program */}
          <div className="bg-canvas border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-accent font-mono font-bold mb-6 group-hover:border-brand transition-colors">
                02
              </div>

              <h3 className={cn(
                "text-xl sm:text-2xl font-bold text-white mb-4",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {t.features.workoutTitle}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {t.features.workoutDesc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{tx(cfg.content.features.cards[1].footerLabel, lang)}</span>
              <span className="text-accent font-bold">{tx(cfg.content.features.cards[1].footerValue, lang)}</span>
            </div>
          </div>

          {/* Feature 3: Home or Gym */}
          <div className="bg-canvas border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-accent font-mono font-bold mb-6 group-hover:border-brand transition-colors">
                03
              </div>

              <h3 className={cn(
                "text-xl sm:text-2xl font-bold text-white mb-4",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {t.features.locationTitle}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {t.features.locationDesc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{tx(cfg.content.features.cards[2].footerLabel, lang)}</span>
              <span className="text-accent font-bold">{tx(cfg.content.features.cards[2].footerValue, lang)}</span>
            </div>
          </div>
        </div>

        {/* START NOW CTA Box */}
        <div className="mt-16 bg-neutral-900 border border-brand/40 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
              {tx(cfg.content.features.ctaBox.eyebrow, lang)}
            </div>
            <h3 className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-black text-white",
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}>
              {tx(cfg.content.features.ctaBox.title, lang)}
            </h3>
            <p className="text-sm sm:text-base text-neutral-300">
              {tx(cfg.content.features.ctaBox.text, lang)}
            </p>
            <div className="pt-2">
              {cfg.ctas.start.visible && (
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto px-8 py-4 min-h-[48px] text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-brand hover:bg-brand-hover active:scale-[0.98] transition-all shadow-[0_0_25px_color-mix(in_srgb,var(--color-brand)_35%,transparent)] cursor-pointer"
                >
                  {t.hero.ctaStart}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
