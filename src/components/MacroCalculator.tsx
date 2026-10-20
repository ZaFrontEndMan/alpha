import React, { useMemo, useState } from 'react';
import { Language } from '../translations';
import { cn } from '../utils/cn';
import { ActivityLevel, FitnessGoal, Gender } from '../types';
import { FOOD_GROUPS, FoodGroup, WEIGHING_NOTE, basisLabel, isCounted } from '../data/foodSubstitutions';

interface MacroCalculatorProps {
  lang: Language;
  onApplyWithMacros: (macroSummary: string) => void;
}

const ACTIVITY: { id: ActivityLevel; mult: number; en: string; ar: string }[] = [
  { id: 'sedentary', mult: 1.2, en: 'Desk job, no training', ar: 'عمل مكتبي بدون تدريب' },
  { id: 'light', mult: 1.375, en: 'Training 1–3 days', ar: 'تدريب ١-٣ أيام' },
  { id: 'moderate', mult: 1.55, en: 'Training 3–5 days', ar: 'تدريب ٣-٥ أيام' },
  { id: 'very_active', mult: 1.725, en: 'Training 6–7 days', ar: 'تدريب ٦-٧ أيام' },
  { id: 'athlete', mult: 1.9, en: 'Athlete, twice a day', ar: 'رياضي، تدريب مرتين يومياً' },
];

const GOALS: { id: FitnessGoal; factor: number; en: string; ar: string }[] = [
  { id: 'aggressive_cut', factor: 0.75, en: 'Fast fat loss', ar: 'خسارة دهون سريعة' },
  { id: 'moderate_cut', factor: 0.85, en: 'Steady fat loss', ar: 'خسارة دهون تدريجية' },
  { id: 'maintenance_recomp', factor: 1, en: 'Recomposition', ar: 'إعادة تشكيل' },
  { id: 'lean_bulk', factor: 1.1, en: 'Lean muscle gain', ar: 'زيادة عضلية نظيفة' },
];

/** Small labelled number field. */
const Field: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
}> = ({ label, value, onChange, suffix, min = 0, max = 400 }) => (
  <label className="block">
    <span className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">{label}</span>
    <div className="relative">
      <input
        type="number"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-[#0f1311] border border-neutral-800 focus:border-[#8cffdb] focus:outline-none text-white text-lg font-bold px-3 py-2.5 min-h-[46px] transition-colors tabular-nums"
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs font-mono text-neutral-500">
          {suffix}
        </span>
      )}
    </div>
  </label>
);

/** Segmented picker — one row of options, used for gender / activity / goal. */
const Choice: React.FC<{
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  cols?: string;
}> = ({ label, options, value, onChange, cols = 'grid-cols-2' }) => (
  <div>
    <span className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">{label}</span>
    <div className={cn('grid gap-1.5', cols)}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            'px-3 py-2.5 min-h-[46px] text-xs font-bold transition-colors cursor-pointer border text-start',
            value === o.id
              ? 'bg-[#8cffdb] text-black border-[#8cffdb]'
              : 'bg-[#0f1311] text-neutral-300 border-neutral-800 hover:border-neutral-600'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

export const MacroCalculator: React.FC<MacroCalculatorProps> = ({ lang, onApplyWithMacros }) => {
  const en = lang === 'en';
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(28);
  const [weight, setWeight] = useState(82);
  const [height, setHeight] = useState(178);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<FitnessGoal>('moderate_cut');
  const [group, setGroup] = useState<FoodGroup>(FOOD_GROUPS[0]);

  // Mifflin–St Jeor for BMR, activity multiplier for maintenance, then the goal's calorie shift.
  // Protein is set per kg of bodyweight, fat at 25% of calories, carbs take the rest.
  const r = useMemo(() => {
    const bmr =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    const tdee = Math.round(bmr * (ACTIVITY.find((a) => a.id === activity)?.mult ?? 1.55));
    const g = GOALS.find((x) => x.id === goal) ?? GOALS[1];
    const calories = Math.max(Math.round(tdee * g.factor), gender === 'male' ? 1400 : 1200);

    const protein = Math.round(weight * (goal === 'aggressive_cut' ? 2.5 : 2.2));
    const fat = Math.max(Math.round((calories * 0.25) / 9), 40);
    const carbs = Math.max(Math.round((calories - protein * 4 - fat * 9) / 4), 40);

    return {
      tdee,
      calories: protein * 4 + carbs * 4 + fat * 9,
      protein,
      carbs,
      fat,
      water: Number(((weight * 42) / 1000).toFixed(1)),
    };
  }, [gender, age, weight, height, activity, goal]);

  /** How much of the user's daily target this group covers, in the group's own unit. */
  const target =
    group.basis === 'protein' ? r.protein : group.basis === 'carbs' ? r.carbs : group.basis === 'fat' ? r.fat : 100;

  const macros = [
    { label: en ? 'Calories' : 'السعرات', value: r.calories, unit: 'kcal', accent: true },
    { label: en ? 'Protein' : 'بروتين', value: r.protein, unit: 'g' },
    { label: en ? 'Carbs' : 'كربوهيدرات', value: r.carbs, unit: 'g' },
    { label: en ? 'Fats' : 'دهون', value: r.fat, unit: 'g' },
  ];

  return (
    <section id="calculator" className="py-20 md:py-28 section-blend @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold tracking-widest text-[#8cffdb] uppercase mb-3">
            {en ? 'MACRO CALCULATOR' : 'حاسبة الماكروز'}
          </div>
          <h2
            className={cn(
              'text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]',
              en ? 'font-sport' : 'font-cairo'
            )}
          >
            {en ? 'Your Daily Calories & Macros' : 'سعراتك وماكروزك اليومية'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            {en
              ? 'Six answers, your numbers, and the food amounts that hit them — using Dr. Assem’s own substitution list.'
              : 'ست إجابات، أرقامك، وكميات الأكل التي تحققها — من قائمة البدائل الخاصة بد. أحمد عاصم.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-[#090b0a] border border-neutral-800 p-5 sm:p-6 space-y-5">
            <Choice
              label={en ? 'Gender' : 'النوع'}
              value={gender}
              onChange={(v) => setGender(v as Gender)}
              options={[
                { id: 'male', label: en ? 'Male' : 'ذكر' },
                { id: 'female', label: en ? 'Female' : 'أنثى' },
              ]}
            />

            <div className="grid grid-cols-3 gap-3">
              <Field label={en ? 'Age' : 'العمر'} value={age} onChange={setAge} min={14} max={90} />
              <Field label={en ? 'Weight' : 'الوزن'} value={weight} onChange={setWeight} suffix="kg" min={35} max={250} />
              <Field label={en ? 'Height' : 'الطول'} value={height} onChange={setHeight} suffix="cm" min={120} max={230} />
            </div>

            <Choice
              label={en ? 'Activity' : 'النشاط'}
              value={activity}
              onChange={(v) => setActivity(v as ActivityLevel)}
              cols="grid-cols-1"
              options={ACTIVITY.map((a) => ({ id: a.id, label: en ? a.en : a.ar }))}
            />

            <Choice
              label={en ? 'Goal' : 'الهدف'}
              value={goal}
              onChange={(v) => setGoal(v as FitnessGoal)}
              cols="grid-cols-2"
              options={GOALS.map((g) => ({ id: g.id, label: en ? g.en : g.ar }))}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0f1311] border border-neutral-800 p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                {macros.map((m) => (
                  <div key={m.label}>
                    <div className="text-[11px] uppercase tracking-wider text-neutral-400">{m.label}</div>
                    <div
                      className={cn(
                        'mt-1 text-2xl sm:text-3xl font-black tabular-nums',
                        m.accent ? 'text-[#8cffdb]' : 'text-white'
                      )}
                    >
                      {m.value}
                      <span className="text-xs font-bold text-neutral-500 ms-1">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
                <span>
                  {en ? 'Maintenance' : 'سعرات الثبات'}{' '}
                  <span className="text-white font-bold tabular-nums">{r.tdee}</span> kcal ·{' '}
                  {en ? 'Water' : 'الماء'} <span className="text-white font-bold tabular-nums">{r.water}</span> L
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onApplyWithMacros(
                      `${r.calories} kcal (P: ${r.protein}g, C: ${r.carbs}g, F: ${r.fat}g) for ${goal.replace(/_/g, ' ')}`
                    )
                  }
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[40px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] transition-colors cursor-pointer"
                >
                  {en ? 'Apply with a coach' : 'ابدأ بهذه الأرقام'}
                </button>
              </div>
            </div>

            {/* Substitution list, scaled to the targets above */}
            <div className="bg-[#0f1311] border border-neutral-800 p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <h3 className={cn('text-lg font-black text-white', en ? 'font-sport' : 'font-cairo')}>
                  {en ? 'Hit it with real food' : 'حقق أرقامك بأكل حقيقي'}
                </h3>
                <span className="text-[11px] font-mono text-neutral-500">
                  {group.basis === 'calories'
                    ? en
                      ? 'per 100 kcal'
                      : 'لكل ١٠٠ سعر'
                    : en
                      ? `for your ${target} g ${group.basis === 'protein' ? 'protein' : group.basis === 'carbs' ? 'carbs' : 'fat'}`
                      : `لـ ${target} جم`}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {FOOD_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGroup(g)}
                    className={cn(
                      'px-3 py-2 min-h-[38px] text-xs font-bold transition-colors cursor-pointer border',
                      group.id === g.id
                        ? 'bg-[#8cffdb] text-black border-[#8cffdb]'
                        : 'bg-[#090b0a] text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600'
                    )}
                  >
                    {en ? g.en : g.ar}
                  </button>
                ))}
              </div>

              <ul className="divide-y divide-neutral-800/80">
                {group.items.map((item) => {
                  const counted = isCounted(item);
                  // Counted foods (eggs, toast slices) stay whole; everything else scales by grams.
                  const scaled = counted
                    ? Math.max(1, Math.round((item.grams * target) / 100))
                    : Math.round((item.grams * target) / 100);
                  const unit = counted
                    ? en
                      ? scaled === 1
                        ? 'piece'
                        : 'pieces'
                      : 'قطعة'
                    : item.en === 'Whole milk'
                      ? 'ml'
                      : en
                        ? 'g'
                        : 'جم';
                  const note = en ? item.noteEn : item.noteAr;
                  return (
                    <li key={item.en} className="flex items-baseline justify-between gap-4 py-2.5">
                      <div className="min-w-0">
                        <span className="text-sm text-neutral-200">{en ? item.en : item.ar}</span>
                        {note && <span className="block text-[11px] text-neutral-500">{note}</span>}
                      </div>
                      <div className="text-end shrink-0 font-mono">
                        <span className="text-sm font-bold text-[#8cffdb] tabular-nums">
                          {scaled} {unit}
                        </span>
                        <span className="block text-[10px] text-neutral-500 tabular-nums">
                          {item.grams}
                          {counted ? (en ? ' pcs' : ' قطعة') : item.en === 'Whole milk' ? ' ml' : ' g'} ={' '}
                          {basisLabel(group.basis, lang)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 pt-4 border-t border-neutral-800 text-[11px] leading-relaxed text-neutral-500">
                {en ? WEIGHING_NOTE.en : WEIGHING_NOTE.ar}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
