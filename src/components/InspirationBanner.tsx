import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import coachHeader from '../assets/images/coach-header.webp';

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
      {/* The coach behind the card (mirrored in RTL so he always sits on the open side) */}
      <div className="pointer-events-none absolute inset-0 rtl:-scale-x-100" aria-hidden="true">
        <img
          data-parallax="0.1"
          data-reveal-skip
          src={coachHeader}
          alt=""
          width={2400}
          height={1350}
          loading="lazy"
          decoding="async"
          className="absolute right-0 -top-[8%] h-[116%] w-full object-cover object-[75%_center] opacity-35 lg:w-auto lg:max-w-none lg:opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0f0d] via-[#0c0f0d]/70 to-transparent lg:via-[#0c0f0d]/40" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0c0f0d] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0c0f0d] to-transparent" />
      </div>

      {/* Background glow */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 mx-auto w-3/4 h-64 bg-[#ccff00]/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-[#0e1210]/85 backdrop-blur-sm border border-neutral-800 p-8 sm:p-12 text-center max-w-4xl lg:max-w-2xl mx-auto lg:ms-0 space-y-8">
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
