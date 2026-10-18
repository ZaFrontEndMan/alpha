import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import personCoach from '../assets/person/person_4.jpg';

interface CoachShowcaseProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

/**
 * The coach on his own black studio backdrop, blended into the page so he reads as a cutout,
 * with a giant ghost word behind him.
 */
export const CoachShowcase: React.FC<CoachShowcaseProps> = ({ t, lang, onOpenConsultation }) => {
  return (
    <section className="relative isolate overflow-hidden bg-[#090b0a] py-16 sm:py-24 md:py-32 @container">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8">
        {/* Copy column */}
        <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-5">
          <div className="text-xs font-bold tracking-widest text-[#8cffdb] uppercase mb-3">
            {lang === 'en' ? 'THE MAN BEHIND THE SYSTEM' : 'الرجل وراء النظام'}
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]',
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}
          >
            {lang === 'en'
              ? 'IFBB Pro Physique, Medical Doctor, Your Coach'
              : 'بطل IFBB برو محترف، طبيب بشري، ومدربك الشخصي'}
          </h2>
          <p className="mt-4 max-w-md text-base sm:text-lg text-neutral-300 leading-relaxed">
            {lang === 'en'
              ? 'Dr. Ahmed Assem built his own physique the same way he builds yours — with lab work, periodized training, and zero guesswork.'
              : 'د. أحمد عاصم بنى جسمه بنفس الطريقة اللي هيبني بيها جسمك — بتحاليل طبية، وتدريب مبرمج علمياً، وبدون أي عشوائية.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 font-mono">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#8cffdb] tabular-nums">
                {t.stats.experienceYears}
              </div>
              <div className="text-xs text-neutral-400 uppercase mt-0.5">{t.stats.experienceLabel}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                {t.stats.transformationsCount}
              </div>
              <div className="text-xs text-neutral-400 uppercase mt-0.5">{t.stats.transformationsLabel}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenConsultation}
            className="mt-8 inline-flex min-h-[44px] items-center justify-center bg-[#8cffdb] px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition-colors hover:bg-[#77d9ba] cursor-pointer"
          >
            {t.hero.ctaStart}
          </button>
        </div>

        {/* Coach photo. `mix-blend-lighten` drops his pure-black studio backdrop into the section
            colour (black never wins a "lighten"), so he reads as a cutout with the ghost word
            showing through around him; the bottom is masked so the crop line fades out too. */}
        <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end">
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center leading-none whitespace-nowrap',
              'text-[30vw] sm:text-[22vw] lg:text-[13vw] font-black tracking-tighter text-[#8cffdb]/[0.09]',
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}
            aria-hidden="true"
          >
            {lang === 'en' ? 'RESULTS' : 'نتائج'}
          </div>
          <img
            src={personCoach}
            alt={lang === 'en' ? 'Dr. Ahmed Assem, IFBB Pro physique athlete' : 'د. أحمد عاصم، بطل فيزيك IFBB برو'}
            loading="lazy"
            decoding="async"
            className="relative h-[52vh] sm:h-[62vh] lg:h-[72vh] w-auto max-w-full object-contain object-bottom mix-blend-lighten [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
          />
        </div>
      </div>
    </section>
  );
};
