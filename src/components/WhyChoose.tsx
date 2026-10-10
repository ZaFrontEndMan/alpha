import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import coachMedal from '../assets/images/coach-medal.webp';

interface WhyChooseProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const WhyChoose: React.FC<WhyChooseProps> = ({
  t,
  lang,
  onOpenConsultation,
}) => {
  return (
    <section className="py-20 md:py-28 bg-[#090b0a] border-b border-neutral-800/80 @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + the coach with his IFBB medal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end mb-16">
          <div className="lg:col-span-7 max-w-3xl">
            <div className="text-xs font-bold tracking-widest text-[#ccff00] uppercase mb-3">
              {t.whyChoose.tag}
            </div>
            <h2 className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}>
              {t.whyChoose.heading}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
              {t.whyChoose.subheading}
            </p>
          </div>

          <figure className="lg:col-span-5 relative max-w-md w-full mx-auto lg:max-w-none">
            <div className="relative overflow-hidden border border-neutral-800 aspect-[4/5] bg-neutral-900">
              <img
                src={coachMedal}
                alt={lang === 'en' ? 'Dr. Ahmed Assem holding his IFBB Federation medal' : 'د. أحمد عاصم بميدالية الاتحاد الدولي IFBB'}
                width={864}
                height={1232}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-[50%_35%]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#090b0a] to-transparent" aria-hidden="true" />
            </div>
            <figcaption className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-3 p-3 bg-[#090b0a]/90 backdrop-blur-md border border-neutral-800 text-xs font-mono">
              <span className="text-[#ccff00] font-bold uppercase tracking-wider">IFBB Federation</span>
              <span className="text-neutral-300">{lang === 'en' ? 'Medalist' : 'حاصل على ميدالية'}</span>
            </figcaption>
          </figure>
        </div>

        {/* The 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {t.whyChoose.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#0f1311] border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-black text-3xl sm:text-4xl text-[#ccff00] font-mono tabular-nums">
                    {pillar.number}
                  </span>
                  <div className="w-10 h-10 bg-[#161c18] border border-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-400">
                    AA
                  </div>
                </div>

                <h3 className={cn(
                  "text-xl sm:text-2xl font-bold text-white mb-3",
                  lang === 'en' ? 'font-sport' : 'font-cairo'
                )}>
                  {pillar.title}
                </h3>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>{lang === 'en' ? 'CLINICAL INTEGRATION' : 'إشراف طبي متكامل'}</span>
                <span className="text-[#ccff00]">100% EVIDENCE-BASED</span>
              </div>
            </div>
          ))}
        </div>

        {/* 500+ Track Record Spotlight Banner */}
        <div className="mt-12 p-8 bg-[#121614] border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="font-display font-black text-5xl sm:text-6xl text-[#ccff00] font-mono tabular-nums">
              500+
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {lang === 'en' ? 'Proven Track Record' : 'سجل حافل بالنتائج الحقيقية'}
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                {lang === 'en'
                  ? 'Fat loss, muscle building, and full body recomposition with clients across Egypt, UAE, UK, and worldwide.'
                  : 'خسارة دهون، بناء عضلات، وإعادة تشكيل كامل للجسم مع متدربين في مصر والخليج وأوروبا.'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenConsultation}
            className="w-full md:w-auto px-8 py-3.5 min-h-[44px] text-xs font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            {t.hero.ctaStart}
          </button>
        </div>
      </div>
    </section>
  );
};
