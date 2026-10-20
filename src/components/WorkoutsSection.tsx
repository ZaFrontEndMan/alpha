import React from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';
import workoutPhoto from '../assets/person/person_2.jpg';

interface WorkoutsSectionProps {
  t: TranslationContent;
  lang: Language;
  onOpenConsultation: () => void;
}

export const WorkoutsSection: React.FC<WorkoutsSectionProps> = ({ t, lang, onOpenConsultation }) => {
  const en = lang === 'en';

  const cards = [
    {
      titleLead: en ? 'HOME OR GYM' : 'في البيت أو الجيم',
      title: en ? 'WORKOUTS' : 'تمارين',
      body: en
        ? 'Workout wherever is most convenient for you with home or gym workout options!'
        : 'تدرب في المكان الأنسب لك — خيارات تمارين للبيت أو للجيم!',
    },
    {
      titleLead: en ? 'Personalised' : 'برنامج تدريبي',
      title: en ? 'WORKOUT PROGRAM' : 'مخصص لك',
      body: en
        ? 'Workout program just for you! I will customise your own ongoing training program. All exercises have been filmed to demonstrate how to perform them correctly.'
        : 'برنامج تدريبي لك وحدك! سأصمم لك برنامجاً مستمراً يناسبك، وكل تمرين مصوّر بالفيديو ليوضح الأداء الصحيح.',
    },
  ];

  return (
    <section id="workouts" className="relative overflow-hidden py-20 md:py-28 bg-[#090b0a] @container">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Photo */}
          <div className="lg:col-span-5 relative">
            <img
              src={workoutPhoto}
              alt={en ? 'Training session' : 'جلسة تدريب'}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5] object-cover rounded-xl"
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-[#090b0a]/70 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="text-xs font-bold tracking-widest text-[#8cffdb] uppercase mb-3">
              {en ? 'TRAINING' : 'التدريب'}
            </div>

            <div className="space-y-8">
              {cards.map((card) => (
                <div key={card.title}>
                  <h3
                    className={cn(
                      'text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight [text-wrap:balance]',
                      en ? 'font-sport' : 'font-cairo'
                    )}
                  >
                    <span className="text-[#8cffdb]">{card.titleLead}</span> {card.title}
                  </h3>
                  <p className="mt-3 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">{card.body}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenConsultation}
              className="mt-9 inline-flex min-h-[44px] items-center justify-center bg-[#8cffdb] px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition-colors hover:bg-[#77d9ba] cursor-pointer"
            >
              {t.hero.ctaStart}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
