import React from 'react';
import { BrandLogo } from './BrandLogo';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';

interface FooterProps {
  t: TranslationContent;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ t, lang }) => {
  return (
    <footer className="bg-gradient-to-b from-[#090b0a] to-[#070908] text-neutral-400 py-16 @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <BrandLogo size={40} />
            </div>

            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mt-4">
              {lang === 'en'
                ? 'Transform your whole life in 90 days with a medically designed system. Hundreds of clients transformed using science — not guesswork.'
                : 'غيّر حياتك بالكامل في 90 يوماً بنظام مصمم طبياً. مئات المتدربين غيروا أجسامهم بنظام مثبت علمياً بدون أي عشوائية.'}
            </p>

            <div className="text-[11px] font-mono text-[#8cffdb]">
              Official Platform · drahmedassem.com
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'en' ? 'Navigation' : 'روابط سريعة'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-white transition-colors">
                  {t.nav.packages}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  {t.nav.features}
                </a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-white transition-colors">
                  {t.nav.transformations}
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-white transition-colors">
                  {t.nav.comparison}
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  {t.nav.faqs}
                </a>
              </li>
            </ul>
          </div>

          {/* Channels & Support */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'en' ? 'Direct Channels & WhatsApp' : 'التواصل المباشر والواتساب'}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {lang === 'en'
                ? 'Client intake reviews, athlete prep, and physician consultations:'
                : 'استفسارات الاشتراكات، تحضير البطولات، والاستشارات الطبية:'}
            </p>
            <div className="space-y-1.5 text-xs font-mono text-neutral-300">
              <div>
                <span className="text-neutral-500">Email:</span>{' '}
                <a
                  href="mailto:info@drahmedassem.com"
                  className="hover:text-[#8cffdb] transition-colors"
                >
                  info@drahmedassem.com
                </a>
              </div>
              <div>
                <span className="text-neutral-500">WhatsApp:</span>{' '}
                <a
                  href="https://wa.me/201158997825"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8cffdb] transition-colors"
                >
                  {lang === 'en' ? 'Direct Physician Desk' : 'مكتب الدكتور المباشر'}
                </a>
              </div>
              <div>
                <span className="text-neutral-500">Instagram:</span>{' '}
                <span className="text-white">@drahmedassem_ifbbpro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Notices Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono text-center sm:text-start">
          <div>{t.footer.rights}</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-neutral-300 transition-colors">
              {t.footer.privacy}
            </a>
            <span>|</span>
            <a href="#" className="hover:text-neutral-300 transition-colors">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
