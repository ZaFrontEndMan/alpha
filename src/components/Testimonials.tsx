import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';

interface TestimonialsProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  t,
  lang,
  onOpenConsultation,
}) => {
  return (
    <section className="py-20 md:py-28 bg-[#0c0f0d] @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold tracking-widest text-[#8cffdb] uppercase mb-3">
            {t.testimonials.title}
          </div>
          <h2 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {t.testimonials.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            {t.testimonials.subheading}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {t.testimonials.reviews.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#090b0a] border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors relative group"
            >
              {/* Highlight badge at top */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                <span className="text-xs font-mono font-bold text-[#8cffdb]">
                  {item.stats}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {item.role}
                </span>
              </div>

              {/* Quote text */}
              <blockquote className="text-sm sm:text-base text-neutral-200 leading-relaxed italic mb-8">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              {/* Client Profile Lockup */}
              <div className="pt-4 border-t border-neutral-800 flex items-center gap-4">
                {/* Client Avatar Graphic */}
                <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 flex items-center justify-center font-display font-black text-white text-base shrink-0 group-hover:border-[#8cffdb] transition-colors">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <div className="text-base font-bold text-white leading-tight">
                    {item.name}
                  </div>
                  <div className="text-xs text-[#8cffdb] font-mono mt-0.5">
                    {item.highlight}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust CTA bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400 text-center sm:text-start">
            {lang === 'en'
              ? 'Over 500+ real client transformations logged. Join Dr. Ahmed Assem today.'
              : 'أكثر من 500 تحول حقيقي موثق بالنتائج. انضم إلى د. أحمد عاصم اليوم.'}
          </div>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] transition-colors cursor-pointer text-center"
          >
            {t.hero.ctaStart}
          </button>
        </div>
      </div>
    </section>
  );
};
