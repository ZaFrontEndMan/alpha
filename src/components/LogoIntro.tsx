import React, { useEffect, useRef, useState } from 'react';
import { markIntroDone, prefersReducedMotion } from './fx';

/**
 * Loader on pitch black. All of the motion is CSS (see .intro-* in index.css):
 *  0.10–1.10  the supplied wordmark fades and scales into place
 *  1.40–2.10  the specialty types in and the counter runs to 100
 *  2.85       the whole panel slides up off the hero
 * Click, Esc, Enter or Space skips it.
 */

const TOTAL = 2850;
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
      if (countEl.current) countEl.current.textContent = String(pct).padStart(3, '0');
      if (barEl.current) barEl.current.style.transform = `scaleX(${pct / 100})`;
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
      className={`intro fixed inset-0 z-[100] overflow-hidden bg-[#090b0a] text-white cursor-pointer select-none ${phase === 'leave' ? 'intro-leave' : ''
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
        <img
          src="/brand-logo.png"
          alt="Dr. Ahmed Assem Cosmetic Dentist"
          className="intro-mark w-[min(84vw,42rem)] h-auto mix-blend-screen"
          style={{ mixBlendMode: 'screen' }}
        />
        <p className="mt-7 w-[min(80vw,30rem)] font-mono text-[0.68rem] sm:text-sm uppercase tracking-[0.18em] text-[#8cffdb] h-[1.5em] text-center">
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
