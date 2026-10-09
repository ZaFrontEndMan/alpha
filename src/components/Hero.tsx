import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';

interface HeroProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  t,
  lang,
  onOpenConsultation,
  onOpenCalculator,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-neutral-800/80 @container">
      {/* Subtle ambient neon lime glow behind hero visual */}
      <div
        className="pointer-events-none absolute top-1/4 -right-10 -z-10 w-96 h-96 rounded-full bg-[#ccff00]/8 blur-[120px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Proposition & Authority */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#ccff00] uppercase mb-4">
              <span>{t.hero.tagline}</span>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <span className="text-white font-mono">{t.stats.transformationsCount}</span>
            </div>

            {/* Main Headline */}
            <h1 className={cn(
              "text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] [text-wrap:balance]",
              lang === 'en' ? 'font-sport tracking-tight' : 'font-cairo tracking-normal'
            )}>
              {t.hero.headline.split('90 days').length > 1 ? (
                <>
                  {t.hero.headline.split('90 days')[0]}
                  <span className="text-[#ccff00]">90 days</span>
                  {t.hero.headline.split('90 days')[1]}
                </>
              ) : t.hero.headline.includes('90 يوماً') ? (
                <>
                  {t.hero.headline.split('90 يوماً')[0]}
                  <span className="text-[#ccff00]">90 يوماً</span>
                  {t.hero.headline.split('90 يوماً')[1]}
                </>
              ) : (
                t.hero.headline
              )}
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              {t.hero.subheadline}
            </p>

            {/* The 4 Core Transformation Outcome Bullets */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              {t.hero.bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-[#121614] border border-neutral-800 text-xs sm:text-sm font-semibold text-neutral-200"
                >
                  <span className="text-[#ccff00] font-mono font-bold text-sm shrink-0">✓</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Responsive Actions with modified mobile button sizes */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 sm:py-4 px-7 min-h-[48px] text-xs sm:text-sm font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(204,255,0,0.3)] whitespace-nowrap cursor-pointer"
              >
                {t.hero.ctaStart}
              </button>

              <button
                type="button"
                onClick={onOpenCalculator}
                className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 sm:py-4 px-6 min-h-[48px] text-xs sm:text-sm font-bold uppercase tracking-wider text-white border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 hover:border-neutral-500 transition-all whitespace-nowrap cursor-pointer"
              >
                {t.nav.calculator}
              </button>
            </div>

            {/* Inline Unboxed Trust Metrics */}
            <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#ccff00] text-sm tabular-nums">500+</span>
                <span>{t.stats.transformationsLabel}</span>
              </div>
              <span className="text-neutral-700" aria-hidden="true">/</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm tabular-nums">12</span>
                <span>{t.stats.weeksLabel}</span>
              </div>
              <span className="text-neutral-700" aria-hidden="true">/</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm">100%</span>
                <span>M.D. Supervised</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Portrait Focal Carrier */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
                <img
                  src="/src/assets/images/dr_ahmed_assem_hero_1791556760890.jpg"
                  alt="Dr. Ahmed Assem, IFBB Pro Athlete and Medical Doctor"
                  className="w-full h-auto object-cover aspect-[4/3] lg:aspect-[4/5] filter brightness-95 contrast-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#090b0a] via-black/25 to-transparent opacity-95"
                  aria-hidden="true"
                />

                {/* Overlaid Medical Credentials Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#090b0a]/90 backdrop-blur-md border border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#ccff00]">
                        {t.stats.doctorLabel}
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {lang === 'en' ? 'IFBB PRO ATHLETE & M.D.' : 'بطل محترف IFBB Pro وطبيب بشري'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-neutral-400 uppercase">Alpha Team</div>
                      <div className="text-xs font-semibold text-[#ccff00] font-mono">500+ Clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
