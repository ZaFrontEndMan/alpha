import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
}

/** Dr. Ahmed Assem's supplied cosmetic-dentist wordmark. */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 36,
  style,
}) => {
  return (
    <img
      src="/brand-logo.png"
      alt="Dr. Ahmed Assem Cosmetic Dentist"
      className={`block w-auto max-w-none object-contain mix-blend-screen transition-transform duration-300 hover:scale-105 ${className}`}
      style={{
        height: typeof size === 'number' ? `${size}px` : size,
        mixBlendMode: 'screen',
        ...style,
      }}
    />
  );
};
