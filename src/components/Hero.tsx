import React, { useEffect, useMemo, useRef } from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import { prefersReducedMotion, useIntroDone } from './fx';
import { useSiteConfig } from '../config/SiteConfigContext';
import { tx } from '../config/siteConfig';

interface HeroProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
}


/** Splits the headline into words; the accent phrase stays one unbreakable token. */
function headlineTokens(text: string, accentPhrase: string) {
  /** The phrase in the headline that gets the highlight + underline sweep (set in the dashboard). */
  const accent = accentPhrase && text.includes(accentPhrase) ? accentPhrase : undefined;
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

/** Stat values are free text in the dashboard: '500+' -> 500 with suffix '+', '+500' -> prefix '+' and 500, '12' -> 12. */
const statParts = (v: string) => {
  const m = v.match(/^([^\d]*)(\d[\d,.]*)(.*)$/s);
  return m ? { prefix: m[1], num: parseInt(m[2].replace(/[,.]/g, ''), 10) || 0, suffix: m[3] } : { prefix: '', num: 0, suffix: v };
};

/** Counts up once the hero plays. Writes straight to the DOM, no re-renders. */
const Count: React.FC<{ to: number; prefix?: string; suffix?: string; run: boolean; delay?: number; className?: string }> = ({
  to,
  prefix = '',
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
      node.textContent = `${prefix}${run || prefersReducedMotion() ? to : 0}${suffix}`;
      return;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t + delay;
      const p = Math.max(0, Math.min(1, (t - t0) / 1300));
      node.textContent = `${prefix}${Math.round(to * (1 - Math.pow(1 - p, 3)))}${suffix}`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, prefix, suffix, delay]);
  return (
    <span ref={el} className={className}>
      {prefix}0{suffix}
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
            <span className={cn('inline-block whitespace-nowrap', tok.accent && 'type-accent text-accent')}>
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
  const { cfg, img } = useSiteConfig();
  const ready = useIntroDone();
  const tokens = useMemo(
    () => headlineTokens(t.hero.headline, tx(cfg.content.hero.headlineAccent, lang)),
    [t.hero.headline, cfg.content.hero.headlineAccent, lang]
  );
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
            src={img(cfg.content.hero.image)}
            alt=""
            width={2400}
            height={1350}
            loading="eager"
            fetchPriority="high"
            className="hero-bg absolute inset-0 w-full h-full object-cover object-[center_30%] lg:object-[62%_42%]"
          />
          {/* Gradients for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-canvas from-1% via-canvas/45 via-32% to-transparent to-65%" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-black/25 lg:hidden" />
        </div>

        {/* Credentials badge over the photo (desktop): anchored to the pinned frame itself
            (not the scrolling text below) so it always sits on-screen, never scrolled out of view. */}
        <div className="hero-badge pointer-events-auto hidden lg:block absolute bottom-12 end-8 xl:end-12 w-80 p-4 bg-canvas/85 backdrop-blur-md border border-neutral-800 z-20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-accent">
                {t.stats.doctorLabel}
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {tx(cfg.content.hero.badge, lang)}
              </div>
            </div>
            <div className="text-end">
              <div className="text-lg font-black text-accent font-mono leading-none">{t.stats.transformationsCount}</div>
              <div className="text-[10px] text-neutral-400 uppercase mt-1">{tx(cfg.content.hero.badgeClients, lang)}</div>
            </div>
          </div>
        </div>

        {/* Ambient bottom gradient inside the sticky frame, blending into the content below it */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-36 md:h-48 bg-gradient-to-t from-canvas via-canvas/70 to-transparent z-10" />
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
                          className={cn(tok.accent && 'hero-accent text-accent whitespace-nowrap')}
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
                {cfg.ctas.start.visible && (
                  <button
                    type="button"
                    onClick={onOpenConsultation}
                    className="hero-cta relative overflow-hidden inline-flex items-center justify-center py-2.5 sm:py-4 px-4 sm:px-7 min-h-[38px] sm:min-h-[48px] text-[0.68rem] sm:text-sm font-black uppercase tracking-wider text-white bg-brand hover:bg-brand-hover active:scale-[0.98] transition-all shadow-[0_0_16px_color-mix(in_srgb,var(--color-brand)_25%,transparent)] sm:shadow-[0_0_24px_color-mix(in_srgb,var(--color-brand)_30%,transparent)] whitespace-nowrap cursor-pointer"
                  >
                    <span className="relative z-10">{t.hero.ctaStart}</span>
                  </button>
                )}

                {cfg.navbar.links.some((l) => l.key === 'calculator' && l.visible) && (
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="inline-flex items-center justify-center py-2.5 sm:py-4 px-4 sm:px-6 min-h-[38px] sm:min-h-[48px] text-[0.68rem] sm:text-sm font-bold uppercase tracking-wider text-white border border-neutral-700 bg-neutral-900/80 backdrop-blur-sm hover:bg-neutral-800 hover:border-neutral-500 transition-all whitespace-nowrap cursor-pointer"
                >
                  {t.nav.calculator}
                </button>
                )}
              </div>

              {/* Inline Unboxed Trust Metrics (count up) */}
              <div className="hero-fade mt-7 lg:mt-8 pt-5 lg:pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400 font-mono" style={{ ['--d' as any]: 0.8 }}>
                <div className="flex items-center gap-1.5">
                  <Count to={statParts(t.stats.transformationsCount).num} prefix={statParts(t.stats.transformationsCount).prefix} suffix={statParts(t.stats.transformationsCount).suffix} run={ready} delay={1300} className="font-bold text-accent text-sm tabular-nums" />
                  <span>{t.stats.transformationsLabel}</span>
                </div>
                <span className="text-neutral-700" aria-hidden="true">/</span>
                <div className="flex items-center gap-1.5">
                  <Count to={statParts(t.stats.weeksChange).num} prefix={statParts(t.stats.weeksChange).prefix} suffix={statParts(t.stats.weeksChange).suffix} run={ready} delay={1450} className="font-bold text-white text-sm tabular-nums" />
                  <span>{t.stats.weeksLabel}</span>
                </div>
                <span className="text-neutral-700" aria-hidden="true">/</span>
                <div className="flex items-center gap-1.5">
                  <Count to={statParts(tx(cfg.content.hero.coachedStat.value, lang)).num} prefix={statParts(tx(cfg.content.hero.coachedStat.value, lang)).prefix} suffix={statParts(tx(cfg.content.hero.coachedStat.value, lang)).suffix} run={ready} delay={1600} className="font-bold text-white text-sm tabular-nums" />
                  <span>{tx(cfg.content.hero.coachedStat.label, lang)}</span>
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
