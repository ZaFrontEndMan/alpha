import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TransformationsGrid } from './components/TransformationsGrid';
import { TransformationsShowcase } from './components/TransformationsShowcase';
import { Testimonials } from './components/Testimonials';
import { WhyChoose } from './components/WhyChoose';
import { FeaturesSection } from './components/FeaturesSection';
import { ComparisonSection } from './components/ComparisonSection';
import { PackagesSection } from './components/PackagesSection';
import { HowItWorks } from './components/HowItWorks';
import { InspirationBanner } from './components/InspirationBanner';
import { MacroCalculator } from './components/MacroCalculator';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { translations, Language } from './translations';
import { LogoIntro } from './components/LogoIntro';
import { SocialRail } from './components/SocialRail';
import { scrollToId, startScroll, stopScroll, useParallax, useScrollReveal, useSmoothScroll } from './components/fx';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('Elite Coaching (7000 EGP)');
  const [preloadedMacroSummary, setPreloadedMacroSummary] = useState('');

  // Smooth scroll, scroll reveals and parallax (same feel as the Consightve landing)
  useSmoothScroll();
  useScrollReveal();
  useParallax();

  // Hold the page still behind an open modal; the modal scrolls on its own (data-lenis-prevent)
  useEffect(() => {
    if (isConsultationOpen) stopScroll();
    else startScroll();
  }, [isConsultationOpen]);

  // Update HTML document dir attribute when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = translations[lang];

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleOpenConsultation = (tier?: string) => {
    if (tier) setSelectedTier(tier);
    setIsConsultationOpen(true);
  };

  const handleNavigateToCalculator = () => {
    scrollToId('calculator');
  };

  const handleApplyWithMacros = (macroSummary: string) => {
    setPreloadedMacroSummary(macroSummary);
    setSelectedTier('Elite Coaching (7000 EGP)');
    setIsConsultationOpen(true);
  };

  return (
    <div className={`min-h-screen w-full overflow-x-hidden bg-[#090b0a] text-neutral-100 flex flex-col selection:bg-[#8cffdb] selection:text-black ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
      {/* Logo loader: plays once, then lifts off the hero */}
      <LogoIntro />

      {/* Fixed social links, vertically centered on the edge (desktop + mobile) */}
      <SocialRail />

      {/* Top Navigation */}
      <Navbar
        lang={lang}
        t={t}
        onToggleLang={handleToggleLang}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenCalculator={handleNavigateToCalculator}
      />

      {/* Main Flow */}
      <main id="main" className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
          onOpenCalculator={handleNavigateToCalculator}
        />

        {/* 2. Transformations photo showcase (staggered grid, scroll-reveal) */}
        <TransformationsShowcase
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 3. Transformations +500 Detailed Grid */}
        <TransformationsGrid
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 4. Testimonials with Real Client Quotes (Zeyad, Ahmed, Mohamed) */}
        <Testimonials
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 4. Why Choose Dr. Ahmed Assem (The 4 Pillars & 500+ Record) */}
        <WhyChoose
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 5. Core Features (Meal Plan, Workout Program, Home/Gym) */}
        <FeaturesSection
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 6. System Comparison Section (Dr. Ahmed Assem vs Conventional) */}
        <ComparisonSection
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 7. Packages with exact EGP pricing (4500, 7000, 12000, 2000) */}
        <PackagesSection
          t={t}
          lang={lang}
          onSelectPackage={(pkgName) => handleOpenConsultation(pkgName)}
        />

        {/* 8. How It Works (6-Step Timeline) */}
        <HowItWorks
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 9. Inspiration & Mindset Banner */}
        <InspirationBanner
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 10. Interactive Macro & Calorie Calculator */}
        <MacroCalculator
          lang={lang}
          onApplyWithMacros={handleApplyWithMacros}
        />

        {/* 11. Frequently Asked Questions (All 8 questions) */}
        <FAQSection
          t={t}
          lang={lang}
        />
      </main>

      {/* Footer */}
      <Footer t={t} lang={lang} />

      {/* Consultation Assessment Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        lang={lang}
        initialTier={selectedTier}
        initialMacroSummary={preloadedMacroSummary}
      />

      {/* Mobile Sticky Quick Action Bar (Comfortable thumb target size <= 15% viewport height) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090b0a]/95 backdrop-blur-md border-t border-neutral-800 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center gap-2">
        <button
          type="button"
          onClick={handleNavigateToCalculator}
          className="flex-1 py-2 px-2 min-h-[38px] text-[0.68rem] font-bold uppercase tracking-wider text-neutral-300 whitespace-nowrap border border-neutral-700 bg-neutral-900/90 text-center cursor-pointer"
        >
          {t.nav.calculator}
        </button>
        <button
          type="button"
          onClick={() => handleOpenConsultation()}
          className="flex-1 py-2 px-2 min-h-[38px] text-[0.68rem] font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] text-center shadow-[0_0_12px_rgba(140,255,219,0.25)] whitespace-nowrap cursor-pointer"
        >
          {t.hero.ctaStart}
        </button>
      </div>
    </div>
  );
}
