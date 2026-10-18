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
    <section className="py-20 md:py-28 section-blend relative overflow-hidden @container">
      {/* The coach backdrop image directly behind texts */}
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
          className="absolute inset-0 h-full w-full object-cover object-[center_25%] lg:object-[75%_center] opacity-65 lg:opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090b0a]/90 via-[#090b0a]/50 to-transparent lg:via-[#090b0a]/35" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#090b0a] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#090b0a] to-transparent" />
      </div>

      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 mx-auto w-3/4 h-64 bg-[#8cffdb]/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* Texts placed directly on image with blend mode */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6 sm:space-y-8 text-start">
          {/* Header row: title pill + blend mode switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#8cffdb] bg-black/55 px-3 py-1.5 rounded-full border border-neutral-800 backdrop-blur-md">
              <span>{t.banner.title}</span>
              <span className="text-neutral-600">·</span>
              <span>DR. AHMED ASSEM</span>
            </div>
          </div>

          {/* Headline directly on image */}
          <h2
            className={cn(
              "text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] [text-wrap:balance]",
              lang === 'en' ? 'font-sport tracking-tight' : 'font-cairo leading-[1.3]'
            )}
          >
            {lang === 'en'
              ? 'Build Your Best Shape With The Right System, Team, And Guidance'
              : 'ابنِ أفضل نسخة من جسمك مع النظام الصحيح، الفريق المناسب، والتوجيه الطبي'}
          </h2>

          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl">
            &ldquo;{t.banner.quote}&rdquo;
          </p>

          {/* 3 Pills: Custom Plan · Weekly Follow-up · Real Results */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-neutral-200">
            {t.banner.pills.map((pill, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-black/60 border border-neutral-700/80 backdrop-blur-md flex items-center gap-2 rounded-lg"
              >
                <span className="text-[#8cffdb] font-mono">✓</span>
                <span>{pill}</span>
              </div>
            ))}
          </div>

          {/* Key Stat Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-700/60 font-mono">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#8cffdb] tabular-nums">
                {t.stats.weeksChange}
              </div>
              <div className="text-xs text-neutral-300 mt-1 uppercase font-semibold">
                {t.stats.weeksLabel}
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                {t.stats.transformationsCount}
              </div>
              <div className="text-xs text-neutral-300 mt-1 uppercase font-semibold">
                {t.stats.transformationsLabel}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="text-lg sm:text-xl font-bold text-white mt-1">
                {t.stats.doctorLabel}
              </div>
              <div className="text-xs text-neutral-300 mt-1 uppercase font-semibold">
                IFBB PRO & M.D.
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-10 py-4 min-h-[48px] text-xs sm:text-sm font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(140,255,219,0.35)] cursor-pointer"
            >
              {t.banner.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
