import React from 'react';
import { BrandLogo } from './BrandLogo';
import { TranslationContent, Language } from '../translations';
import { useSiteConfig } from '../config/SiteConfigContext';
import { tx } from '../config/siteConfig';

interface FooterProps {
  t: TranslationContent;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ t, lang }) => {
  const { cfg } = useSiteConfig();
  const f = cfg.footer;
  const contact = cfg.contact;
  const links = f.links.filter((l) => l.visible);
  return (
    <footer className="bg-gradient-to-b from-canvas to-[#16191D] text-neutral-400 py-16 @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <BrandLogo size={40} />
            </div>

            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mt-4">
              {tx(f.description, lang)}
            </p>

            <div className="text-[11px] font-mono text-accent">
              {f.platformLabel}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {tx(f.navTitle, lang)}
            </div>
            <ul className="space-y-2 text-xs">
              {links.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {tx(l.label, lang)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Channels & Support */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              {tx(f.channelsTitle, lang)}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {tx(f.channelsText, lang)}
            </p>
            <div className="space-y-1.5 text-xs font-mono text-neutral-300">
              <div>
                <span className="text-neutral-500">Email:</span>{' '}
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-accent transition-colors"
                >
                  {contact.email}
                </a>
              </div>
              {cfg.ctas.footerWhatsapp.visible && (
                <div>
                  <span className="text-neutral-500">WhatsApp:</span>{' '}
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {tx(cfg.ctas.footerWhatsapp.label, lang)}
                  </a>
                </div>
              )}
              <div>
                <span className="text-neutral-500">Instagram:</span>{' '}
                <span className="text-white">{contact.instagramHandle}</span>
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
