import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';

interface InspirationBannerProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const InspirationBanner: React.FC<InspirationBannerProps> = ({
  t,
  lang,
  onOpenConsultation,
}) => {
  return (
    <section className="py-20 md:py-28 bg-[#0c0f0d] border-b border-neutral-800/80 relative overflow-hidden @container">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[#ccff00]/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-[#0e1210] border border-neutral-800 p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#ccff00]">
            <span>{t.banner.title}</span>
            <span className="text-neutral-600">·</span>
            <span>ALPHA TEAM</span>
          </div>

          <h2 className={cn(
            "text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight [text-wrap:balance]",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {lang === 'en'
              ? 'Build Your Best Shape With The Right System, Team, And Guidance'
              : 'ابنِ أفضل نسخة من جسمك مع النظام الصحيح، الفريق المناسب، والتوجيه الطبي'}
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            &ldquo;{t.banner.quote}&rdquo;
          </p>

          {/* 3 Pills: Custom Plan · Weekly Follow-up · Real Results */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-neutral-200">
            {t.banner.pills.map((pill, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-[#151a17] border border-neutral-800 flex items-center gap-2"
              >
                <span className="text-[#ccff00] font-mono">✓</span>
                <span>{pill}</span>
              </div>
            ))}
          </div>

          {/* Key Stat Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-800/80 font-mono">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#ccff00] tabular-nums">
                {t.stats.weeksChange}
              </div>
              <div className="text-xs text-neutral-400 mt-1 uppercase">
                {t.stats.weeksLabel}
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                {t.stats.transformationsCount}
              </div>
              <div className="text-xs text-neutral-400 mt-1 uppercase">
                {t.stats.transformationsLabel}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="text-lg sm:text-xl font-bold text-white mt-1">
                {t.stats.doctorLabel}
              </div>
              <div className="text-xs text-neutral-400 mt-1 uppercase">
                IFBB PRO & M.D.
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-10 py-4 min-h-[48px] text-xs sm:text-sm font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] cursor-pointer"
            >
              {t.banner.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
