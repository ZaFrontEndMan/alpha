import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TransformationsGrid } from './components/TransformationsGrid';
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
import { AuthModal } from './components/AuthModal';
import { translations, Language } from './translations';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedTier, setSelectedTier] = useState('Elite Coaching (7000 EGP)');
  const [preloadedMacroSummary, setPreloadedMacroSummary] = useState('');

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

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setIsAuthOpen(true);
  };

  const handleNavigateToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyWithMacros = (macroSummary: string) => {
    setPreloadedMacroSummary(macroSummary);
    setSelectedTier('Elite Coaching (7000 EGP)');
    setIsConsultationOpen(true);
  };

  return (
    <div className={`min-h-screen bg-[#090b0a] text-neutral-100 flex flex-col selection:bg-[#ccff00] selection:text-black ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        t={t}
        onToggleLang={handleToggleLang}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenCalculator={handleNavigateToCalculator}
      />

      {/* Main Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
          onOpenCalculator={handleNavigateToCalculator}
        />

        {/* 2. Transformations +500 Showcase Grid */}
        <TransformationsGrid
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 3. Testimonials with Real Client Quotes (Zeyad, Ahmed, Mohamed) */}
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

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        lang={lang}
        t={t}
      />

      {/* Mobile Sticky Quick Action Bar (Comfortable thumb target size <= 15% viewport height) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090b0a]/95 backdrop-blur-md border-t border-neutral-800 p-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={handleNavigateToCalculator}
          className="flex-1 py-3 px-3 min-h-[44px] text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-700 bg-neutral-900/90 text-center cursor-pointer"
        >
          {t.nav.calculator}
        </button>
        <button
          type="button"
          onClick={() => handleOpenConsultation()}
          className="flex-1 py-3 px-3 min-h-[44px] text-xs font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] text-center shadow-[0_0_15px_rgba(204,255,0,0.3)] cursor-pointer"
        >
          {t.hero.ctaStart}
        </button>
      </div>
    </div>
  );
}
