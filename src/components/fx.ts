import { useEffect, useState } from 'react';
import Lenis from 'lenis';

/* ------------------------------------------------------------------ */
/* Smooth scroll (same Lenis setup as the Consightve landing)          */
/* ------------------------------------------------------------------ */

let lenis: Lenis | null = null;
const NAV_OFFSET = -80; // sticky navbar is h-20

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Starts Lenis once for the whole page. Anchor links (#id) glide too. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({
      // lerp follows the wheel/trackpad every frame instead of replaying a fixed-length ease
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      anchors: { offset: NAV_OFFSET },
      autoRaf: true,
    });
    // hold the page still while the logo intro plays
    if (!introDone) lenis.stop();

    // href="#" (logo / Home) glides back to the top instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href="#"]');
      if (!a) return;
      e.preventDefault();
      lenis?.scrollTo(0);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};

export const stopScroll = () => lenis?.stop();
/** Resumes scrolling, but never while the intro is still holding the page. */
export const startScroll = () => {
  if (introDone) lenis?.start();
};

/* ------------------------------------------------------------------ */
/* Intro gate: the page waits for the logo intro to finish             */
/* ------------------------------------------------------------------ */

let introDone = false;
const introListeners = new Set<() => void>();

export const markIntroDone = () => {
  if (introDone) return;
  introDone = true;
  lenis?.start();
  introListeners.forEach((fn) => fn());
  introListeners.clear();
};

export function useIntroDone() {
  const [done, setDone] = useState(introDone);
  useEffect(() => {
    if (introDone) {
      setDone(true);
      return;
    }
    const fn = () => setDone(true);
    introListeners.add(fn);
    return () => {
      introListeners.delete(fn);
    };
  }, []);
  return done;
}

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */

/**
 * Finds the headings, intro copy and cards in every section of <main> and lets them rise in
 * as they scroll into view, staggered by their position among siblings.
 * A section can opt out with data-no-reveal, a single element with data-reveal-skip.
 * Nothing is hidden until the intro has finished, so the hero plays right after the loader.
 */
const CANDIDATES = [
  'h1',
  'h2',
  '[data-reveal-item]',
  'h1 ~ *',
  'h2 ~ p',
  '*:has(+ h1)',
  '*:has(+ h2)',
  '.grid > *',
  'img',
].join(',');

export function useScrollReveal() {
  const ready = useIntroDone();

  useEffect(() => {
    if (!ready || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const main = document.getElementById('main');
    if (!main) return;

    const picked: HTMLElement[] = [];
    main.querySelectorAll<HTMLElement>('section').forEach((section) => {
      if (section.closest('[data-no-reveal]')) return;
      let found: HTMLElement[] = [];
      try {
        found = Array.from(section.querySelectorAll<HTMLElement>(CANDIDATES));
      } catch {
        // very old engines without :has()
        found = Array.from(section.querySelectorAll<HTMLElement>('h1, h2, .grid > *, img'));
      }
      found = found.filter(
        (el) => !el.closest('form, [data-reveal-skip], [data-no-reveal]') && el.offsetParent !== null
      );
      // keep the smallest units: drop anything that contains another candidate
      found
        .filter((el) => !found.some((other) => other !== el && el.contains(other)))
        .forEach((el) => picked.push(el));
    });

    const vh = window.innerHeight;
    picked.forEach((el) => {
      // stagger by position among revealed siblings
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter((c) => picked.includes(c as HTMLElement))
        : [el];
      const i = Math.max(0, siblings.indexOf(el));
      el.style.setProperty('--rd', `${Math.min(i, 6) * 80}ms`);
      el.dataset.reveal = /^H[12]$/.test(el.tagName) ? 'heading' : el.tagName === 'IMG' ? 'media' : 'item';
      // anything already well above the fold just shows (e.g. on a reload half way down)
      if (el.getBoundingClientRect().bottom < 0 && vh) el.classList.add('is-in');
    });

    const settle = (el: HTMLElement) => {
      // once played, hand the element back so its own hover transitions work again
      const ms = 1100 + parseInt(el.style.getPropertyValue('--rd') || '0', 10);
      window.setTimeout(() => {
        delete el.dataset.reveal;
        el.classList.remove('is-in');
        el.style.removeProperty('--rd');
      }, ms);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add('is-in');
          io.unobserve(el);
          settle(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    // two frames so the hidden state is painted before anything starts moving
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => picked.forEach((el) => (el.classList.contains('is-in') ? settle(el) : io.observe(el))))
    );

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ready]);
}

/* ------------------------------------------------------------------ */
/* Parallax: [data-parallax="0.15"] drifts at that fraction of scroll   */
/* ------------------------------------------------------------------ */

export function useParallax() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const host = el.parentElement ?? el;
        const r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const speed = parseFloat(el.dataset.parallax || '0.15');
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}
