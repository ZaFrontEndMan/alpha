import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';

interface ComparisonSectionProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  t,
  lang,
  onOpenConsultation,
}) => {
  return (
    <section id="comparison" className="py-20 md:py-28 bg-[#090b0a] @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold tracking-widest text-[#8cffdb] uppercase mb-3">
            {t.comparison.tag}
          </div>
          <h2 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {t.comparison.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            {t.comparison.subheading}
          </p>
        </div>

        {/* Comparison Table / Container-responsive cards */}
        <div className="border border-neutral-800 bg-[#0c0f0d] overflow-hidden">
          {/* Table Header Row (Desktop) */}
          <div className="hidden md:grid md:grid-cols-12 bg-[#121614] border-b border-neutral-800 text-xs font-bold uppercase tracking-wider font-mono">
            <div className="p-4 md:col-span-4 text-neutral-300">
              {lang === 'en' ? 'EVALUATION CRITERIA' : 'معايير التقييم والمقارنة'}
            </div>
            <div className="p-4 md:col-span-4 text-[#8cffdb] bg-[#161d18] border-x border-neutral-800 flex items-center gap-2">
              <span>★</span>
              <span>{lang === 'en' ? "DR. AHMED ASSEM'S SYSTEM" : 'نظام د. أحمد عاصم'}</span>
            </div>
            <div className="p-4 md:col-span-4 text-neutral-400">
              {lang === 'en' ? 'TRADITIONAL COACHES / GENERIC PDF' : 'المدربون التقليديون / الخطط المنسوخة'}
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-neutral-800/80">
            {t.comparison.table.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 text-xs sm:text-sm transition-colors hover:bg-neutral-900/40"
              >
                {/* Column 1: Criteria */}
                <div className="p-4 md:col-span-4 font-bold text-white flex items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#8cffdb] rounded-none shrink-0" />
                    <span>{row.criteria}</span>
                  </div>
                </div>

                {/* Column 2: Dr. Ahmed Assem System */}
                <div className="p-4 md:col-span-4 text-neutral-100 bg-[#141a16]/60 md:border-x border-neutral-800/90 flex items-start gap-2.5">
                  <span className="text-[#8cffdb] font-bold font-mono text-sm shrink-0">✓</span>
                  <span className="leading-relaxed font-medium">{row.drAssem}</span>
                </div>

                {/* Column 3: Typical generic coaching */}
                <div className="p-4 md:col-span-4 text-neutral-400 flex items-start gap-2.5 bg-neutral-950/40">
                  <span className="text-red-400 font-bold font-mono text-sm shrink-0">✕</span>
                  <span className="leading-relaxed">{row.others}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-10 p-6 bg-[#111713] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-neutral-300 text-center sm:text-start">
            {lang === 'en'
              ? 'Don’t gamble your health and hard work with unproven guesswork. Work directly with a doctor and pro athlete.'
              : 'لا تخاطر بصحتك ومجهودك مع خطط عشوائية غير مدروسة. انضم لطبيب وبطل محترف يضمن لك النتيجة بأمان.'}
          </div>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-7 py-3 min-h-[44px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            {t.hero.ctaStart}
          </button>
        </div>
      </div>
    </section>
  );
};
