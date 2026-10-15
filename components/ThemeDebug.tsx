'use client';

import { useEffect, useState } from 'react';

export function ThemeDebug() {
  const [themeVars, setThemeVars] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    setThemeVars({
      primary: computedStyle.getPropertyValue('--primary'),
      primaryHover: computedStyle.getPropertyValue('--primary-hover'),
      radius: computedStyle.getPropertyValue('--radius'),
      bg: computedStyle.getPropertyValue('--theme-bg'),
      surface: computedStyle.getPropertyValue('--theme-surface'),
      border: computedStyle.getPropertyValue('--theme-border'),
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/90 text-white text-xs font-mono border border-[var(--primary)] z-50 max-w-xs">
      <div className="font-bold mb-2 text-[var(--primary)]">Theme Variables</div>
      {Object.entries(themeVars).map(([key, value]) => (
        <div key={key} className="flex justify-between gap-4">
          <span className="opacity-60">{key}:</span>
          <span className="text-[var(--primary)]">{value || 'not set'}</span>
        </div>
      ))}
    </div>
  );
}
