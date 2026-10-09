import React, { useState } from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';

interface FAQSectionProps {
  t: TranslationContent;
  lang: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ t, lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-20 md:py-28 bg-[#090b0a] border-b border-neutral-800/80 @container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-widest text-[#ccff00] uppercase mb-3">
            {lang === 'en' ? 'COMMON QUESTIONS' : 'كل ما تحتاج معرفته'}
          </div>
          <h2 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {t.faqs.title}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {t.faqs.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#0f1311] border border-neutral-800 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] cursor-pointer min-h-[48px]"
                >
                  <span className={cn(
                    "text-base sm:text-lg font-bold text-white",
                    lang === 'en' ? 'font-sport' : 'font-cairo'
                  )}>
                    {item.q}
                  </span>
                  <span className="font-mono text-xl font-bold text-[#ccff00] shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/60 mt-1">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
