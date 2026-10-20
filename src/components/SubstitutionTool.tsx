import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../translations';
import { cn } from '../utils/cn';
import { BrandLogo } from './BrandLogo';

export type FoodUnit = 'gm' | 'Number' | 'Scoops' | 'slices' | 'CUP' | 'ml';

export interface SubFood {
  titleEn: string;
  titleAr: string;
  type: string;
  typeAr: string;
  equalHundred: number;
  unit: FoodUnit;
}

export const EXACT_MEALS: SubFood[] = [
  // ── Proteins ──
  { titleEn: 'chicken breasts', titleAr: 'صدر دجاج', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 320, unit: 'gm' },
  { titleEn: 'lean beef', titleAr: 'لحم بقري خالي من الدهون', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 300, unit: 'gm' },
  { titleEn: 'beef liver', titleAr: 'كبدة', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 340, unit: 'gm' },
  { titleEn: 'white fish', titleAr: 'سمك أبيض', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 370, unit: 'gm' },
  { titleEn: 'tuna', titleAr: 'تونة', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 410, unit: 'gm' },
  { titleEn: 'shrimp', titleAr: 'جمبري', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 480, unit: 'gm' },
  { titleEn: 'turkey breast', titleAr: 'صدر ديك رومي', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 330, unit: 'gm' },
  { titleEn: 'whey protein', titleAr: 'بروتين مصل (واي)', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 4, unit: 'Scoops' },
  { titleEn: 'egg whites', titleAr: 'بياض البيض', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 27, unit: 'Number' },
  { titleEn: 'whole eggs', titleAr: 'بيض كامل', type: 'Proteins', typeAr: 'البروتينات', equalHundred: 10, unit: 'Number' },

  // ── High GI Carbohydrates ──
  { titleEn: 'basmati rice', titleAr: 'أرز بسمتي', type: 'High GI Carbohydrates', typeAr: 'كربوهيدرات سريعة الامتصاص', equalHundred: 350, unit: 'gm' },
  { titleEn: 'Egyptian rice', titleAr: 'أرز مصري', type: 'High GI Carbohydrates', typeAr: 'كربوهيدرات سريعة الامتصاص', equalHundred: 180, unit: 'gm' },
  { titleEn: 'cream of rice', titleAr: 'كريمة الأرز', type: 'High GI Carbohydrates', typeAr: 'كربوهيدرات سريعة الامتصاص', equalHundred: 180, unit: 'gm' },
  { titleEn: 'grilled potatoes', titleAr: 'بطاطا مشوية', type: 'High GI Carbohydrates', typeAr: 'كربوهيدرات سريعة الامتصاص', equalHundred: 440, unit: 'gm' },
  { titleEn: 'sweet potatoes', titleAr: 'بطاطا حلوة', type: 'High GI Carbohydrates', typeAr: 'كربوهيدرات سريعة الامتصاص', equalHundred: 470, unit: 'gm' },
  { titleEn: 'pasta', titleAr: 'مكرونة', type: 'High GI Carbohydrates', typeAr: 'كربوهيدرات سريعة الامتصاص', equalHundred: 120, unit: 'gm' },

  // ── Low GI and Snacks Carbohydrates ──
  { titleEn: 'brown toast', titleAr: 'توست بني', type: 'Low GI and Snacks Carbohydrates', typeAr: 'كربوهيدرات بطيئة وسناكس', equalHundred: 7, unit: 'slices' },
  { titleEn: 'corn flakes', titleAr: 'رقائق الذرة (كورن فليكس)', type: 'Low GI and Snacks Carbohydrates', typeAr: 'كربوهيدرات بطيئة وسناكس', equalHundred: 110, unit: 'gm' },
  { titleEn: 'oats', titleAr: 'شوفان', type: 'Low GI and Snacks Carbohydrates', typeAr: 'كربوهيدرات بطيئة وسناكس', equalHundred: 130, unit: 'gm' },
  { titleEn: 'corn tortilla', titleAr: 'تورتيلا الذرة', type: 'Low GI and Snacks Carbohydrates', typeAr: 'كربوهيدرات بطيئة وسناكس', equalHundred: 4, unit: 'slices' },
  { titleEn: 'rice cake', titleAr: 'كعكة الأرز (رايس كيك)', type: 'Low GI and Snacks Carbohydrates', typeAr: 'كربوهيدرات بطيئة وسناكس', equalHundred: 120, unit: 'gm' },

  // ── Vegetables ──
  { titleEn: 'green peas', titleAr: 'بازلاء خضراء', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 120, unit: 'gm' },
  { titleEn: 'zucchini', titleAr: 'كوسا', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 550, unit: 'gm' },
  { titleEn: 'green beans', titleAr: 'فاصوليا خضراء', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 250, unit: 'gm' },
  { titleEn: 'asparagus', titleAr: 'هليون', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 360, unit: 'gm' },
  { titleEn: 'cucumber', titleAr: 'خيار', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 550, unit: 'gm' },
  { titleEn: 'mushroom', titleAr: 'فطر (مشروم)', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 300, unit: 'gm' },
  { titleEn: 'lettuce', titleAr: 'خس', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 500, unit: 'gm' },
  { titleEn: 'bell pepper', titleAr: 'فلفل رومي', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 320, unit: 'gm' },
  { titleEn: 'tomatoes', titleAr: 'طماطم', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 500, unit: 'gm' },
  { titleEn: 'carrot', titleAr: 'جزر', type: 'Vegetables', typeAr: 'الخضروات', equalHundred: 240, unit: 'gm' },

  // ── Fruits ──
  { titleEn: 'bananas', titleAr: 'موز', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 1.8, unit: 'Number' },
  { titleEn: 'apples', titleAr: 'تفاح', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 3, unit: 'Number' },
  { titleEn: 'pomegranate', titleAr: 'رمان', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 110, unit: 'gm' },
  { titleEn: 'oranges', titleAr: 'برتقال', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 3, unit: 'Number' },
  { titleEn: 'watermelon', titleAr: 'بطيخ', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 300, unit: 'gm' },
  { titleEn: 'strawberry', titleAr: 'فراولة', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 300, unit: 'gm' },
  { titleEn: 'kiwi', titleAr: 'كيوي', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 3, unit: 'Number' },

  // ── Dairy ──
  { titleEn: 'cottage cheese', titleAr: 'جبن قريش', type: 'Dairy', typeAr: 'الألبان', equalHundred: 900, unit: 'gm' },
  { titleEn: 'greek yogurt', titleAr: 'زبادي يوناني', type: 'Dairy', typeAr: 'الألبان', equalHundred: 4, unit: 'CUP' },
];

export const CATEGORIES = [...new Set(EXACT_MEALS.map((m) => m.type))];

export function getUnitLabel(unit: FoodUnit, lang: 'en' | 'ar', value: number = 1): string {
  if (lang === 'ar') {
    switch (unit) {
      case 'gm': return 'جرام';
      case 'Number': return 'قطعة';
      case 'Scoops': return 'سكوب';
      case 'slices': return 'شريحة';
      case 'CUP': return 'كوب';
      case 'ml': return 'مل';
      default: return 'جرام';
    }
  }
  switch (unit) {
    case 'gm': return 'gm';
    case 'Number': return value === 1 ? 'piece' : 'pieces';
    case 'Scoops': return value === 1 ? 'scoop' : 'scoops';
    case 'slices': return value === 1 ? 'slice' : 'slices';
    case 'CUP': return value === 1 ? 'cup' : 'cups';
    case 'ml': return 'ml';
    default: return 'gm';
  }
}

interface SubstitutionToolProps {
  lang: Language;
}

export const SubstitutionTool: React.FC<SubstitutionToolProps> = ({ lang }) => {
  const en = lang === 'en';

  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [results, setResults] = useState<{ meal: SubFood; value: number }[] | null>(null);

  const selectedMeal = useMemo(
    () => EXACT_MEALS.find((m) => m.titleEn === selectedTitle) || null,
    [selectedTitle]
  );

  const filteredMeals = useMemo(() => {
    const list = activeCategory === 'All'
      ? EXACT_MEALS
      : EXACT_MEALS.filter((m) => m.type === activeCategory);
    return [...list].sort((a, b) =>
      (en ? a.titleEn : a.titleAr).localeCompare(en ? b.titleEn : b.titleAr)
    );
  }, [activeCategory, en]);

  const handleSelectMeal = (mealTitle: string) => {
    setSelectedTitle(mealTitle);
    setResults(null);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeal || !inputValue) return;
    const entered = parseFloat(inputValue);
    if (isNaN(entered) || entered <= 0) return;

    // Exact formula from drahmedassem.com/Asem/Substitutions:
    // effectiveEnergy = ((enteredValue * 100) / filteredMeal.equalHundred);
    // subs.value = Math.floor(effectiveEnergy * e.equalHundred / 100);
    const effectiveEnergy = (entered * 100) / selectedMeal.equalHundred;
    const sameTypeMeals = EXACT_MEALS.filter(
      (m) => m.type === selectedMeal.type && m.titleEn !== selectedMeal.titleEn
    );

    const calculated = sameTypeMeals.map((m) => {
      const rawVal = (effectiveEnergy * m.equalHundred) / 100;
      // If the unit is pieces or scoops or cups, round to 1 decimal if small, else floor
      const formatted = m.equalHundred < 10
        ? Math.round(rawVal * 10) / 10
        : Math.floor(rawVal);
      return {
        meal: m,
        value: formatted,
      };
    });

    setResults(calculated);
  };

  return (
    <div className="w-full">
      <div className="bg-[#121614] border border-neutral-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -top-24 -end-24 w-72 h-72 bg-[#8cffdb]/5 rounded-full blur-3xl" />

        {/* Category Pills */}
        <div className="mb-6">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
            {en ? '1. Select Category' : '١. اختر المجموعة الغذائية'}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setActiveCategory('All'); }}
              className={cn(
                'px-3.5 py-2 text-xs font-bold border transition-colors cursor-pointer',
                activeCategory === 'All'
                  ? 'bg-[#8cffdb] text-black border-[#8cffdb]'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600'
              )}
            >
              {en ? 'All Foods' : 'كل الأطعمة'}
            </button>
            {CATEGORIES.map((cat) => {
              const sample = EXACT_MEALS.find((m) => m.type === cat);
              const label = en ? cat : (sample?.typeAr || cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setActiveCategory(cat); }}
                  className={cn(
                    'px-3.5 py-2 text-xs font-bold border transition-colors cursor-pointer',
                    activeCategory === cat
                      ? 'bg-[#8cffdb] text-black border-[#8cffdb]'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Meal Dropdown */}
            <div className="md:col-span-7">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                {en ? '2. Choose Food to Substitute' : '٢. اختر نوع الطعام'}
              </label>
              <select
                required
                value={selectedTitle}
                onChange={(e) => handleSelectMeal(e.target.value)}
                className="w-full h-12 bg-neutral-900 border border-neutral-700 px-4 text-sm text-white focus:outline-none focus:border-[#8cffdb] cursor-pointer"
              >
                <option value="">{en ? 'Choose a food...' : 'اختر نوع الطعام...'}</option>
                {filteredMeals.map((m) => (
                  <option key={m.titleEn} value={m.titleEn}>
                    {(en ? m.titleEn : m.titleAr).toUpperCase()} ({en ? m.type : m.typeAr})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Input */}
            <div className="md:col-span-5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                {en ? '3. Weight / Amount' : '٣. الكمية / الوزن'}
              </label>
              <div className="relative flex items-center">
                <input
                  required
                  type="number"
                  min="0.1"
                  step="any"
                  max="9999"
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); setResults(null); }}
                  placeholder={en ? 'e.g. 100' : 'مثال: ١٠٠'}
                  className="w-full h-12 bg-neutral-900 border border-neutral-700 px-4 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#8cffdb]"
                />
                <span className="absolute end-3 text-xs font-mono font-bold text-neutral-400 px-2 py-1 bg-neutral-800 border border-neutral-700">
                  {selectedMeal ? getUnitLabel(selectedMeal.unit, lang as 'en' | 'ar') : (en ? 'gm' : 'جرام')}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedMeal || !inputValue}
            className="w-full h-12 bg-[#8cffdb] hover:bg-[#77d9ba] disabled:opacity-40 disabled:hover:bg-[#8cffdb] text-black font-black uppercase text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(140,255,219,0.25)] flex items-center justify-center gap-2"
          >
            <span>{en ? 'CALCULATE SUBSTITUTIONS' : 'احسب البدائل المتاحة'}</span>
            <span className="font-mono">→</span>
          </button>
        </form>

        {/* Results Box */}
        {results !== null && (
          <div className="mt-8 pt-8 border-t border-neutral-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8cffdb]">
                  {en ? 'Equivalents' : 'البدائل المعادلة'}
                </span>
                <h3 className={cn('text-xl sm:text-2xl font-black text-white', en ? 'font-sport' : 'font-cairo')}>
                  {en ? 'Substitutes for ' : 'بدائل '}
                  <span className="text-[#8cffdb]">
                    {inputValue} {selectedMeal && getUnitLabel(selectedMeal.unit, lang as 'en' | 'ar', parseFloat(inputValue))} {en ? selectedMeal?.titleEn : selectedMeal?.titleAr}
                  </span>
                </h3>
              </div>
              <span className="px-3 py-1 bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-300">
                {results.length} {en ? 'Options' : 'بدائل متوفرة'}
              </span>
            </div>

            {results.length === 0 ? (
              <p className="text-sm text-neutral-400 py-6 text-center">
                {en ? 'No other substitutes found in this group.' : 'لا توجد بدائل أخرى في نفس المجموعة.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.map(({ meal, value }) => (
                  <div
                    key={meal.titleEn}
                    className="p-4 bg-neutral-900/90 border border-neutral-800 hover:border-[#8cffdb]/60 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white group-hover:text-[#8cffdb] transition-colors truncate">
                        {en ? meal.titleEn : meal.titleAr}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {en ? meal.type : meal.typeAr}
                      </div>
                    </div>
                    <div className="text-end shrink-0 font-mono">
                      <span className="text-lg font-black text-[#8cffdb] tabular-nums">
                        {value}
                      </span>
                      <span className="text-xs ms-1 text-neutral-400">
                        {getUnitLabel(meal.unit, lang as 'en' | 'ar', value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-neutral-950/70 border border-neutral-800/80 text-[11px] text-neutral-400 leading-relaxed flex items-start gap-2">
              <span className="text-[#8cffdb] font-bold">ℹ</span>
              <span>
                {en
                  ? 'All food weights are cooked weights, except oats and cream of rice which are weighed raw/dry. Fresh fruits and ready-to-eat foods are weighed as eaten.'
                  : 'كل أوزان الأطعمة مطهية، ما عدا الشوفان وكريمة الأرز توزن جافة (خام). الفواكه الطازجة توزن كما تؤكل.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Standalone Full Page for /substitutions ────────────────────────────────────
interface SubstitutionsPageProps {
  lang: Language;
  onToggleLang: () => void;
}

export const SubstitutionsPage: React.FC<SubstitutionsPageProps> = ({ lang, onToggleLang }) => {
  const navigate = useNavigate();
  const en = lang === 'en';

  return (
    <div
      className={cn(
        'min-h-screen bg-[#090b0a] text-neutral-100 flex flex-col selection:bg-[#8cffdb] selection:text-black',
        lang === 'ar' ? 'font-cairo' : 'font-sans'
      )}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#090b0a]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-[#8cffdb] transition-colors cursor-pointer"
          >
            <span className="text-base">{en ? '←' : '→'}</span>
            <span>{en ? 'Back to Home' : 'الرئيسية'}</span>
          </button>

          <a href="/" className="flex items-center gap-2.5">
            <BrandLogo size={30} />
            <span className={cn('text-sm font-black text-white tracking-tight', en ? 'font-sport' : 'font-cairo')}>
              {en ? 'DR. AHMED ASSEM' : 'د. أحمد عاصم'}
            </span>
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleLang}
              className="px-2.5 py-1.5 text-xs font-bold border border-neutral-700 bg-neutral-900/80 hover:border-[#8cffdb] hover:text-[#8cffdb] text-neutral-200 transition-colors cursor-pointer"
            >
              🌐 {en ? 'العربية' : 'English'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/form')}
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] cursor-pointer"
            >
              {en ? 'Apply Now' : 'قدم الآن'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 bg-[#8cffdb]/10 border border-[#8cffdb]/30 text-xs font-mono font-bold text-[#8cffdb] uppercase tracking-widest mb-4">
            {en ? 'ALPHA NUTRITION PROTOCOL' : 'بروتوكول التغذية الرياضية'}
          </div>
          <h1
            className={cn(
              'text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight',
              en ? 'font-sport' : 'font-cairo'
            )}
          >
            {en ? 'FOOD SUBSTITUTION SYSTEM' : 'نظام بدائل الأطعمة الرياضي'}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed">
            {en
              ? 'Effortlessly swap any protein, carb, vegetable, or fruit in your diet while preserving your exact macronutrient target and calories.'
              : 'استبدل أي نوع بروتين، كربوهيدرات، خضار أو فاكهة في نظامك الغذائي مع الحفاظ الكامل على نفس السعرات والماكروز.'}
          </p>
        </div>

        <SubstitutionTool lang={lang} />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 bg-[#060807] text-center text-xs text-neutral-500 font-mono">
        <p>© {new Date().getFullYear()} Dr. Ahmed Assem. IFBB Pro & Clinical Nutritionist. All rights reserved.</p>
      </footer>
    </div>
  );
};
