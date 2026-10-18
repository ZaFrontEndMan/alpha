import React from 'react';
import { cn } from '../utils/cn';

/**
 * Photo backdrop for a section: the image sits behind the content, darkened for legibility,
 * and fades into the page base colour (#090b0a) at the top and bottom so it never starts or
 * ends on a hard edge. The parent section must be `relative overflow-hidden`.
 */
export const SectionBackdrop: React.FC<{ src: string; className?: string; side?: boolean }> = ({
  src,
  className,
  side = false,
}) => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
    />
    <div className="absolute inset-0 bg-[#090b0a]/70" />
    {side && (
      <div className="absolute inset-0 bg-gradient-to-r from-[#090b0a] via-[#090b0a]/70 to-transparent rtl:bg-gradient-to-l" />
    )}
    <div className="absolute inset-x-0 top-0 h-32 sm:h-48 bg-gradient-to-b from-[#090b0a] to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-32 sm:h-48 bg-gradient-to-t from-[#090b0a] to-transparent" />
  </div>
);
