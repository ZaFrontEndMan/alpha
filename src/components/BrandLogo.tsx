import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'lime' | 'split' | 'monochrome';
  showWordmark?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 36,
  variant = 'lime',
  showWordmark = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
      <svg
        width={size}
        height={typeof size === 'number' ? size * 0.72 : 'auto'}
        viewBox="0 0 160 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="Dr. Ahmed Assem Logo"
      >
        {variant === 'lime' ? (
          // Electric Neon Lime AA with sharp negative space wedge (Pitch Dark Theme from Brand Board)
          <g>
            {/* Left A - Neon Lime */}
            <path
              d="M 54 10 L 10 105 L 36 105 L 59 52 L 72 78 L 94 72 L 72 26 L 68 18 Z"
              fill="#CCFF00"
            />
            {/* Left A inner leg lower */}
            <path
              d="M 39 105 L 63 105 L 75 79 L 60 82 Z"
              fill="#CCFF00"
            />
            {/* Right A - Neon Lime with connecting slice */}
            <path
              d="M 72 10 L 115 10 L 152 105 L 126 105 L 118 84 L 91 84 L 88 105 L 68 105 L 68 83 L 78 72 Z"
              fill="#CCFF00"
            />
            <path
              d="M 88 28 L 100 28 L 111 67 L 85 67 Z"
              fill="#090B0A"
            />
            {/* Dynamic cutting slash accent */}
            <polygon
              points="54,58 92,48 116,68 82,78"
              fill="#090B0A"
            />
          </g>
        ) : variant === 'split' ? (
          // White/Split version: Black letterform with neon lime accent slice
          <g>
            {/* Black main geometry */}
            <path
              d="M 54 10 L 10 105 L 36 105 L 59 52 L 72 78 L 94 72 L 72 26 L 68 18 Z"
              fill="#111613"
            />
            <path
              d="M 72 10 L 115 10 L 152 105 L 126 105 L 118 84 L 91 84 L 88 105 L 68 105 L 68 83 L 78 72 Z"
              fill="#111613"
            />
            {/* Neon lime slice */}
            <polygon
              points="40,105 64,105 76,79 56,84"
              fill="#CCFF00"
            />
            <polygon
              points="54,58 92,48 116,68 82,78"
              fill="#CCFF00"
            />
          </g>
        ) : (
          // Crisp White / Monochrome
          <g>
            <path
              d="M 54 10 L 10 105 L 36 105 L 59 52 L 72 78 L 94 72 L 72 26 L 68 18 Z"
              fill="#FFFFFF"
            />
            <path
              d="M 72 10 L 115 10 L 152 105 L 126 105 L 118 84 L 91 84 L 88 105 L 68 105 L 68 83 L 78 72 Z"
              fill="#FFFFFF"
            />
            <polygon
              points="54,58 92,48 116,68 82,78"
              fill="#090B0A"
            />
          </g>
        )}
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-extrabold tracking-tight text-white text-base md:text-lg flex items-center gap-1.5">
            DR. AHMED ASSEM
          </span>
          <span className="text-[10px] tracking-widest text-[#ccff00] font-semibold uppercase mt-0.5">
            IFBB PRO · MEDICAL DOCTOR
          </span>
        </div>
      )}
    </div>
  );
};
