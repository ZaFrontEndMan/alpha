import React, { useEffect, useMemo, useRef } from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import { prefersReducedMotion, useIntroDone } from './fx';
import coachHeader from '../assets/images/coach-header.webp';

interface HeroProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
}

/** Phrases in the headline that get the lime highlight + underline sweep. */
const ACCENTS = ['90 days', '90 يوماً'];

/** Splits the headline into words; the accent phrase stays one unbreakable token. */
function headlineTokens(text: string) {
  const accent = ACCENTS.find((a) => text.includes(a));
  const parts = accent ? text.split(accent) : [text];
  const tokens: { w: string; accent?: boolean }[] = [];
  parts.forEach((part, i) => {
    part
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => tokens.push({ w }));
    if (accent && i < parts.length - 1) tokens.push({ w: accent, accent: true });
  });
  return tokens;
}

/** Counts up once the hero plays. Writes straight to the DOM, no re-renders. */
const Count: React.FC<{ to: number; suffix?: string; run: boolean; delay?: number; className?: string }> = ({
  to,
  suffix = '',
  run,
  delay = 0,
  className,
}) => {
  const el = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (!run || prefersReducedMotion()) {
      node.textContent = `${run || prefersReducedMotion() ? to : 0}${suffix}`;
      return;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t + delay;
      const p = Math.max(0, Math.min(1, (t - t0) / 1300));
      node.textContent = `${Math.round(to * (1 - Math.pow(1 - p, 3)))}${suffix}`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, suffix, delay]);
  return (
    <span ref={el} className={className}>
      0{suffix}
    </span>
  );
};

/**
 * Mobile headline: types itself in, letter by letter, over the 16:9 banner.
 * Every glyph is laid out from the start (just invisible), so nothing reflows while it types.
 */
const TypedHeadline: React.FC<{ tokens: { w: string; accent?: boolean }[]; run: boolean; className?: string; label: string }> = ({
  tokens,
  run,
  className,
  label,
}) => {
  const ref = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const chars = Array.from(root.querySelectorAll<HTMLElement>('.type-ch'));
    chars.forEach((c) => (c.dataset.on = 'false'));
    root.dataset.typed = 'false';
    if (!run) return;
    if (prefersReducedMotion()) {
      chars.forEach((c) => (c.dataset.on = 'true'));
      root.dataset.typed = 'true';
      return;
    }
    let i = 0;
    let prev: HTMLElement | null = null;
    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        const c = chars[i++];
        if (c) c.dataset.on = 'true';
        prev?.classList.remove('type-caret');
        prev = c ?? null;
        if (i < chars.length) prev?.classList.add('type-caret');
        else {
          window.clearInterval(timer);
          root.dataset.typed = 'true';
        }
      }, 32);
    }, 250);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [run, tokens]);

  return (
    <h1 ref={ref} aria-label={label} className={className} data-typed="false">
      <span aria-hidden="true">
        {tokens.map((tok, i) => (
          <React.Fragment key={i}>
            <span className={cn('inline-block whitespace-nowrap', tok.accent && 'type-accent text-[#ccff00]')}>
              {Array.from(tok.w).map((c, ci) => (
                <span key={ci} className="type-ch" data-on="false">
                  {c === ' ' ? '\u00a0' : c}
                </span>
              ))}
            </span>{' '}
          </React.Fragment>
        ))}
      </span>
    </h1>
  );
};

export const Hero: React.FC<HeroProps> = ({
  t,
  lang,
  onOpenConsultation,
  onOpenCalculator,
}) => {
  const ready = useIntroDone();
  const tokens = useMemo(() => headlineTokens(t.hero.headline), [t.hero.headline]);
  const wordsEnd = 0.2 + tokens.length * 0.055; // when the last word has started rising (s)

  return (
    <section
      data-no-reveal
      className={cn(
        'hero relative overflow-hidden border-b border-neutral-800/80 @container',
        // mobile/tablet: a 16:9 banner first, the rest of the copy under it
        'pt-0 pb-28 sm:pb-24',
        'lg:min-h-[calc(100svh-5rem)] lg:flex lg:flex-col lg:justify-center lg:pt-20 lg:pb-24',
        ready && 'hero-in'
      )}
      style={{ ['--words-end' as any]: `${wordsEnd}s` }}
    >
      {/* Desktop: the coach (coach-header) full bleed, copy on the dark side. Mirrored in Arabic. */}
      <div className="hidden lg:block pointer-events-none absolute inset-0 overflow-hidden rtl:-scale-x-100" aria-hidden="true">
        <img
          src={coachHeader}
          alt=""
          width={2400}
          height={1350}
          loading="eager"
          fetchPriority="high"
          className="hero-bg absolute inset-0 w-full h-full object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090b0a] from-10% via-[#090b0a]/70 via-40% to-transparent to-70%" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090b0a] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#090b0a]/70 to-transparent" />
      </div>

      {/* Mobile / tablet: the same photo as a 16:9 banner, the headline types itself over its dark side.
          The text column is exactly the banner's height. Mirrored in Arabic so the coach sits opposite the text. */}
      <div className="lg:hidden relative w-full aspect-video overflow-hidden border-b border-neutral-800/80">
        <div className="absolute inset-0 rtl:-scale-x-100" aria-hidden="true">
          <img
            src={coachHeader}
            alt=""
            width={2400}
            height={1350}
            loading="eager"
            fetchPriority="high"
            className="hero-bg absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090b0a]/90 via-[#090b0a]/45 via-45% to-transparent to-70%" />
        </div>
        <div className="relative h-full w-[60%] px-4 sm:px-6 py-[4%] flex flex-col justify-between">
          <div className="hero-tag inline-flex self-start items-center gap-1.5 text-[0.55rem] sm:text-xs font-bold tracking-widest text-[#ccff00] uppercase">
            <span className="hero-tag-dot w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#ccff00]" aria-hidden="true" />
            <span>{t.hero.tagline}</span>
          </div>
          <TypedHeadline
            tokens={tokens}
            run={ready}
            label={t.hero.headline}
            className={cn(
              'font-black text-white text-[clamp(1.05rem,5.2vw,2.4rem)]',
              lang === 'en' ? 'font-sport tracking-tight leading-[1.05]' : 'font-cairo leading-[1.35]'
            )}
          />
          <div className="text-[0.55rem] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">
            <span className="text-white font-bold">{t.stats.transformationsCount}</span> {t.stats.transformationsLabel}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Proposition & Authority */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tagline */}
            <div className="hero-tag hidden lg:inline-flex self-start items-center gap-2 text-xs font-bold tracking-widest text-[#ccff00] uppercase mb-4">
              <span className="hero-tag-dot w-1.5 h-1.5 bg-[#ccff00]" aria-hidden="true" />
              <span>{t.hero.tagline}</span>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <span className="text-white font-mono">{t.stats.transformationsCount}</span>
            </div>

            {/* Desktop headline: words rise one after another out of a mask */}
            <h1
              aria-label={t.hero.headline}
              className={cn(
                'hidden lg:block text-6xl font-black text-white leading-[1.08] [text-wrap:balance]',
                lang === 'en' ? 'font-sport tracking-tight' : 'font-cairo tracking-normal leading-[1.3]'
              )}
            >
              <span aria-hidden="true">
                {tokens.map((tok, i) => (
                  <React.Fragment key={`${lang}-${i}`}>
                    <span className="hero-word">
                      <span
                        className={cn(tok.accent && 'hero-accent text-[#ccff00] whitespace-nowrap')}
                        style={{ animationDelay: `${0.2 + i * 0.055}s` }}
                      >
                        {tok.w}
                      </span>
                    </span>{' '}
                  </React.Fragment>
                ))}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="hero-fade lg:mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl" style={{ ['--d' as any]: 0 }}>
              {t.hero.subheadline}
            </p>

            {/* The 4 Core Transformation Outcome Bullets (desktop only; on mobile the photo carries the hero) */}
            <div className="hidden lg:grid mt-6 grid-cols-2 gap-3 max-w-xl">
              {t.hero.bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="hero-fade flex items-center gap-2.5 p-3 bg-[#121614] border border-neutral-800 text-sm font-semibold text-neutral-200"
                  style={{ ['--d' as any]: 0.08 + idx * 0.07 }}
                >
                  <span className="text-[#ccff00] font-mono font-bold text-sm shrink-0">✓</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="hero-fade mt-5 lg:mt-8 flex flex-row items-center gap-2 sm:gap-4" style={{ ['--d' as any]: 0.3 }}>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="hero-cta relative overflow-hidden inline-flex items-center justify-center py-2.5 sm:py-4 px-4 sm:px-7 min-h-[38px] sm:min-h-[48px] text-[0.68rem] sm:text-sm font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] active:scale-[0.98] transition-all shadow-[0_0_16px_rgba(204,255,0,0.25)] sm:shadow-[0_0_24px_rgba(204,255,0,0.3)] whitespace-nowrap cursor-pointer"
              >
                <span className="relative z-10">{t.hero.ctaStart}</span>
              </button>

              <button
                type="button"
                onClick={onOpenCalculator}
                className="inline-flex items-center justify-center py-2.5 sm:py-4 px-4 sm:px-6 min-h-[38px] sm:min-h-[48px] text-[0.68rem] sm:text-sm font-bold uppercase tracking-wider text-white border border-neutral-700 bg-neutral-900/80 backdrop-blur-sm hover:bg-neutral-800 hover:border-neutral-500 transition-all whitespace-nowrap cursor-pointer"
              >
                {t.nav.calculator}
              </button>
            </div>

            {/* Inline Unboxed Trust Metrics (count up) */}
            <div className="hero-fade mt-7 lg:mt-8 pt-5 lg:pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400 font-mono" style={{ ['--d' as any]: 0.42 }}>
              <div className="flex items-center gap-1.5">
                <Count to={500} suffix="+" run={ready} delay={900} className="font-bold text-[#ccff00] text-sm tabular-nums" />
                <span>{t.stats.transformationsLabel}</span>
              </div>
              <span className="text-neutral-700" aria-hidden="true">/</span>
              <div className="flex items-center gap-1.5">
                <Count to={12} run={ready} delay={1000} className="font-bold text-white text-sm tabular-nums" />
                <span>{t.stats.weeksLabel}</span>
              </div>
              <span className="text-neutral-700" aria-hidden="true">/</span>
              <div className="flex items-center gap-1.5">
                <Count to={100} suffix="%" run={ready} delay={1100} className="font-bold text-white text-sm tabular-nums" />
                <span>M.D. Supervised</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Credentials badge over the photo (desktop) */}
      <div className="hero-badge hidden lg:block absolute bottom-10 end-8 xl:end-12 w-80 p-4 bg-[#090b0a]/85 backdrop-blur-md border border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#ccff00]">
              {t.stats.doctorLabel}
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {lang === 'en' ? 'IFBB PRO ATHLETE & M.D.' : 'بطل محترف IFBB Pro وطبيب بشري'}
            </div>
          </div>
          <div className="text-end">
            <div className="text-[10px] text-neutral-400 uppercase">Alpha Team</div>
            <div className="text-xs font-semibold text-[#ccff00] font-mono">500+ Clients</div>
          </div>
        </div>
      </div>
    </section>
  );
};
