import React, { useState, useMemo } from 'react';
import { UnitSystem, Gender, ActivityLevel, FitnessGoal, DietPreference, MacroCalculationResult } from '../types';
import { Language } from '../translations';
import { cn } from '../utils/cn';

interface MacroCalculatorProps {
  lang: Language;
  onApplyWithMacros: (summary: string) => void;
}

export const MacroCalculator: React.FC<MacroCalculatorProps> = ({ lang, onApplyWithMacros }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(82);
  const [weightLbs, setWeightLbs] = useState<number>(180);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(10);
  const [bodyFat, setBodyFat] = useState<string>('15');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<FitnessGoal>('moderate_cut');
  const [dietPref, setDietPref] = useState<DietPreference>('balanced');
  const [mealsCount, setMealsCount] = useState<number>(4);
  const [copied, setCopied] = useState<boolean>(false);

  // Synchronize metric & imperial values smoothly
  const effectiveWeightKg = useMemo(() => {
    return unitSystem === 'metric' ? weightKg : Number((weightLbs * 0.45359237).toFixed(1));
  }, [unitSystem, weightKg, weightLbs]);

  const effectiveHeightCm = useMemo(() => {
    return unitSystem === 'metric' ? heightCm : Number(((heightFt * 12 + heightIn) * 2.54).toFixed(1));
  }, [unitSystem, heightCm, heightFt, heightIn]);

  // Clinical Metabolic Calculations (Mifflin-St Jeor & Katch-McArdle)
  const results: MacroCalculationResult = useMemo(() => {
    const bfPercent = parseFloat(bodyFat);
    let bmr: number;

    if (!isNaN(bfPercent) && bfPercent > 4 && bfPercent < 45) {
      const leanMassKg = effectiveWeightKg * (1 - bfPercent / 100);
      bmr = Math.round(370 + 21.6 * leanMassKg);
    } else {
      if (gender === 'male') {
        bmr = Math.round(10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age + 5);
      } else {
        bmr = Math.round(10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age - 161);
      }
    }

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
      athlete: 1.9,
    };

    const tdee = Math.round(bmr * activityMultipliers[activity]);

    let targetCalories = tdee;
    if (goal === 'aggressive_cut') {
      targetCalories = Math.round(tdee * 0.75);
    } else if (goal === 'moderate_cut') {
      targetCalories = Math.round(tdee * 0.85);
    } else if (goal === 'maintenance_recomp') {
      targetCalories = tdee;
    } else if (goal === 'lean_bulk') {
      targetCalories = Math.round(tdee * 1.10);
    } else if (goal === 'contest_prep') {
      targetCalories = Math.round(tdee * 0.78);
    }

    const safeMin = gender === 'male' ? 1400 : 1200;
    targetCalories = Math.max(targetCalories, safeMin);

    let proteinGrams = Math.round(effectiveWeightKg * 2.3);
    if (goal === 'aggressive_cut' || goal === 'contest_prep') {
      proteinGrams = Math.round(effectiveWeightKg * 2.5);
    } else if (dietPref === 'low_carb_keto') {
      proteinGrams = Math.round(effectiveWeightKg * 2.2);
    }

    const proteinCalories = proteinGrams * 4;
    const remainingCalories = Math.max(targetCalories - proteinCalories, targetCalories * 0.3);

    let fatsCalories: number;
    let carbsCalories: number;

    if (dietPref === 'low_carb_keto') {
      fatsCalories = Math.round(remainingCalories * 0.75);
      carbsCalories = remainingCalories - fatsCalories;
    } else if (dietPref === 'carb_cycling') {
      fatsCalories = Math.round(targetCalories * 0.22);
      carbsCalories = targetCalories - proteinCalories - fatsCalories;
    } else {
      fatsCalories = Math.round(targetCalories * 0.25);
      carbsCalories = targetCalories - proteinCalories - fatsCalories;
    }

    const fatsGrams = Math.max(Math.round(fatsCalories / 9), 40);
    const calculatedFatsCalories = fatsGrams * 9;

    const carbsGrams = Math.max(Math.round(carbsCalories / 4), 50);
    const calculatedCarbsCalories = carbsGrams * 4;

    const totalCal = proteinCalories + calculatedCarbsCalories + calculatedFatsCalories;
    const waterLiters = Number(((effectiveWeightKg * 42) / 1000).toFixed(1));

    return {
      bmr,
      tdee,
      targetCalories: totalCal,
      proteinGrams,
      proteinCalories,
      carbsGrams,
      carbsCalories: calculatedCarbsCalories,
      fatsGrams,
      fatsCalories: calculatedFatsCalories,
      waterLiters,
      proteinRatio: Math.round((proteinCalories / totalCal) * 100),
      carbsRatio: Math.round((calculatedCarbsCalories / totalCal) * 100),
      fatsRatio: Math.round((calculatedFatsCalories / totalCal) * 100),
    };
  }, [gender, age, effectiveWeightKg, effectiveHeightCm, bodyFat, activity, goal, dietPref]);

  const handleCopyProtocol = () => {
    const text = `DR. AHMED ASSEM - CLINICAL METABOLIC BREAKDOWN
--------------------------------------------------
Profile: ${gender.toUpperCase()} · ${age} yrs · ${effectiveWeightKg}kg · ${effectiveHeightCm}cm
Goal: ${goal.replace('_', ' ').toUpperCase()} (${dietPref.replace('_', ' ').toUpperCase()})
BMR: ${results.bmr} kcal | TDEE: ${results.tdee} kcal
Target Daily Energy: ${results.targetCalories} kcal
Protein: ${results.proteinGrams}g (${results.proteinCalories} kcal)
Carbohydrates: ${results.carbsGrams}g (${results.carbsCalories} kcal)
Fats: ${results.fatsGrams}g (${results.fatsCalories} kcal)
Daily Hydration Target: ${results.waterLiters} Liters
Per Meal Target (${mealsCount} meals):
- Calories: ${Math.round(results.targetCalories / mealsCount)} kcal
- Protein: ${Math.round(results.proteinGrams / mealsCount)}g
- Carbs: ${Math.round(results.carbsGrams / mealsCount)}g
- Fats: ${Math.round(results.fatsGrams / mealsCount)}g
--------------------------------------------------
Calculated at https://drahmedassem.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConsultDoctorWithData = () => {
    const summary = `${results.targetCalories} kcal (P: ${results.proteinGrams}g, C: ${results.carbsGrams}g, F: ${results.fatsGrams}g) for ${goal.replace('_', ' ')}`;
    onApplyWithMacros(summary);
  };

  return (
    <section id="calculator" className="py-20 md:py-28 bg-[#0c0f0d] border-b border-neutral-800/80 @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold tracking-widest text-[#ccff00] uppercase mb-3">
            {lang === 'en' ? 'CLINICAL CALORIE ENGINE' : 'حاسبة السعرات الطبية'}
          </div>
          <h2 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {lang === 'en'
              ? 'Physiological Calorie & Macronutrient Calculator'
              : 'حاسبة السعرات والماكروز الدقيقة'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            {lang === 'en'
              ? 'Calibrated with the Mifflin-St Jeor & Katch-McArdle metabolic formulas used in Dr. Assem’s clinical practice.'
              : 'معايرة بمعادلتي Mifflin-St Jeor و Katch-McArdle المستخدمتين في عيادة د. أحمد عاصم لحساب احتياجك بدقة.'}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-[#090b0a] border border-neutral-800 p-6 sm:p-8 space-y-6">
            {/* System & Gender Switchers */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-1 p-1 bg-[#151a17] border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[36px] cursor-pointer",
                    unitSystem === 'metric'
                      ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  Metric (kg/cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[36px] cursor-pointer",
                    unitSystem === 'imperial'
                      ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  Imperial (lbs/in)
                </button>
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#151a17] border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[36px] cursor-pointer",
                    gender === 'male'
                      ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  {lang === 'en' ? 'Male' : 'ذكر'}
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[36px] cursor-pointer",
                    gender === 'female'
                      ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  )}
                >
                  {lang === 'en' ? 'Female' : 'أنثى'}
                </button>
              </div>
            </div>

            {/* Numeric Biometrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  {lang === 'en' ? 'Age (Years)' : 'العمر (سنة)'}
                </label>
                <input
                  type="number"
                  min="16"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(Math.max(16, parseInt(e.target.value) || 16))}
                  className="w-full bg-[#121614] border border-neutral-800 focus:border-[#ccff00] px-3.5 py-2.5 text-white font-mono tabular-nums text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  {lang === 'en' ? `Weight (${unitSystem === 'metric' ? 'kg' : 'lbs'})` : `الوزن (${unitSystem === 'metric' ? 'كجم' : 'باوند'})`}
                </label>
                {unitSystem === 'metric' ? (
                  <input
                    type="number"
                    min="35"
                    max="220"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-neutral-800 focus:border-[#ccff00] px-3.5 py-2.5 text-white font-mono tabular-nums text-sm focus:outline-none"
                  />
                ) : (
                  <input
                    type="number"
                    min="80"
                    max="480"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-neutral-800 focus:border-[#ccff00] px-3.5 py-2.5 text-white font-mono tabular-nums text-sm focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  {lang === 'en' ? `Height (${unitSystem === 'metric' ? 'cm' : 'ft/in'})` : `الطول (${unitSystem === 'metric' ? 'سم' : 'قدم/بوصة'})`}
                </label>
                {unitSystem === 'metric' ? (
                  <input
                    type="number"
                    min="120"
                    max="230"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121614] border border-neutral-800 focus:border-[#ccff00] px-3.5 py-2.5 text-white font-mono tabular-nums text-sm focus:outline-none"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="4"
                      max="7"
                      value={heightFt}
                      onChange={(e) => setHeightFt(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#121614] border border-neutral-800 focus:border-[#ccff00] px-2 py-2.5 text-white font-mono tabular-nums text-sm focus:outline-none text-center"
                    />
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#121614] border border-neutral-800 focus:border-[#ccff00] px-2 py-2.5 text-white font-mono tabular-nums text-sm focus:outline-none text-center"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Goal Target */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Physique Objective' : 'الهدف الأساسي'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'aggressive_cut', labelEn: 'Aggressive Cut', labelAr: 'تنشيف سريع', delta: '-25%' },
                  { id: 'moderate_cut', labelEn: 'Moderate Cut', labelAr: 'تنشيف متوازن', delta: '-15%' },
                  { id: 'maintenance_recomp', labelEn: 'Recomposition', labelAr: 'إعادة تشكيل', delta: '0%' },
                  { id: 'lean_bulk', labelEn: 'Lean Mass Gain', labelAr: 'زيادة عضلية صافية', delta: '+10%' },
                  { id: 'contest_prep', labelEn: 'Contest Peaking', labelAr: 'تحضير مسرح', delta: '-22%' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id as FitnessGoal)}
                    className={cn(
                      "p-3 text-left border transition-all cursor-pointer min-h-[44px]",
                      goal === g.id
                        ? 'border-[#ccff00] bg-[#141a15]'
                        : 'border-neutral-800 bg-[#0e1210] hover:border-neutral-700'
                    )}
                  >
                    <span className="text-xs font-bold text-white block">
                      {lang === 'en' ? g.labelEn : g.labelAr}
                    </span>
                    <span className="text-[11px] font-mono text-[#ccff00] mt-0.5 block">{g.delta}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Results & Macros Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-[#090b0a] border border-neutral-800 p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <span className="text-xs font-mono font-bold text-[#ccff00] uppercase tracking-wider">
                {lang === 'en' ? 'Clinical Prescription' : 'النتيجة المحسوبة'}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                BMR: {results.bmr} kcal
              </span>
            </div>

            {/* Target Daily Calories Main Box */}
            <div className="bg-[#121614] border border-neutral-800 p-6 text-center">
              <div className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">
                {lang === 'en' ? 'Target Daily Calories' : 'السعرات اليومية المستهدفة'}
              </div>
              <div className="text-5xl font-black text-white font-mono tabular-nums tracking-tight">
                {results.targetCalories}
                <span className="text-sm font-sans font-bold text-[#ccff00] ml-1.5 uppercase">
                  kcal
                </span>
              </div>
              <div className="text-xs text-neutral-400 mt-2 flex items-center justify-center gap-3 font-mono">
                <span>TDEE: {results.tdee} kcal</span>
                <span>·</span>
                <span className="text-[#ccff00]">
                  {results.targetCalories > results.tdee ? `+${results.targetCalories - results.tdee}` : `${results.targetCalories - results.tdee}`} kcal
                </span>
              </div>
            </div>

            {/* 3 Macro Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#121614] border border-neutral-800 p-3.5 text-center">
                <div className="text-[11px] font-bold text-[#ccff00] uppercase tracking-wider">
                  {lang === 'en' ? 'Protein' : 'بروتين'}
                </div>
                <div className="text-2xl font-black text-white font-mono tabular-nums mt-1">
                  {results.proteinGrams}g
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  {results.proteinCalories} kcal
                </div>
              </div>

              <div className="bg-[#121614] border border-neutral-800 p-3.5 text-center">
                <div className="text-[11px] font-bold text-neutral-200 uppercase tracking-wider">
                  {lang === 'en' ? 'Carbs' : 'كارب'}
                </div>
                <div className="text-2xl font-black text-white font-mono tabular-nums mt-1">
                  {results.carbsGrams}g
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  {results.carbsCalories} kcal
                </div>
              </div>

              <div className="bg-[#121614] border border-neutral-800 p-3.5 text-center">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Fats' : 'دهون'}
                </div>
                <div className="text-2xl font-black text-white font-mono tabular-nums mt-1">
                  {results.fatsGrams}g
                </div>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  {results.fatsCalories} kcal
                </div>
              </div>
            </div>

            {/* Actions with modified mobile button sizes */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleConsultDoctorWithData}
                className="w-full py-3.5 min-h-[48px] text-xs font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(204,255,0,0.25)] cursor-pointer"
              >
                {lang === 'en' ? 'Apply for Coaching with These Macros' : 'ابدأ تدريبك مع هذه الماكروز'}
              </button>

              <button
                type="button"
                onClick={handleCopyProtocol}
                className="w-full py-3 min-h-[44px] text-xs font-bold uppercase tracking-wider text-neutral-200 border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 transition-colors cursor-pointer"
              >
                {copied
                  ? (lang === 'en' ? '✓ Copied to Clipboard!' : '✓ تم النسخ بنجاح!')
                  : (lang === 'en' ? 'Copy Protocol Summary' : 'نسخ ملخص الماكروز')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
