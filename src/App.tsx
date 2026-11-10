import { Fragment, useState, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
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
import { PaymentCheckout } from './components/PaymentCheckout';
import { Language } from './translations';
import { SiteConfigProvider, useSiteConfig, useTranslations } from './config/SiteConfigContext';
import { tx } from './config/siteConfig';
import { LogoIntro } from './components/LogoIntro';
import { SocialRail } from './components/SocialRail';
import { scrollToId, startScroll, useParallax, useScrollReveal, useSmoothScroll } from './components/fx';
import { cn } from './utils/cn';

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ lang, onToggleLang }: { lang: Language; onToggleLang: () => void }) {
  const { cfg } = useSiteConfig();
  const t = useTranslations(lang);
  const navigate = useNavigate();
  const en = lang === 'en';

  // "Start Now" CTAs scroll to the packages — the intake form unlocks after payment.
  const handleOpenForm = () => {
    scrollToId('packages');
  };

  const handleStartPayment = (packageId: string) => {
    navigate(`/checkout?package=${encodeURIComponent(packageId)}`);
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

  // Support deep links like /#packages (used by checkout / payment pages)
  const location = useLocation();
  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    const timer = window.setTimeout(() => scrollToId(id), 400);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  const sub = cfg.content.substitutions;

  const renderSection = (type: string): ReactNode => {
    switch (type) {
      case 'hero':
        return <Hero t={t} lang={lang} onOpenConsultation={handleOpenForm} onOpenCalculator={handleNavigateToSubstitutions} />;
      case 'transformations':
        return <TransformationsShowcase t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      // Payment starts in a secure Paymob checkout flow.
      case 'packages':
        return <PackagesSection t={t} lang={lang} onStartPayment={handleStartPayment} />;
      case 'testimonials':
        return <Testimonials t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      case 'workouts':
        return <WorkoutsSection t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      // Food Substitution Feature Section
      case 'substitutions':
        return (
          <section id="substitutions" className="py-20 md:py-28 section-blend @container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                  <div className="text-xs font-bold tracking-widest text-accent uppercase mb-3">
                    {tx(sub.tag, lang)}
                  </div>
                  <h2 className={cn(
                    'text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]',
                    en ? 'font-sport' : 'font-cairo'
                  )}>
                    {tx(sub.heading, lang)}
                  </h2>
                  <p className="mt-3 text-neutral-400 text-sm max-w-2xl leading-relaxed">
                    {tx(sub.subheading, lang)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNavigateToSubstitutions}
                  className="px-5 py-3 text-xs font-black uppercase tracking-wider text-white bg-brand hover:bg-brand-hover transition-colors cursor-pointer self-start md:self-end whitespace-nowrap"
                >
                  {tx(sub.openButton, lang)}
                </button>
              </div>

              <SubstitutionTool lang={lang} />
            </div>
          </section>
        );
      case 'banner':
        return <InspirationBanner t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      case 'whyChoose':
        return <WhyChoose t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      case 'coach':
        return <CoachShowcase t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      case 'features':
        return <FeaturesSection t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      case 'comparison':
        return <ComparisonSection t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      case 'howItWorks':
        return <HowItWorks t={t} lang={lang} onOpenConsultation={handleOpenForm} />;
      case 'faqs':
        return <FAQSection t={t} lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full overflow-x-clip bg-canvas text-neutral-100 flex flex-col selection:bg-brand selection:text-white ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
      <LogoIntro />
      <SocialRail />

      <Navbar
        lang={lang}
        t={t}
        onToggleLang={onToggleLang}
        onOpenCalculator={handleNavigateToSubstitutions}
      />

      <main id="main" className="flex-1">
        {/* Order and visibility of the sections are set in the dashboard (cfg.sections). */}
        {cfg.sections
          .filter((section) => section.visible)
          .map((section) => (
            <Fragment key={section.id}>{renderSection(section.type)}</Fragment>
          ))}
      </main>

      <Footer t={t} lang={lang} />

      {/* Mobile Sticky Quick Action Bar */}
      {(cfg.ctas.start.visible || cfg.navbar.links.some((l) => l.key === 'calculator' && l.visible)) && (
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-canvas/95 backdrop-blur-md border-t border-neutral-800 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center gap-2">
        {cfg.navbar.links.some((l) => l.key === 'calculator' && l.visible) && (
        <button
          type="button"
          onClick={handleNavigateToSubstitutions}
          className="flex-1 py-2 px-2 min-h-[38px] text-[0.68rem] font-bold uppercase tracking-wider text-neutral-300 whitespace-nowrap border border-neutral-700 bg-neutral-900/90 text-center cursor-pointer"
        >
          {t.nav.calculator}
        </button>
        )}
        {cfg.ctas.start.visible && (
        <button
          type="button"
          onClick={() => handleOpenForm()}
          className="flex-1 py-2 px-2 min-h-[38px] text-[0.68rem] font-black uppercase tracking-wider text-white bg-brand hover:bg-brand-hover text-center shadow-[0_0_12px_rgba(184,35,47,0.25)] whitespace-nowrap cursor-pointer"
        >
          {t.hero.ctaStart}
        </button>
        )}
      </div>
      )}
    </div>
  );
}

import { PaymentStatus } from './components/PaymentStatus';

// ─── Page title, description and favicon from the dashboard ─────────────────
function SeoSync({ lang }: { lang: Language }) {
  const { cfg, img } = useSiteConfig();
  useEffect(() => {
    document.title = tx(cfg.site.seo.title, lang);
    const desc = tx(cfg.site.seo.description, lang);
    document.querySelectorAll('meta[name="description"], meta[property="og:description"]').forEach((m) => m.setAttribute('content', desc));
    document.querySelectorAll('meta[property="og:title"]').forEach((m) => m.setAttribute('content', document.title));
    const icon = img(cfg.site.favicon);
    if (icon) document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((l) => l.setAttribute('href', icon));
  }, [cfg, lang, img]);
  return null;
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
    <SiteConfigProvider>
    <BrowserRouter>
      <SeoSync lang={lang} />
      <Routes>
        <Route path="/" element={<LandingPage lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/form" element={<FormPage lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/Asem/Form" element={<FormPage lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/checkout" element={<PaymentCheckout lang={lang} onToggleLang={handleToggleLang} />} />

        {/* Callback Routes matching Paymob redirection URL */}
        <Route path="/Payment/Callback" element={<PaymentStatus lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/payment/callback" element={<PaymentStatus lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/Asem/Payment/Callback" element={<PaymentStatus lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/Asem/payment/callback" element={<PaymentStatus lang={lang} onToggleLang={handleToggleLang} />} />

        {/* Explicit Payment Status Routes */}
        <Route path="/payment/success" element={<PaymentStatus status="success" lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/payment/failed" element={<PaymentStatus status="failed" lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/payment/failure" element={<PaymentStatus status="failed" lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/payment/cancel" element={<PaymentStatus status="failed" lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/payment/pending" element={<PaymentStatus status="pending" lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/payment/status" element={<PaymentStatus lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/payment-result" element={<PaymentStatus lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/Asem/payment/success" element={<PaymentStatus status="success" lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/Asem/payment/failed" element={<PaymentStatus status="failed" lang={lang} onToggleLang={handleToggleLang} />} />

        <Route path="/substitutions" element={<SubstitutionsPage lang={lang} onToggleLang={handleToggleLang} />} />
        <Route path="/Asem/Substitutions" element={<SubstitutionsPage lang={lang} onToggleLang={handleToggleLang} />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
    </SiteConfigProvider>
  );
}
