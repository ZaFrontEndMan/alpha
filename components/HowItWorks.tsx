import React from 'react';
import { TranslationContent, Language } from '../src/translations';
import { cn } from '../src/utils/cn';

interface HowItWorksProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  t,
  lang,
  onOpenConsultation,
}) => {
  return (
    <section className="py-20 md:py-28 bg-[#090b0a] border-b border-neutral-800/80 @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold tracking-widest text-[#ccff00] uppercase mb-3">
            {t.howItWorks.tag}
          </div>
          <h2 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {t.howItWorks.heading}
          </h2>
        </div>

        {/* 6 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.howItWorks.steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-[#0f1311] border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-black text-2xl sm:text-3xl text-[#ccff00] font-mono tabular-nums">
                    {st.step}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    STAGE {idx + 1}
                  </span>
                </div>

                <h3 className={cn(
                  "text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#ccff00] transition-colors",
                  lang === 'en' ? 'font-sport' : 'font-cairo'
                )}>
                  {st.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>{lang === 'en' ? 'STEP' : 'الخطوة'} {st.step}</span>
                <span className="text-[#ccff00]">✓ SYSTEM PROTOCOL</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-4 min-h-[48px] text-xs sm:text-sm font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] transition-colors cursor-pointer text-center"
          >
            {t.hero.ctaStart}
          </button>
        </div>
      </div>
    </section>
  );
};
