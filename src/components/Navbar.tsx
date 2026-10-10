import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Language, TranslationContent } from '../translations';
import { cn } from '../utils/cn';

interface NavbarProps {
  lang: Language;
  t: TranslationContent;
  onToggleLang: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  t,
  onToggleLang,
  onOpenLogin,
  onOpenRegister,
  onOpenConsultation,
  onOpenCalculator,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090b0a]/95 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Zone */}
        <a
          href="#"
          className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]"
        >
          <BrandLogo size={36} />
          <div className="flex flex-col leading-none">
            <span className={cn(
              "tracking-tight text-white text-base sm:text-lg group-hover:text-[#ccff00] transition-colors font-extrabold",
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}>
              {lang === 'en' ? 'AHMED ASSEM' : 'د. أحمد عاصم'}
            </span>
            <span className="text-[10px] tracking-wider text-neutral-400 font-semibold uppercase mt-0.5">
              IFBB PRO · M.D.
            </span>
          </div>
        </a>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs lg:text-sm font-semibold text-neutral-300">
          <a
            href="#"
            className="hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-8 decoration-[#ccff00] decoration-2"
          >
            {t.nav.home}
          </a>
          <a
            href="#packages"
            className="hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-8 decoration-[#ccff00] decoration-2"
          >
            {t.nav.packages}
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-8 decoration-[#ccff00] decoration-2"
          >
            {t.nav.features}
          </a>
          <a
            href="#transformations"
            className="hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-8 decoration-[#ccff00] decoration-2 text-[#ccff00]"
          >
            {t.nav.transformations}
          </a>
          <a
            href="#comparison"
            className="hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-8 decoration-[#ccff00] decoration-2"
          >
            {t.nav.comparison}
          </a>
          <button
            type="button"
            onClick={onOpenCalculator}
            className="hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-8 decoration-[#ccff00] decoration-2 cursor-pointer"
          >
            {t.nav.calculator}
          </button>
          <a
            href="#faqs"
            className="hover:text-white transition-colors whitespace-nowrap hover:underline underline-offset-8 decoration-[#ccff00] decoration-2"
          >
            {t.nav.faqs}
          </a>
        </nav>

        {/* Right Actions: Lang Toggle, Auth & CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher Button */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold border border-neutral-700 bg-neutral-900/80 hover:border-[#ccff00] hover:text-[#ccff00] text-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5 min-h-[38px] sm:min-h-[36px]"
            title="Switch Language"
          >
            <span className="text-[11px] font-mono">🌐</span>
            <span>{t.nav.langToggle}</span>
          </button>

          {/* Login & Register Buttons (Desktop/Tablet) */}
          <button
            type="button"
            onClick={onOpenLogin}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-600 bg-transparent transition-colors min-h-[36px]"
          >
            {t.nav.login}
          </button>

          <button
            type="button"
            onClick={onOpenRegister}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold text-white border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-colors min-h-[36px]"
          >
            {t.nav.register}
          </button>

          {/* Primary Action CTA */}
          <button
            type="button"
            onClick={onOpenConsultation}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(204,255,0,0.25)] min-h-[38px] whitespace-nowrap"
          >
            {t.hero.ctaStart}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-neutral-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-neutral-800 bg-[#0e1210] px-4 pt-4 pb-6 space-y-3">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-neutral-200 hover:text-[#ccff00] py-1.5"
          >
            {t.nav.home}
          </a>
          <a
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-neutral-200 hover:text-[#ccff00] py-1.5"
          >
            {t.nav.packages}
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-neutral-200 hover:text-[#ccff00] py-1.5"
          >
            {t.nav.features}
          </a>
          <a
            href="#transformations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#ccff00] py-1.5"
          >
            {t.nav.transformations}
          </a>
          <a
            href="#comparison"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-neutral-200 hover:text-[#ccff00] py-1.5"
          >
            {t.nav.comparison}
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCalculator();
            }}
            className="block text-start w-full text-sm font-semibold text-neutral-200 hover:text-[#ccff00] py-1.5"
          >
            {t.nav.calculator}
          </button>
          <a
            href="#faqs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-neutral-200 hover:text-[#ccff00] py-1.5"
          >
            {t.nav.faqs}
          </a>

          {/* Mobile Auth Buttons */}
          <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-3 text-xs font-bold text-white bg-neutral-900 border border-neutral-700 min-h-[44px]"
            >
              {t.nav.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 text-xs font-bold text-white bg-neutral-800 border border-neutral-600 min-h-[44px]"
            >
              {t.nav.register}
            </button>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3.5 text-center text-xs font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] min-h-[46px]"
            >
              {t.hero.ctaStart}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
