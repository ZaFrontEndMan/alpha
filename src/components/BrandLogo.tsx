import React from 'react';
import { useSiteConfig } from '../config/SiteConfigContext';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
}

/** Dr. Ahmed Assem's wordmark. The image comes from the site config (default: /brand-logo.png). */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 36,
  style,
}) => {
  const { cfg, img } = useSiteConfig();
  return (
    <img
      src={img(cfg.site.logo)}
      alt={cfg.site.logo.alt?.en || cfg.site.name}
      className={`block w-auto max-w-none object-contain mix-blend-screen transition-transform duration-300 hover:scale-105 ${className}`}
      style={{
        height: typeof size === 'number' ? `${size}px` : size,
        mixBlendMode: 'screen',
        ...style,
      }}
    />
  );
};
