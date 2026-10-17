import React, { useEffect, useRef, useState } from 'react';
import { LOGO_PATHS, LOGO_W, LOGO_H, LOGO_STYLE, logoColors } from './logoPaths';
import { markIntroDone, prefersReducedMotion } from './fx';

/**
 * Loader on pitch black. All of the motion is CSS (see .intro-* in index.css):
 *  0.10–1.00  the two pieces of the mark fly in from opposite corners, drawn as white outlines
 *  1.00–1.35  they lock together and fill white
 *  1.35–1.80  they turn to the brand colours (LOGO_STYLE), a light streak sweeps across
 *  1.40–2.10  AHMED ASSEM rises letter by letter, the tagline types in, counter runs to 100
 *  2.85       the whole panel slides up off the hero
 * Click, Esc, Enter or Space skips it.
 */

const NAME = 'AHMED ASSEM'.split('');
const TAGLINE = 'Personal trainer · IFBB Pro · M.D.';
const TOTAL = 2850;
const FINAL = logoColors(LOGO_STYLE);
const EXIT_MS = 900;

export const LogoIntro: React.FC = () => {
  const [phase, setPhase] = useState<'play' | 'leave' | 'gone'>(() =>
    prefersReducedMotion() ? 'gone' : 'play'
  );
  // counter, bar and tagline are written straight to the DOM each frame (no React renders)
  const countEl = useRef<HTMLSpanElement | null>(null);
  const barEl = useRef<HTMLSpanElement | null>(null);
  const tagEl = useRef<HTMLSpanElement | null>(null);
  const done = useRef(false);

  const leave = () => {
    if (done.current) return;
    done.current = true;
    // give the page its scroll back right away (touch scrolling relies on it)
    document.documentElement.style.overflow = '';
    setPhase((p) => (p === 'gone' ? p : 'leave'));
    markIntroDone(); // the hero starts while the panel lifts
    window.setTimeout(() => setPhase('gone'), EXIT_MS);
  };

  useEffect(() => {
    if (phase === 'gone') {
      leave();
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const e = t - t0;
      const p = Math.min(1, e / 2100);
      const pct = Math.round(100 * (1 - Math.pow(1 - p, 2)));
      const typed = Math.max(0, Math.min(TAGLINE.length, Math.floor((e - 1500) / 20)));
      if (countEl.current) countEl.current.textContent = String(pct).padStart(3, '0');
      if (barEl.current) barEl.current.style.transform = `scaleX(${pct / 100})`;
      if (tagEl.current) tagEl.current.textContent = TAGLINE.slice(0, typed);
      if (p < 1 || e < 2300) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const out = window.setTimeout(leave, TOTAL);

    const onKey = (ev: KeyboardEvent) => {
      if (['Escape', 'Enter', ' '].includes(ev.key)) leave();
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(out);
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      className={`intro fixed inset-0 z-[100] overflow-hidden bg-[#090b0a] text-white cursor-pointer select-none ${
        phase === 'leave' ? 'intro-leave' : ''
      }`}
      role="dialog"
      aria-label="Ahmed Assem intro"
      dir="ltr"
      onClick={leave}
    >
      {/* corner labels */}
      <div className="intro-fade absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 sm:p-8 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.2em] text-neutral-400">
        <span>Cairo, Egypt</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            leave();
          }}
          className="uppercase underline underline-offset-4 decoration-[#8cffdb] decoration-2 hover:text-[#8cffdb] cursor-pointer"
        >
          Skip intro
        </button>
      </div>

      {/* the mark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <svg
          viewBox={`-40 -40 ${LOGO_W + 80} ${LOGO_H + 80}`}
          className="intro-mark w-[min(64vw,26rem)] h-auto overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="intro-streak" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="intro-clip">
              <path d={LOGO_PATHS.stroke} />
              <path d={LOGO_PATHS.body} />
            </clipPath>
          </defs>

          <g className="intro-piece intro-stroke" style={{ ['--final' as any]: FINAL.stroke }}>
            <path d={LOGO_PATHS.stroke} pathLength={1} />
          </g>
          <g className="intro-piece intro-body" style={{ ['--final' as any]: FINAL.body }}>
            <path d={LOGO_PATHS.body} pathLength={1} />
          </g>

          {/* light streak across the finished mark */}
          <g clipPath="url(#intro-clip)">
            <rect className="intro-streak" x="-300" y="-40" width="260" height={LOGO_H + 80} fill="url(#intro-streak)" transform="skewX(-20)" />
          </g>
        </svg>

        {/* the name */}
        <h2
          aria-label="Ahmed Assem"
          className="font-sport mt-8 sm:mt-10 flex text-[clamp(2.6rem,10vw,6.5rem)] font-black leading-[0.85] tracking-[0.04em]"
        >
          {NAME.map((ch, i) => (
            <span key={i} className="relative overflow-hidden pb-[0.06em]" aria-hidden="true">
              <span className="intro-letter block" style={{ animationDelay: `${1400 + i * 45}ms` }}>
                {ch === ' ' ? ' ' : ch}
              </span>
            </span>
          ))}
        </h2>

        {/* rule + typed tagline */}
        <span className="intro-rule block h-[2px] bg-[#8cffdb] mt-4 w-[min(80vw,30rem)] origin-left" aria-hidden="true" />
        <p className="mt-3 w-[min(80vw,30rem)] font-mono text-[0.68rem] sm:text-sm uppercase tracking-[0.18em] text-[#8cffdb] h-[1.5em] text-center">
          <span ref={tagEl} />
          <span className="inline-block w-[0.55em] h-[1em] -mb-[0.15em] ml-0.5 bg-[#8cffdb] animate-[caret-blink_900ms_steps(1)_infinite]" />
        </p>
      </div>

      {/* counter */}
      <div className="intro-fade absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-8">
        <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Dr. Ahmed Assem
        </span>
        <span
          ref={countEl}
          className="font-sport text-6xl sm:text-8xl font-black leading-none tabular-nums text-white"
          aria-hidden="true"
        >
          000
        </span>
      </div>
      <span
        ref={barEl}
        className="absolute left-0 bottom-0 h-1.5 w-full bg-[#8cffdb] origin-left"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />
    </div>
  );
};
