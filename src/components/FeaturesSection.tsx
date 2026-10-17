import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';

interface FeaturesSectionProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  t,
  lang,
  onOpenConsultation,
}) => {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#0c0f0d] @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold tracking-widest text-[#8cffdb] uppercase mb-3">
            {t.features.tag}
          </div>
          <h2 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {t.features.heading}
          </h2>
        </div>

        {/* 3 Core Features Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Feature 1: Meal Plan */}
          <div className="bg-[#090b0a] border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              {/* Feature Icon Header */}
              <div className="w-12 h-12 bg-[#121614] border border-neutral-800 flex items-center justify-center text-[#8cffdb] font-mono font-bold mb-6 group-hover:border-[#8cffdb] transition-colors">
                01
              </div>

              <h3 className={cn(
                "text-xl sm:text-2xl font-bold text-white mb-4",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {t.features.mealPlanTitle}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {t.features.mealPlanDesc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{lang === 'en' ? 'DIET FRAMEWORKS:' : 'الأنظمة المتاحة:'}</span>
              <span className="text-[#8cffdb] font-bold">Balanced · Carb Cycling · Advanced</span>
            </div>
          </div>

          {/* Feature 2: Workout Program */}
          <div className="bg-[#090b0a] border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              <div className="w-12 h-12 bg-[#121614] border border-neutral-800 flex items-center justify-center text-[#8cffdb] font-mono font-bold mb-6 group-hover:border-[#8cffdb] transition-colors">
                02
              </div>

              <h3 className={cn(
                "text-xl sm:text-2xl font-bold text-white mb-4",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {t.features.workoutTitle}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {t.features.workoutDesc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{lang === 'en' ? 'VIDEO LIBRARY:' : 'مكتبة الفيديوهات:'}</span>
              <span className="text-[#8cffdb] font-bold">HD Form Demonstrations</span>
            </div>
          </div>

          {/* Feature 3: Home or Gym */}
          <div className="bg-[#090b0a] border border-neutral-800 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              <div className="w-12 h-12 bg-[#121614] border border-neutral-800 flex items-center justify-center text-[#8cffdb] font-mono font-bold mb-6 group-hover:border-[#8cffdb] transition-colors">
                03
              </div>

              <h3 className={cn(
                "text-xl sm:text-2xl font-bold text-white mb-4",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {t.features.locationTitle}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {t.features.locationDesc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{lang === 'en' ? 'FLEXIBILITY:' : 'مرونة التدريب:'}</span>
              <span className="text-[#8cffdb] font-bold">Home Equipment & Full Gym</span>
            </div>
          </div>
        </div>

        {/* START NOW CTA Box */}
        <div className="mt-16 bg-[#111713] border border-[#8cffdb]/40 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#8cffdb]">
              DR. AHMED ASSEM EXCLUSIVE SYSTEM
            </div>
            <h3 className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-black text-white",
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}>
              {lang === 'en' ? 'START NOW' : 'ابدأ الآن'}
            </h3>
            <p className="text-sm sm:text-base text-neutral-300">
              {lang === 'en'
                ? 'Join Dr. Ahmed Assem and transform your physique with 1-on-1 direct physician guidance.'
                : 'انضم للدكتور أحمد عاصم وحقق أفضل شكل لجسمك بإشراف طبيب ومحترف IFBB Pro.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-8 py-4 min-h-[48px] text-xs sm:text-sm font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(140,255,219,0.35)] cursor-pointer"
              >
                {t.hero.ctaStart}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
