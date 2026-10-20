import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TransformationsShowcase } from './components/TransformationsShowcase';
import { WorkoutsSection } from './components/WorkoutsSection';
import { Testimonials } from './components/Testimonials';
import { WhyChoose } from './components/WhyChoose';
import { CoachShowcase } from './components/CoachShowcase';
import { FeaturesSection } from './components/FeaturesSection';
import { ComparisonSection } from './components/ComparisonSection';
import { PackagesSection } from './components/PackagesSection';
import { HowItWorks } from './components/HowItWorks';
import { InspirationBanner } from './components/InspirationBanner';
import { SubstitutionTool, SubstitutionsPage } from './components/SubstitutionTool';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FormPage } from './components/ClientForm';
import { translations, Language } from './translations';
import { LogoIntro } from './components/LogoIntro';
import { SocialRail } from './components/SocialRail';
import { startScroll, useParallax, useScrollReveal, useSmoothScroll } from './components/fx';
import { cn } from './utils/cn';

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ lang, onToggleLang }: { lang: Language; onToggleLang: () => void }) {
  const t = translations[lang];
  const navigate = useNavigate();
  const en = lang === 'en';

  const handleOpenForm = (tier?: string) => {
    const params = tier ? `?tier=${encodeURIComponent(tier)}` : '';
    navigate(`/form${params}`);
  };

  const handleNavigateToSubstitutions = () => {
    navigate('/substitutions');
  };

  useSmoothScroll();
  useScrollReveal();
  useParallax();

  // Ensure scroll is running on the landing page
  useEffect(() => {
    startScroll();
  }, []);

  return (
    <div className={`min-h-screen w-full overflow-x-clip bg-[#090b0a] text-neutral-100 flex flex-col selection:bg-[#8cffdb] selection:text-black ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
      <LogoIntro />
      <SocialRail />

      <Navbar
        lang={lang}
        t={t}
        onToggleLang={onToggleLang}
        onOpenCalculator={handleNavigateToSubstitutions}
      />

      <main id="main" className="flex-1">
        <Hero
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
          onOpenCalculator={handleNavigateToSubstitutions}
        />

        <TransformationsShowcase
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        <WorkoutsSection
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        <InspirationBanner
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        <Testimonials
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        <WhyChoose
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        <CoachShowcase
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        <FeaturesSection
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        <ComparisonSection
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        {/* Packages — onSelectPackage routes to /form?tier=... */}
        <PackagesSection
          t={t}
          lang={lang}
          onSelectPackage={(pkgName) => handleOpenForm(pkgName)}
        />

        <HowItWorks
          t={t}
          lang={lang}
          onOpenConsultation={() => handleOpenForm()}
        />

        {/* Food Substitution Feature Section */}
        <section id="substitutions" className="py-20 md:py-28 section-blend @container">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <div className="text-xs font-bold tracking-widest text-[#8cffdb] uppercase mb-3">
                  {en ? 'NUTRITION PROTOCOL' : 'بروتوكول التغذية الرياضية'}
                </div>
                <h2 className={cn(
                  'text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]',
                  en ? 'font-sport' : 'font-cairo'
                )}>
                  {en ? 'Exact Food Substitution System' : 'نظام بدائل الأطعمة الدقيق'}
                </h2>
                <p className="mt-3 text-neutral-400 text-sm max-w-2xl leading-relaxed">
                  {en
                    ? 'Swap any food with equal macro equivalents calculated from Dr. Ahmed Assem’s clinical nutrition database.'
                    : 'استبدل أي طعام ببديله الدقيق من قاعدة بيانات د. أحمد عاصم الرياضية والطبية.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleNavigateToSubstitutions}
                className="px-5 py-3 text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] transition-colors cursor-pointer self-start md:self-end whitespace-nowrap"
              >
                {en ? 'Open Fullscreen Tool ↗' : 'فتح الأداة بالكامل ↗'}
              </button>
            </div>

            <SubstitutionTool lang={lang} />
          </div>
        </section>

        <FAQSection t={t} lang={lang} />
      </main>

      <Footer t={t} lang={lang} />

      {/* Mobile Sticky Quick Action Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090b0a]/95 backdrop-blur-md border-t border-neutral-800 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center gap-2">
        <button
          type="button"
          onClick={handleNavigateToSubstitutions}
          className="flex-1 py-2 px-2 min-h-[38px] text-[0.68rem] font-bold uppercase tracking-wider text-neutral-300 whitespace-nowrap border border-neutral-700 bg-neutral-900/90 text-center cursor-pointer"
        >
          {t.nav.calculator}
        </button>
        <button
          type="button"
          onClick={() => handleOpenForm()}
          className="flex-1 py-2 px-2 min-h-[38px] text-[0.68rem] font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] text-center shadow-[0_0_12px_rgba(140,255,219,0.25)] whitespace-nowrap cursor-pointer"
        >
          {t.hero.ctaStart}
        </button>
      </div>
    </div>
  );
}

// ─── Root App with Router ─────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Language>('en');

  // Update HTML document dir attribute when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const handleToggleLang = () => setLang((prev) => (prev === 'en' ? 'ar' : 'en'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/form" element={<FormPage lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/Asem/Form" element={<FormPage lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/substitutions" element={<SubstitutionsPage lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/Asem/Substitutions" element={<SubstitutionsPage lang={lang} onToggleLang={handleToggleLang} />} />
      </Routes>
    </BrowserRouter>
  );
}
