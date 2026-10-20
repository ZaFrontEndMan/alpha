import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Language, TranslationContent } from '../translations';
import { cn } from '../utils/cn';

interface NavbarProps {
  lang: Language;
  t: TranslationContent;
  onToggleLang: () => void;
  onOpenCalculator: () => void;
}

/** Same order as the sections on the page, so the nav reads top-to-bottom like the page scrolls.
 *  `calculator` scrolls through the same helper the hero button uses, hence no href. */
type NavKey = 'home' | 'transformations' | 'workouts' | 'features' | 'comparison' | 'packages' | 'calculator' | 'faqs';

const NAV_LINKS: { href?: string; key: NavKey }[] = [
  { href: '#', key: 'home' },
  { href: '#transformations', key: 'transformations' },
  { href: '#workouts', key: 'workouts' },
  { href: '#features', key: 'features' },
  { href: '#comparison', key: 'comparison' },
  { href: '#packages', key: 'packages' },
  { key: 'calculator' },
  { href: '#faqs', key: 'faqs' },
];

export const Navbar: React.FC<NavbarProps> = ({ lang, t, onToggleLang, onOpenCalculator }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /** One renderer for both the desktop bar and the mobile drawer. */
  const navItems = (itemClass: string, onPick?: () => void) =>
    NAV_LINKS.map(({ href, key }) =>
      href ? (
        <a key={key} href={href} onClick={onPick} className={itemClass}>
          {t.nav[key]}
        </a>
      ) : (
        <button
          key={key}
          type="button"
          onClick={() => {
            onPick?.();
            onOpenCalculator();
          }}
          className={cn(itemClass, 'cursor-pointer text-start')}
        >
          {t.nav[key]}
        </button>
      )
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Transparent bar: a soft black overlay + blur, so the hero photo shows through underneath */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 to-black/35 backdrop-blur-md" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8cffdb]"
        >
          <BrandLogo size={36} />
          <div className="flex flex-col leading-none">
            <span
              className={cn(
                'tracking-tight text-white text-base sm:text-lg group-hover:text-[#8cffdb] transition-colors font-extrabold',
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}
            >
              {lang === 'en' ? 'AHMED ASSEM' : 'د. أحمد عاصم'}
            </span>
            <span className="text-[10px] tracking-wider text-neutral-400 font-semibold uppercase mt-0.5">
              IFBB PRO · M.D.
            </span>
          </div>
        </a>

        {/* Section links (desktop) */}
        <nav className="hidden xl:flex items-center gap-5 text-xs lg:text-sm font-semibold text-neutral-300">
          {navItems(
            'hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-8 decoration-[#8cffdb] decoration-2'
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold border border-neutral-700 bg-neutral-900/80 hover:border-[#8cffdb] hover:text-[#8cffdb] text-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5 min-h-[38px] sm:min-h-[36px]"
            title="Switch Language"
          >
            <span className="text-[11px] font-mono">🌐</span>
            <span>{t.nav.langToggle}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-neutral-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8cffdb]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="relative xl:hidden border-b border-neutral-800 bg-black/90 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3">
          {navItems(
            'block w-full text-sm font-semibold text-neutral-200 hover:text-[#8cffdb] py-1.5',
            () => setMobileMenuOpen(false)
          )}
        </div>
      )}
    </header>
  );
};
