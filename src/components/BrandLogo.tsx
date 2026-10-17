import React from 'react';
import { LOGO_PATHS, LOGO_W, LOGO_H, LOGO_STYLE, logoColors } from './logoPaths';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  /**
   * lime = all lime · mixed = white stroke + lime body · split = ink stroke + lime body (light grounds)
   * · monochrome = white. Leave it out to use the site-wide LOGO_STYLE.
   */
  variant?: 'lime' | 'mixed' | 'split' | 'monochrome';
  showWordmark?: boolean;
}

/** The original Ahmed Assem mark, traced from the white master and recoloured. */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 36,
  variant = LOGO_STYLE,
  showWordmark = false,
}) => {
  const colors = logoColors(variant);

  return (
    <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
      <svg
        width={size}
        height={typeof size === 'number' ? Math.round((size * LOGO_H) / LOGO_W) : 'auto'}
        viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        role="img"
        aria-label="Ahmed Assem logo"
      >
        <path d={LOGO_PATHS.stroke} fill={colors.stroke} />
        <path d={LOGO_PATHS.body} fill={colors.body} />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-extrabold tracking-tight text-white text-base md:text-lg flex items-center gap-1.5">
            DR. AHMED ASSEM
          </span>
          <span className="text-[10px] tracking-widest text-[#8cffdb] font-semibold uppercase mt-0.5">
            IFBB PRO · MEDICAL DOCTOR
          </span>
        </div>
      )}
    </div>
  );
};
