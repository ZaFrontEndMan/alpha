import React, { useState } from 'react';
import { Language, TranslationContent } from '../translations';
import { cn } from '../utils/cn';

interface TransformationsGridProps {
  lang: Language;
  t: TranslationContent;
  onOpenConsultation: () => void;
}

interface ClientTransformation {
  id: string;
  nameEn: string;
  nameAr: string;
  type: 'fat_loss' | 'recomp' | 'muscle_gain' | 'contest_prep';
  duration: string;
  weightShift: string;
  bodyFatShift: string;
  achievementEn: string;
  achievementAr: string;
  quoteEn: string;
  quoteAr: string;
}

const TRANSFORMATIONS_DB: ClientTransformation[] = [
  {
    id: 'zeyad',
    nameEn: 'Zeyad elnamory',
    nameAr: 'زياد النموري',
    type: 'fat_loss',
    duration: '24 Weeks',
    weightShift: '152 kg → 100 kg (-52 kg)',
    bodyFatShift: '38% → 14%',
    achievementEn: '52 kg Fat Loss · Normalized Bloodwork',
    achievementAr: 'خسارة 52 كجم دهون · تحاليل دم سليمة تماماً',
    quoteEn: 'Dropped from 152 kg to 100 kg, and for the first time I can actually maintain my results.',
    quoteAr: 'نزلت من 152 كجم لـ 100 كجم، ولأول مرة قادر أحافظ على نتيجتي بدون حرمان.',
  },
  {
    id: 'ahmed-s',
    nameEn: 'Ahmed elsissy',
    nameAr: 'أحمد السيسي',
    type: 'recomp',
    duration: '16 Weeks',
    weightShift: '78 kg → 81 kg (+3 kg Lean Mass)',
    bodyFatShift: '19% → 9.5%',
    achievementEn: 'Lean Recomposition · Shredded 6-Pack Abs',
    achievementAr: 'إعادة تشكيل كامل للجسم · بروز عضلات البطن',
    quoteEn: 'I built muscle and lost fat at the same time — something I never thought was possible.',
    quoteAr: 'بنيت عضلات ونزلت دهون في نفس الوقت — حاجة كنت فاكرها مستحيلة علمياً.',
  },
  {
    id: 'mohamed-n',
    nameEn: 'Mohamed nizar',
    nameAr: 'محمد نزار',
    type: 'muscle_gain',
    duration: '12 Weeks',
    weightShift: '68 kg → 74 kg (+6 kg)',
    bodyFatShift: '12% → 11%',
    achievementEn: 'Dense Hypertrophy · Habit Consistency',
    achievementAr: 'زيادة كتلة عضلية كثيفة · التزام تام بالعادات',
    quoteEn: 'Consistency was my biggest problem… until this system made it impossible to fall off.',
    quoteAr: 'الاستمرارية كانت أكبر مشكلة بتواجهني… لحد ما بدأت النظام ده.',
  },
  {
    id: 'kareem-m',
    nameEn: 'Kareem Mansour',
    nameAr: 'كريم منصور',
    type: 'recomp',
    duration: '14 Weeks',
    weightShift: '89 kg → 80 kg (-9 kg)',
    bodyFatShift: '22% → 10%',
    achievementEn: 'Sub-10% Body Fat · Deload Synchronized',
    achievementAr: 'نسبة دهون 10% · استشفاء عضلي متقدم',
    quoteEn: 'The weekly video check-in and blood tests gave me 100% confidence in the process.',
    quoteAr: 'المتابعة الأسبوعية بالفيديو والتحاليل خلتني واثق تماماً في كل خطوة.',
  },
  {
    id: 'tarek-s',
    nameEn: 'Tarek Samir',
    nameAr: 'طارق سمير',
    type: 'contest_prep',
    duration: '20 Weeks',
    weightShift: '92 kg → 79 kg (-13 kg)',
    bodyFatShift: '16% → 4.5%',
    achievementEn: 'IFBB Regional Men’s Physique Gold',
    achievementAr: 'ميدالية ذهبية فيزايك ببطولة دولية',
    quoteEn: 'Peak week sodium and water manipulation was flawless. No cramping, full muscles.',
    quoteAr: 'أسبوع البطولة كان مدروساً طبياً بالسنتيمتر. عضلات ممتلئة وبدون أي تقلصات.',
  },
  {
    id: 'omar-f',
    nameEn: 'Omar Farouk',
    nameAr: 'عمر فاروق',
    type: 'fat_loss',
    duration: '12 Weeks',
    weightShift: '104 kg → 91 kg (-13 kg)',
    bodyFatShift: '29% → 17%',
    achievementEn: 'Reversed Fatty Liver · Metabolic Reset',
    achievementAr: 'علاج دهون الكبد · تنشيط معدل الحرق',
    quoteEn: 'My physician in London checked my enzymes after 12 weeks and was astonished.',
    quoteAr: 'طبيبي في لندن تفاجأ من تحسن إنزيمات الكبد والتحاليل بعد 12 أسبوعاً فقط.',
  },
];

export const TransformationsGrid: React.FC<TransformationsGridProps> = ({
  lang,
  t,
  onOpenConsultation,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'cards' | 'grid'>('cards');

  const filteredList = TRANSFORMATIONS_DB.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <section id="transformations" className="py-20 md:py-28 bg-[#090b0a] border-b border-neutral-800/80 @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="text-xs font-bold tracking-widest text-[#ccff00] uppercase mb-3 flex items-center gap-2">
              <span>{lang === 'en' ? 'DOCUMENTED PROOF' : 'نتائج واقعية موثقة'}</span>
              <span className="text-neutral-600">·</span>
              <span className="font-mono text-white">500+ TRANSFORMATIONS</span>
            </div>
            <h2 className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}>
              {lang === 'en'
                ? 'Hundreds of Clients Transformed With a Proven System — Not Guesswork'
                : 'مئات المتدربين غيروا أجسامهم بنظام مثبت علمياً — بدون أي عشوائية'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
              {lang === 'en'
                ? '8–12 kg average fat loss in 90 days. Shredded abs in 12 weeks. Real metabolic health restored.'
                : 'متوسط نزول 8-12 كجم دهون في 90 يوماً. عضلات بطن مقسمة في 12 أسبوعاً. استعادة كاملة لصحة الحرق والهرمونات.'}
            </p>
          </div>

          {/* Filter Segmented Controls with responsive mobile sizing */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121614] border border-neutral-800 self-start md:self-end">
            {[
              { id: 'all', labelEn: 'All (500+)', labelAr: 'الكل (+500)' },
              { id: 'fat_loss', labelEn: 'Fat Loss', labelAr: 'خسارة الدهون' },
              { id: 'recomp', labelEn: 'Recomposition', labelAr: 'إعادة التشكيل' },
              { id: 'muscle_gain', labelEn: 'Muscle Gain', labelAr: 'بناء العضلات' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "px-3 py-2 text-xs font-bold transition-all min-h-[38px] cursor-pointer",
                  filter === tab.id
                    ? "bg-[#ccff00] text-black font-extrabold shadow-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                {lang === 'en' ? tab.labelEn : tab.labelAr}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Visual Transformation Showcase (With Real Gym Asset) */}
        <div className="mb-12 bg-[#0e1210] border border-neutral-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 relative h-72 lg:h-full min-h-[320px]">
            <img
              src="/src/assets/images/physique_transformation_showcase_1791556772517.jpg"
              alt="Elite client physique transformation"
              className="w-full h-full object-cover filter brightness-95 contrast-105"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-[#0e1210] lg:opacity-100 opacity-60"
              aria-hidden="true"
            />
            <div className="absolute top-4 left-4 bg-black/85 border border-[#ccff00] px-3 py-1 text-[11px] font-mono text-[#ccff00] font-bold uppercase">
              12 WEEKS RECOMPOSITION
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ccff00] mb-2">
                <span>{lang === 'en' ? 'Clinical Recomposition' : 'تحول إعادة التشكيل'}</span>
                <span className="text-neutral-600">·</span>
                <span>{lang === 'en' ? 'Sub-10% Body Fat' : 'نسبة دهون تحت 10%'}</span>
              </div>
              <h3 className={cn(
                "text-2xl sm:text-3xl font-black text-white mb-3",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {lang === 'en'
                  ? 'Shredded Abs In 12 Weeks While Gaining Lean Muscle'
                  : 'عضلات بطن مقسمة في 12 أسبوعاً مع زيادة الكتلة العضلية'}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {lang === 'en'
                  ? 'Our clients don’t just lose scale weight—they drop pure adipose fat while holding full muscle glycogen. Supervised by Dr. Ahmed Assem with weekly hormonal check-ins and video movement corrections.'
                  : 'متدربونا لا يفقدون مجرد وزن على الميزان، بل يتخلصون من الدهون العنيدة مع الحفاظ الكامل على النسيج العضلي وحجم الجليكوجين، بإشراف أسبوعي مباشر من د. أحمد عاصم.'}
              </p>

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-4 pb-6 border-b border-neutral-800 font-mono">
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase">
                    {lang === 'en' ? 'Fat Loss' : 'خسارة دهون'}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#ccff00] mt-0.5 tabular-nums">
                    -11.5 kg
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase">
                    {lang === 'en' ? 'Lean Mass' : 'كتلة عضلية'}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
                    +4.8 kg
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase">
                    {lang === 'en' ? 'Duration' : 'المدة'}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
                    12 Wks
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <span className="text-xs text-neutral-400">
                {lang === 'en' ? 'Alpha Team Protocol · 100% Customized' : 'بروتوكول فريق الألفا · مخصص 100%'}
              </span>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] transition-colors cursor-pointer text-center"
              >
                {t.hero.ctaStart}
              </button>
            </div>
          </div>
        </div>

        {/* Transformation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((client) => (
            <div
              key={client.id}
              className="bg-[#0f1311] border border-neutral-800 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-3">
                  <span className="text-[#ccff00] font-bold uppercase">
                    {client.type.replace('_', ' ')}
                  </span>
                  <span>{client.duration}</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#ccff00] transition-colors">
                  {lang === 'en' ? client.nameEn : client.nameAr}
                </h3>
                <div className="text-xs text-[#ccff00] font-mono mt-1 mb-4">
                  {lang === 'en' ? client.achievementEn : client.achievementAr}
                </div>

                <div className="p-3 bg-[#151a17] border border-neutral-800/80 mb-4 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{lang === 'en' ? 'Weight Change:' : 'الوزن:'}</span>
                    <span className="text-white font-bold tabular-nums">{client.weightShift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{lang === 'en' ? 'Body Fat:' : 'نسبة الدهون:'}</span>
                    <span className="text-[#ccff00] font-bold tabular-nums">{client.bodyFatShift}</span>
                  </div>
                </div>

                <blockquote className="text-xs text-neutral-300 italic leading-relaxed mb-6">
                  &ldquo;{lang === 'en' ? client.quoteEn : client.quoteAr}&rdquo;
                </blockquote>
              </div>

              <div className="pt-2 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="w-full py-2.5 min-h-[40px] text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-black hover:bg-[#ccff00] border border-neutral-700 hover:border-[#ccff00] transition-colors cursor-pointer text-center"
                >
                  {lang === 'en' ? 'Start Similar Protocol' : 'ابدأ برنامجاً مماثلاً'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 500+ Database Micro-Grid Stamp */}
        <div className="mt-12 p-6 bg-[#0c0f0d] border border-neutral-800 text-center">
          <div className="text-xs font-mono text-[#ccff00] uppercase tracking-wider mb-2">
            {lang === 'en' ? 'CONTINUOUS DOCUMENTATION' : 'توثيق مستمر للنتائج'}
          </div>
          <p className="text-sm text-neutral-300 max-w-xl mx-auto mb-4">
            {lang === 'en'
              ? 'Our archives contain over 500 verified client files, biometric logs, and before-and-after photo records. Join today to start yours.'
              : 'أرشيفنا يضم أكثر من 500 سجل متدرب موثق بالقياسات والصور والتحاليل الطبية. انضم اليوم لتكون قصة النجاح القادمة.'}
          </p>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="inline-flex items-center justify-center py-3 px-8 text-xs font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] min-h-[44px]"
          >
            {t.banner.cta}
          </button>
        </div>
      </div>
    </section>
  );
};
