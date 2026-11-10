import React, { useEffect, useMemo, useRef } from 'react';
import { prefersReducedMotion } from './fx';
import { cldUrl, TransformationPhoto } from '../utils/cloudinary';

/**
 * Curved "inside a cylinder" photo strip: cards near the edges turn toward the viewer and grow,
 * the centre ones sit back. It drifts on its own and can be dragged / swiped on any screen.
 * Positions are computed in JS each frame and the strip wraps around, so it loops forever.
 */

const GAP = 12;
const AUTO_SPEED = 40; // px per second
const MAX_ANGLE = 44; // deg at the very edge
const EDGE_SCALE = 0.5; // extra scale at the edge

const cardHeight = (vw: number) => (vw < 640 ? 125 : vw < 1024 ? 190 : 240);
// Photos are mostly square before/after pairs: keep their own shape so nothing gets cropped.
const ratioOf = (p: TransformationPhoto) => Math.min(1.5, Math.max(0.75, p.w / p.h));

export const PerspectiveGallery: React.FC<{ photos: TransformationPhoto[]; alt: string }> = ({ photos, alt }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Repeat short lists so the loop never shows a gap on wide screens.
  const items = useMemo(() => {
    if (photos.length === 0) return [];
    const out: TransformationPhoto[] = [];
    while (out.length < 14) out.push(...photos);
    return out;
  }, [photos]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || items.length === 0) return;

    const reduced = prefersReducedMotion();
    let W = viewport.clientWidth;
    let H = cardHeight(W);
    let widths: number[] = [];
    let starts: number[] = [];
    let total = 0;

    const layout = () => {
      W = viewport.clientWidth;
      H = cardHeight(W);
      viewport.style.height = `${Math.round(H * (1 + EDGE_SCALE) + 16)}px`;
      widths = items.map((p) => Math.round(H * ratioOf(p)));
      starts = [];
      total = 0;
      widths.forEach((w, i) => {
        starts[i] = total;
        total += w + GAP;
        const el = cardRefs.current[i];
        if (el) {
          el.style.width = `${w}px`;
          el.style.height = `${H}px`;
          el.style.marginTop = `${-H / 2}px`;
        }
      });
    };
    layout();

    let offset = 0;
    let velocity = reduced ? 0 : AUTO_SPEED;
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let dragVel = 0;
    let visible = true;
    let raf = 0;
    let prev = performance.now();

    const render = () => {
      const half = W / 2;
      for (let i = 0; i < items.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        // wrap so every card sits somewhere in [-total/2, total/2) around the centre
        let x = (((starts[i] - offset) % total) + total) % total;
        if (x > total / 2) x -= total;
        const centre = x + widths[i] / 2;
        const d = Math.max(-1.25, Math.min(1.25, centre / half));
        if (Math.abs(centre) > half + widths[i] * 1.5) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';
        const a = Math.abs(d);
        el.style.transform =
          `translate3d(${half + x}px,0,0) perspective(${Math.round(Math.max(500, W * 0.55))}px) ` +
          `rotateY(${(-d * MAX_ANGLE).toFixed(2)}deg) scale(${(1 + Math.pow(a, 1.5) * EDGE_SCALE).toFixed(3)})`;
        el.style.zIndex = String(Math.round(a * 100));
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!dragging) {
        const target = reduced ? 0 : AUTO_SPEED;
        velocity += (target - velocity) * Math.min(1, dt * 2.5); // ease back to the drift after a fling
        offset += velocity * dt;
      }
      render();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    raf = requestAnimationFrame(tick);

    // Pause off-screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(viewport);

    const ro = new ResizeObserver(() => {
      layout();
      render();
    });
    ro.observe(viewport);

    // Drag / swipe (vertical page scrolling stays native via touch-action: pan-y)
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      lastT = performance.now();
      dragVel = 0;
      viewport.setPointerCapture(e.pointerId);
      viewport.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      offset -= dx;
      const dtm = Math.max(1, now - lastT);
      dragVel = 0.8 * (-dx / dtm) * 1000 + 0.2 * dragVel;
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      velocity = Math.max(-2500, Math.min(2500, dragVel));
      viewport.style.cursor = '';
      if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
    };
    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      viewport.removeEventListener('pointerdown', onDown);
      viewport.removeEventListener('pointermove', onMove);
      viewport.removeEventListener('pointerup', onUp);
      viewport.removeEventListener('pointercancel', onUp);
    };
  }, [items]);

  return (
    <div
      ref={viewportRef}
      dir="ltr"
      data-reveal-skip
      aria-label={alt}
      role="region"
      className="relative w-full overflow-hidden select-none cursor-grab touch-pan-y"
      style={{ height: 380 }}
    >
      {items.map((photo, i) => (
        <div
          key={`${photo.id}-${i}`}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="absolute left-0 top-1/2 overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-900 border border-neutral-800/80 shadow-2xl will-change-transform"
          style={{ visibility: 'hidden' }}
        >
          <img
            src={cldUrl(photo, 520)}
            alt={i < photos.length ? alt : ''}
            draggable={false}
            loading={i < 10 ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
};
