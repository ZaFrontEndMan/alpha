import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Language } from '../translations';
import { cn } from '../utils/cn';
import { cldSrcSet, cldUrl, TransformationPhoto } from '../utils/cloudinary';
import { prefersReducedMotion, startScroll, stopScroll } from './fx';

/*
 * Mobile / tablet transformations slider.
 *
 * Gesture handling, and why it's built this way:
 * - Swiping is the browser's own scrolling + CSS scroll-snap. That gives real momentum, rubber-banding
 *   and the OS's axis locking for free, which a JS drag can't match on iOS.
 * - `touch-action: manipulation` keeps vertical page scroll and pinch-zoom working through the slider,
 *   and drops the double-tap-zoom delay so taps open the viewer instantly.
 * - `overscroll-behavior-x: contain` stops a fling at either end from chaining into the page or
 *   triggering the browser's back/forward swipe.
 * - `data-lenis-prevent-horizontal` lets sideways gestures bypass Lenis; vertical ones stay smooth.
 * - Mouse/pen users (tablets with a trackpad, small laptop windows) get click-drag scrolling, and a drag
 *   never counts as a click.
 * - Positions are measured with getBoundingClientRect deltas and scrollBy, so RTL (Arabic) works
 *   without per-browser scrollLeft sign hacks.
 */

const SLIDE_WIDTHS = [480, 720, 960];
const SLIDE_SIZES = '(min-width: 768px) 38vw, (min-width: 640px) 48vw, 80vw';

/** Index of the slide whose centre is closest to the scroller's centre. */
function nearestIndex(scroller: HTMLElement): number {
  const slides = scroller.querySelectorAll<HTMLElement>('[data-slide]');
  const box = scroller.getBoundingClientRect();
  const mid = box.left + box.width / 2;
  let best = 0;
  let bestDist = Infinity;
  slides.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - mid);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
}

function scrollToIndex(scroller: HTMLElement, index: number, smooth = true) {
  const slide = scroller.querySelectorAll<HTMLElement>('[data-slide]')[index];
  if (!slide) return;
  const box = scroller.getBoundingClientRect();
  const r = slide.getBoundingClientRect();
  const delta = r.left + r.width / 2 - (box.left + box.width / 2);
  if (smooth && !prefersReducedMotion()) {
    scroller.scrollBy({ left: delta, behavior: 'smooth' });
    return;
  }
  // Slides use scroll-snap-stop: always (one photo per swipe), which also halts a programmatic jump at
  // the very next photo. Lift snapping for the instant jump, then put it back.
  scroller.style.scrollSnapType = 'none';
  scroller.scrollBy({ left: delta, behavior: 'auto' });
  requestAnimationFrame(() => {
    scroller.style.scrollSnapType = '';
  });
}

/** Tracks the centred slide while the user scrolls (rAF-throttled). */
function useActiveIndex(ref: React.RefObject<HTMLDivElement | null>, count: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setActive(nearestIndex(el));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, count]);
  return active;
}

/** Click-and-drag scrolling for mouse/pen. Touch is left entirely to the browser. */
function useMouseDrag(ref: React.RefObject<HTMLDivElement | null>) {
  const moved = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      dragging = true;
      moved.current = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved.current && Math.abs(dx) > 6) {
        moved.current = true;
        el.setPointerCapture(e.pointerId);
        el.style.scrollSnapType = 'none'; // snapping fights a hand-driven scroll
        el.style.cursor = 'grabbing';
      }
      if (moved.current) el.scrollLeft = startScroll - dx;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.cursor = '';
      if (moved.current) {
        // glide to the nearest photo with snapping still off; turning it back on first would make the
        // browser jump back to the photo the drag started from
        scrollToIndex(el, nearestIndex(el));
        let done = false;
        const restore = () => {
          if (done) return;
          done = true;
          el.style.scrollSnapType = '';
          el.removeEventListener('scrollend', restore);
        };
        el.addEventListener('scrollend', restore);
        window.setTimeout(restore, 700); // browsers without scrollend
      }
    };
    // a drag that ends over a slide must not open it
    const click = (e: MouseEvent) => {
      if (moved.current) {
        e.preventDefault();
        e.stopPropagation();
        moved.current = false;
      }
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
    };
  }, [ref]);
}

const isRtl = () => typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

const NavButton: React.FC<{ dir: 'prev' | 'next'; disabled: boolean; onClick: () => void; label: string; className?: string }> = ({
  dir,
  disabled,
  onClick,
  label,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={cn(
      'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-black/60 text-white backdrop-blur-sm transition-colors',
      'enabled:hover:border-[#8cffdb] enabled:hover:text-[#8cffdb] enabled:active:scale-95 disabled:opacity-30 cursor-pointer disabled:cursor-default',
      className
    )}
  >
    {/* chevrons point the way content moves, so they mirror in RTL */}
    {dir === 'prev' ? <ChevronLeft className="h-5 w-5 rtl:rotate-180" /> : <ChevronRight className="h-5 w-5 rtl:rotate-180" />}
  </button>
);

/* ------------------------------------------------------------------ */
/* Fullscreen viewer                                                   */
/* ------------------------------------------------------------------ */

const Lightbox: React.FC<{
  photos: TransformationPhoto[];
  start: number;
  lang: Language;
  onClose: (index: number) => void;
}> = ({ photos, start, lang, onClose }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const active = useActiveIndex(scrollerRef, photos.length);
  const activeRef = useRef(start);
  activeRef.current = active;
  const en = lang === 'en';

  const close = useCallback(() => onClose(activeRef.current), [onClose]);
  const go = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (el) scrollToIndex(el, Math.max(0, Math.min(photos.length - 1, i)));
  }, [photos.length]);

  // open on the tapped photo, lock the page, focus the close button
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) scrollToIndex(el, start, false);
    stopScroll();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow;
      startScroll();
    };
  }, [start]);

  // keyboard: Esc closes, arrows step (mirrored in RTL so "→" always moves the way it looks)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(activeRef.current + (isRtl() ? -1 : 1));
      else if (e.key === 'ArrowLeft') go(activeRef.current + (isRtl() ? 1 : -1));
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go]);

  // swipe down (or up) to dismiss. Horizontal swipes stay with the native scroller.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let x0 = 0;
    let y0 = 0;
    let axis: 'x' | 'y' | null = null;
    let dy = 0;

    const start = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        axis = 'x'; // pinch: hands off
        return;
      }
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      axis = null;
      dy = 0;
    };
    const move = (e: TouchEvent) => {
      if (axis === 'x' || e.touches.length !== 1) return;
      const mx = e.touches[0].clientX - x0;
      const my = e.touches[0].clientY - y0;
      if (!axis) {
        if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
        axis = Math.abs(my) > Math.abs(mx) ? 'y' : 'x';
        if (axis === 'x') return;
      }
      dy = my;
      e.preventDefault(); // we own this vertical drag
      stage.style.transition = 'none';
      stage.style.transform = `translate3d(0, ${dy}px, 0) scale(${1 - Math.min(Math.abs(dy) / 1500, 0.15)})`;
      stage.style.opacity = String(1 - Math.min(Math.abs(dy) / 500, 0.6));
    };
    const end = () => {
      if (axis !== 'y') return;
      axis = null;
      if (Math.abs(dy) > 90) {
        close();
        return;
      }
      stage.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
      stage.style.transform = '';
      stage.style.opacity = '';
    };

    stage.addEventListener('touchstart', start, { passive: true });
    stage.addEventListener('touchmove', move, { passive: false });
    stage.addEventListener('touchend', end);
    stage.addEventListener('touchcancel', end);
    return () => {
      stage.removeEventListener('touchstart', start);
      stage.removeEventListener('touchmove', move);
      stage.removeEventListener('touchend', end);
      stage.removeEventListener('touchcancel', end);
    };
  }, [close]);

  return createPortal(
    <div
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={en ? 'Transformation photos' : 'صور التحولات'}
      className="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-sm overscroll-contain"
    >
      <div className="relative z-10 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <span className="text-xs font-bold tabular-nums tracking-widest text-neutral-300" aria-live="polite">
          {active + 1} / {photos.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label={en ? 'Close' : 'إغلاق'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 bg-black/60 text-white hover:border-[#8cffdb] hover:text-[#8cffdb] cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div ref={stageRef} className="relative min-h-0 flex-1 will-change-transform">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [touch-action:pan-x_pinch-zoom]"
        >
          {photos.map((p, i) => (
            <div key={p.id} data-slide className="flex h-full w-full shrink-0 snap-center snap-always items-center justify-center px-3">
              <img
                src={cldUrl(p, 1200)}
                srcSet={cldSrcSet(p, [640, 960, 1280, 1600])}
                sizes="100vw"
                alt={en ? `Client transformation ${i + 1}` : `تحول متدرب ${i + 1}`}
                loading={Math.abs(i - start) <= 1 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className="h-full w-full select-none object-contain [-webkit-touch-callout:none]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <NavButton dir="prev" disabled={active === 0} onClick={() => go(active - 1)} label={en ? 'Previous photo' : 'الصورة السابقة'} />
        <span className="text-[11px] text-neutral-500">{en ? 'Swipe down to close' : 'اسحب لأسفل للإغلاق'}</span>
        <NavButton dir="next" disabled={active === photos.length - 1} onClick={() => go(active + 1)} label={en ? 'Next photo' : 'الصورة التالية'} />
      </div>
    </div>,
    document.body
  );
};

/* ------------------------------------------------------------------ */
/* Slider                                                              */
/* ------------------------------------------------------------------ */

export const TransformationsSlider: React.FC<{ photos: TransformationPhoto[]; lang: Language }> = ({ photos, lang }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const active = useActiveIndex(scrollerRef, photos.length);
  const [viewer, setViewer] = useState<number | null>(null);
  useMouseDrag(scrollerRef);
  const en = lang === 'en';
  const count = photos.length;

  const go = (i: number) => {
    const el = scrollerRef.current;
    if (el) scrollToIndex(el, Math.max(0, Math.min(count - 1, i)));
  };

  // closing the viewer leaves the slider on the photo you ended on
  const closeViewer = useCallback((i: number) => {
    setViewer(null);
    requestAnimationFrame(() => {
      const el = scrollerRef.current;
      if (el) scrollToIndex(el, i, false);
    });
  }, []);

  if (count === 0) return null;

  return (
    <div
      data-no-reveal
      role="region"
      aria-roledescription={en ? 'carousel' : 'عرض شرائح'}
      aria-label={en ? 'Client transformations' : 'تحولات المتدربين'}
    >
      <div
        ref={scrollerRef}
        data-lenis-prevent-horizontal
        tabIndex={0}
        className={cn(
          'no-scrollbar -mx-4 sm:-mx-6 flex gap-3 sm:gap-4 overflow-x-auto overflow-y-hidden',
          'snap-x snap-mandatory overscroll-x-contain touch-manipulation',
          // side padding = (100vw - slide width) / 2 so the first and last slides can centre
          'px-[10vw] sm:px-[26vw] md:px-[31vw]',
          'cursor-grab select-none outline-none focus-visible:ring-2 focus-visible:ring-[#8cffdb]/60'
        )}
      >
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            data-slide
            onClick={() => setViewer(i)}
            aria-label={en ? `Open photo ${i + 1} of ${count}` : `فتح الصورة ${i + 1} من ${count}`}
            className={cn(
              'relative aspect-square w-[80vw] sm:w-[48vw] md:w-[38vw] shrink-0 snap-center snap-always overflow-hidden',
              'rounded-xl border border-neutral-800/80 bg-[#121614] shadow-2xl cursor-pointer',
              'transition-[transform,opacity] duration-300 ease-out',
              i === active ? 'opacity-100' : 'scale-[0.94] opacity-60'
            )}
          >
            <img
              src={cldUrl(p, 720)}
              srcSet={cldSrcSet(p, SLIDE_WIDTHS)}
              sizes={SLIDE_SIZES}
              alt={en ? `Client transformation ${i + 1}` : `تحول متدرب ${i + 1}`}
              width={p.w}
              height={p.h}
              loading={i < 3 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className="pointer-events-none h-full w-full select-none object-contain [-webkit-touch-callout:none]"
            />
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <NavButton dir="prev" disabled={active === 0} onClick={() => go(active - 1)} label={en ? 'Previous photo' : 'الصورة السابقة'} />
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-neutral-800" aria-hidden="true">
          <div
            className="absolute inset-y-0 start-0 rounded-full bg-[#8cffdb] transition-[width] duration-300 ease-out"
            style={{ width: `${((active + 1) / count) * 100}%` }}
          />
        </div>
        <span className="min-w-[3.5rem] text-center text-xs font-bold tabular-nums text-neutral-300" aria-live="polite">
          {active + 1} / {count}
        </span>
        <NavButton dir="next" disabled={active === count - 1} onClick={() => go(active + 1)} label={en ? 'Next photo' : 'الصورة التالية'} />
      </div>

      {viewer !== null && <Lightbox photos={photos} start={viewer} lang={lang} onClose={closeViewer} />}
    </div>
  );
};
