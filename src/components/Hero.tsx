import React, { useEffect, useMemo, useRef } from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import { prefersReducedMotion, useIntroDone } from './fx';
import coachHeader from '../assets/person/person_1.jpg';

interface HeroProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
}

/** Phrases in the headline that get the lime highlight + underline sweep. */
const ACCENTS = ['12 weeks', '12 أسبوعاً'];

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
    }, 650);
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
            <span className={cn('inline-block whitespace-nowrap', tok.accent && 'type-accent text-[#8cffdb]')}>
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
  const wordsEnd = 0.6 + tokens.length * 0.07; // when the last word has started rising (s)

  return (
    <section
      data-no-reveal
      className={cn('hero relative @container', ready && 'hero-in')}
      style={{ ['--words-end' as any]: `${wordsEnd}s` }}
    >
      {/* Sticky photo frame: pinned while the text scrolls up over it, and released exactly when its
          bottom (with the fade-out gradient) reaches the end of the section — so it hands over to the
          next section on the base colour instead of a hard edge. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 rtl:-scale-x-100" aria-hidden="true">
          <img
            src={coachHeader}
            alt=""
            width={2400}
            height={1350}
            loading="eager"
            fetchPriority="high"
            className="hero-bg absolute inset-0 w-full h-full object-cover object-[center_30%] lg:object-[62%_42%]"
          />
          {/* Gradients for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090b0a] from-1% via-[#090b0a]/45 via-32% to-transparent to-65%" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b0a] via-[#090b0a]/20 to-black/25 lg:hidden" />
        </div>

        {/* Credentials badge over the photo (desktop): anchored to the pinned frame itself
            (not the scrolling text below) so it always sits on-screen, never scrolled out of view. */}
        <div className="hero-badge pointer-events-auto hidden lg:block absolute bottom-12 end-8 xl:end-12 w-80 p-4 bg-[#090b0a]/85 backdrop-blur-md border border-neutral-800 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#8cffdb]">
                {t.stats.doctorLabel}
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {lang === 'en' ? 'IFBB PRO ATHLETE & M.D.' : 'بطل محترف IFBB Pro وطبيب بشري'}
              </div>
            </div>
            <div className="text-end">
              <div className="text-lg font-black text-[#8cffdb] font-mono leading-none">500+</div>
              <div className="text-[10px] text-neutral-400 uppercase mt-1">{lang === 'en' ? 'Clients' : 'متدرب'}</div>
            </div>
          </div>
        </div>

        {/* Ambient bottom gradient inside the sticky frame, blending into the content below it */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-36 md:h-48 bg-gradient-to-t from-[#090b0a] via-[#090b0a]/70 to-transparent z-10" />
      </div>

      {/* Scrolling foreground, pulled up one screen to sit over the photo; the text travels up and clears it */}
      <div className="relative z-10 -mt-[100svh]">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 min-h-[100svh] flex flex-col justify-start pt-24 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Proposition & Authority */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {/* Mobile headline */}
              <div className="lg:hidden mb-4">
                <TypedHeadline
                  tokens={tokens}
                  run={ready}
                  label={t.hero.headline}
                  className={cn(
                    'font-black text-white text-[clamp(1.4rem,6.5vw,2.4rem)]',
                    lang === 'en' ? 'font-sport tracking-tight leading-[1.08]' : 'font-cairo leading-[1.3]'
                  )}
                />
                <div className="mt-2 text-[0.65rem] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  <span className="text-white font-bold">{t.stats.transformationsCount}</span> {t.stats.transformationsLabel}
                </div>
              </div>

              {/* Desktop headline: words rise one after another out of a mask */}
              <h1
                aria-label={t.hero.headline}
                className={cn(
                  'hidden lg:block text-5xl xl:text-6xl font-black text-white leading-[1.08] [text-wrap:balance]',
                  lang === 'en' ? 'font-sport tracking-tight' : 'font-cairo tracking-normal leading-[1.3]'
                )}
              >
                <span aria-hidden="true">
                  {tokens.map((tok, i) => (
                    <React.Fragment key={`${lang}-${i}`}>
                      <span className="hero-word">
                        <span
                          className={cn(tok.accent && 'hero-accent text-[#8cffdb] whitespace-nowrap')}
                          style={{ animationDelay: `${0.5 + i * 0.06}s` }}
                        >
                          {tok.w}
                        </span>
                      </span>{' '}
                    </React.Fragment>
                  ))}
                </span>
              </h1>

              {/* Subheadline */}
              <p className="hero-fade lg:mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl" style={{ ['--d' as any]: 0.25 }}>
                {t.hero.subheadline}
              </p>

              {/* Actions */}
              <div className="hero-fade mt-5 lg:mt-8 flex flex-row items-center gap-2 sm:gap-4" style={{ ['--d' as any]: 0.55 }}>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="hero-cta relative overflow-hidden inline-flex items-center justify-center py-2.5 sm:py-4 px-4 sm:px-7 min-h-[38px] sm:min-h-[48px] text-[0.68rem] sm:text-sm font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] active:scale-[0.98] transition-all shadow-[0_0_16px_rgba(140,255,219,0.25)] sm:shadow-[0_0_24px_rgba(140,255,219,0.3)] whitespace-nowrap cursor-pointer"
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
              <div className="hero-fade mt-7 lg:mt-8 pt-5 lg:pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400 font-mono" style={{ ['--d' as any]: 0.8 }}>
                <div className="flex items-center gap-1.5">
                  <Count to={500} suffix="+" run={ready} delay={1300} className="font-bold text-[#8cffdb] text-sm tabular-nums" />
                  <span>{t.stats.transformationsLabel}</span>
                </div>
                <span className="text-neutral-700" aria-hidden="true">/</span>
                <div className="flex items-center gap-1.5">
                  <Count to={12} run={ready} delay={1450} className="font-bold text-white text-sm tabular-nums" />
                  <span>{t.stats.weeksLabel}</span>
                </div>
                <span className="text-neutral-700" aria-hidden="true">/</span>
                <div className="flex items-center gap-1.5">
                  <Count to={100} suffix="%" run={ready} delay={1600} className="font-bold text-white text-sm tabular-nums" />
                  <span>M.D. Supervised</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll distance the photo stays pinned for. The text above is one screen tall, so this
            lets it travel most of the way off before the photo itself starts to move. */}
        <div className="h-[65svh]" aria-hidden="true" />
      </div>
    </section>
  );
};
