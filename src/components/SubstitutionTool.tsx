import React, { useMemo, useState, useRef, useEffect } from 'react';
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
  { titleEn: 'bananas', titleAr: 'موز', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 110, unit: 'gm' },
  { titleEn: 'apples', titleAr: 'تفاح', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 190, unit: 'gm' },
  { titleEn: 'pomegranate', titleAr: 'رمان', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 110, unit: 'gm' },
  { titleEn: 'oranges', titleAr: 'برتقال', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 210, unit: 'gm' },
  { titleEn: 'watermelon', titleAr: 'بطيخ', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 300, unit: 'gm' },
  { titleEn: 'strawberry', titleAr: 'فراولة', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 300, unit: 'gm' },
  { titleEn: 'kiwi', titleAr: 'كيوي', type: 'Fruits', typeAr: 'الفواكه', equalHundred: 165, unit: 'gm' },

  // ── Dairy ──
  { titleEn: 'cottage cheese', titleAr: 'جبن قريش', type: 'Dairy', typeAr: 'الألبان', equalHundred: 900, unit: 'gm' },
  { titleEn: 'greek yogurt', titleAr: 'زبادي يوناني', type: 'Dairy', typeAr: 'الألبان', equalHundred: 4, unit: 'CUP' },
];

export const CATEGORIES = [
  'Proteins',
  'High GI Carbohydrates',
  'Low GI and Snacks Carbohydrates',
  'Vegetables',
  'Fruits',
  'Dairy',
];

export function getCategoryLabel(cat: string, lang: 'en' | 'ar'): string {
  if (lang === 'en') return cat;
  const match = EXACT_MEALS.find((m) => m.type === cat);
  return match?.typeAr || cat;
}

export function getUnitLabel(unit: FoodUnit, lang: 'en' | 'ar', value: number = 1): string {
  if (lang === 'ar') {
    switch (unit) {
      case 'gm': return 'جرام';
      case 'Number': return value === 1 ? 'قطعة' : 'قطع';
      case 'Scoops': return value === 1 ? 'سكوب' : 'سكوبات';
      case 'slices': return value === 1 ? 'شريحة' : 'شرائح';
      case 'CUP': return value === 1 ? 'كوب' : 'أكواب';
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

// ─── Searchable Combobox Component (Clean, No Emojis) ─────────────────────────
interface FoodSearchDropdownProps {
  lang: Language;
  selectedMeal: SubFood | null;
  onSelect: (meal: SubFood) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

function FoodSearchDropdown({
  lang,
  selectedMeal,
  onSelect,
  activeCategory,
  onSelectCategory,
}: FoodSearchDropdownProps) {
  const en = lang === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredFoods = useMemo(() => {
    return EXACT_MEALS.filter((food) => {
      const matchesCategory = activeCategory === 'All' || food.type === activeCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        food.titleEn.toLowerCase().includes(q) ||
        food.titleAr.toLowerCase().includes(q) ||
        food.type.toLowerCase().includes(q) ||
        food.typeAr.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full min-h-[52px] px-4 py-2.5 bg-neutral-900 border text-start transition-all cursor-pointer flex items-center justify-between gap-3',
          isOpen
            ? 'border-[#8cffdb] ring-2 ring-[#8cffdb]/20 bg-[#0f1411]'
            : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <svg className="w-4 h-4 text-[#8cffdb] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div className="min-w-0">
            {selectedMeal ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-bold text-white capitalize">
                  {en ? selectedMeal.titleEn : selectedMeal.titleAr}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  ({en ? selectedMeal.titleAr : selectedMeal.titleEn})
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#8cffdb]/15 text-[#8cffdb] border border-[#8cffdb]/30">
                  {en ? selectedMeal.type : selectedMeal.typeAr}
                </span>
              </div>
            ) : (
              <span className="text-sm text-neutral-400">
                {en ? 'Select or search a food...' : 'اختر أو ابحث عن نوع الطعام...'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectedMeal && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null as any);
              }}
              className="text-neutral-500 hover:text-neutral-200 text-xs p-1"
              title={en ? 'Clear selection' : 'مسح الاختيار'}
            >
              ✕
            </span>
          )}
          <svg
            className={cn('w-4 h-4 text-neutral-400 transition-transform duration-200', isOpen && 'rotate-180 text-[#8cffdb]')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          data-lenis-prevent
          className="absolute z-50 inset-x-0 top-full mt-2 bg-[#0d120f] border border-[#8cffdb]/40 shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ maxHeight: '420px' }}
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-neutral-800 bg-[#090c0a] sticky top-0 z-10 space-y-2.5">
            <div className="relative flex items-center">
              <svg className="absolute start-3 w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={en ? 'Type to search (e.g. chicken, rice, شوفان)...' : 'ابحث بالاسم (مثال: دجاج، أرز، شوفان)...'}
                className="w-full h-10 ps-9 pe-8 bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8cffdb]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2.5 text-neutral-400 hover:text-white text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Quick Chips inside Dropdown */}
            <div
              data-lenis-prevent
              className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-[11px]"
            >
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className={cn(
                  'px-2.5 py-1 font-bold whitespace-nowrap transition-colors cursor-pointer border',
                  activeCategory === 'All'
                    ? 'bg-[#8cffdb] text-black border-[#8cffdb]'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                )}
              >
                {en ? 'All' : 'الكل'}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={cn(
                    'px-2.5 py-1 font-bold whitespace-nowrap transition-colors cursor-pointer border',
                    activeCategory === cat
                      ? 'bg-[#8cffdb] text-black border-[#8cffdb]'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  )}
                >
                  {getCategoryLabel(cat, lang as 'en' | 'ar')}
                </button>
              ))}
            </div>
          </div>

          {/* Foods List with data-lenis-prevent */}
          <div
            data-lenis-prevent
            className="overflow-y-auto max-h-64 divide-y divide-neutral-800/60 p-1"
          >
            {filteredFoods.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400">
                {en ? 'No matching foods found.' : 'لم يتم العثور على أطعمة مطابقة.'}
              </div>
            ) : (
              filteredFoods.map((food) => {
                const isSelected = selectedMeal?.titleEn === food.titleEn;
                return (
                  <button
                    key={food.titleEn}
                    type="button"
                    onClick={() => {
                      onSelect(food);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full px-3.5 py-2.5 flex items-center justify-between text-start transition-colors cursor-pointer group',
                      isSelected
                        ? 'bg-[#8cffdb]/15 text-[#8cffdb]'
                        : 'hover:bg-neutral-800/70 text-neutral-200'
                    )}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold capitalize text-white group-hover:text-[#8cffdb] transition-colors truncate">
                        {en ? food.titleEn : food.titleAr}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {en ? food.titleAr : food.titleEn}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ms-2">
                      <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 bg-neutral-900 border border-neutral-800">
                        {getCategoryLabel(food.type, lang as 'en' | 'ar')}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-[#8cffdb] font-bold">✓</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Substitution Tool Component ────────────────────────────────────────
interface SubstitutionToolProps {
  lang: Language;
}

export const SubstitutionTool: React.FC<SubstitutionToolProps> = ({ lang }) => {
  const en = lang === 'en';

  const [selectedMeal, setSelectedMeal] = useState<SubFood | null>(EXACT_MEALS[0]);
  const [inputValue, setInputValue] = useState<string>('150');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);

  // Exact formula from drahmedassem.com/Asem/Substitutions:
  // effectiveEnergy = ((enteredValue * 100) / filteredMeal.equalHundred);
  // subs.value = Math.floor(effectiveEnergy * e.equalHundred / 100);
  const results = useMemo(() => {
    if (!selectedMeal || !inputValue) return null;
    const entered = parseFloat(inputValue);
    if (isNaN(entered) || entered <= 0) return null;

    const effectiveEnergy = (entered * 100) / selectedMeal.equalHundred;
    const sameTypeMeals = EXACT_MEALS.filter(
      (m) => m.type === selectedMeal.type && m.titleEn !== selectedMeal.titleEn
    );

    return sameTypeMeals.map((m) => {
      const rawVal = (effectiveEnergy * m.equalHundred) / 100;
      const formatted = m.equalHundred < 10
        ? Math.round(rawVal * 10) / 10
        : Math.floor(rawVal);
      return {
        meal: m,
        value: formatted,
      };
    });
  }, [selectedMeal, inputValue]);

  // Adjust amount stepper
  const handleStepAmount = (delta: number) => {
    const cur = parseFloat(inputValue) || 0;
    const step = selectedMeal && selectedMeal.equalHundred < 10 ? 1 : 25;
    const nextVal = Math.max(step, cur + delta * step);
    setInputValue(String(nextVal));
  };

  // Quick preset pills
  const quickPills = useMemo(() => {
    if (!selectedMeal) return [50, 100, 150, 200, 250, 300];
    if (selectedMeal.equalHundred < 10) {
      return [1, 2, 3, 4, 6];
    }
    return [50, 100, 150, 200, 250, 300];
  }, [selectedMeal]);

  // Copy results summary
  const handleCopySummary = () => {
    if (!results || !selectedMeal) return;
    const lines = [
      `*Dr. Ahmed Assem - Food Substitutions*`,
      `Base: ${inputValue} ${getUnitLabel(selectedMeal.unit, lang as 'en' | 'ar', parseFloat(inputValue))} of ${en ? selectedMeal.titleEn : selectedMeal.titleAr}`,
      `Substitutes:`,
      ...results.map((r) => `- ${r.value} ${getUnitLabel(r.meal.unit, lang as 'en' | 'ar', r.value)} ${en ? r.meal.titleEn : r.meal.titleAr}`),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Preset example click
  const handleApplyPreset = (titleEn: string, amt: string) => {
    const found = EXACT_MEALS.find((m) => m.titleEn === titleEn);
    if (found) {
      setSelectedMeal(found);
      setInputValue(amt);
    }
  };

  return (
    <div className="w-full">
      {/* Clean Quick Examples Bar (No Emojis) */}
      <div className="mb-6">
        <span className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
          {en ? 'Quick Examples' : 'أمثلة سريعة للتجربة'}:
        </span>
        <div
          data-lenis-prevent
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin text-xs"
        >
          {[
            { label: '150g Chicken Breasts', title: 'chicken breasts', amt: '150' },
            { label: '100g Basmati Rice', title: 'basmati rice', amt: '100' },
            { label: '60g Oats', title: 'oats', amt: '60' },
            { label: '200g Sweet Potatoes', title: 'sweet potatoes', amt: '200' },
            { label: '150g Apples', title: 'apples', amt: '150' },
            { label: '4 Whole Eggs', title: 'whole eggs', amt: '4' },
            { label: '200g Cottage Cheese', title: 'cottage cheese', amt: '200' },
          ].map((ex) => (
            <button
              key={ex.title}
              type="button"
              onClick={() => handleApplyPreset(ex.title, ex.amt)}
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#8cffdb] hover:text-[#8cffdb] text-neutral-300 font-medium whitespace-nowrap transition-colors cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Control Box */}
      <div className="bg-[#121614] border border-neutral-800 p-6 sm:p-8 relative shadow-2xl">
        <div className="pointer-events-none absolute -top-24 -end-24 w-80 h-80 bg-[#8cffdb]/5 rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Food Selector Dropdown with Search */}
          <div className="lg:col-span-7 space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
              {en ? '1. Select or Search Food' : '١. اختر أو ابحث عن طعام'}
            </label>
            <FoodSearchDropdown
              lang={lang}
              selectedMeal={selectedMeal}
              onSelect={(m) => setSelectedMeal(m)}
              activeCategory={activeCategory}
              onSelectCategory={(c) => setActiveCategory(c)}
            />
          </div>

          {/* Right: Quantity Input with Steppers and Quick Pills */}
          <div className="lg:col-span-5 space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
              {en ? '2. Amount / Weight' : '٢. الكمية أو الوزن'}
            </label>

            <div className="flex items-center gap-2">
              {/* Stepper Down */}
              <button
                type="button"
                onClick={() => handleStepAmount(-1)}
                className="w-12 h-[52px] bg-neutral-900 border border-neutral-700 hover:border-[#8cffdb] text-neutral-200 hover:text-[#8cffdb] text-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
                title={en ? 'Decrease amount' : 'تقليل'}
              >
                −
              </button>

              {/* Number Input */}
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  max="9999"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={en ? 'e.g. 150' : 'مثال: ١٥٠'}
                  className="w-full h-[52px] bg-neutral-900 border border-neutral-700 px-4 pe-20 text-base font-mono font-bold text-white placeholder-neutral-500 focus:outline-none focus:border-[#8cffdb]"
                />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#8cffdb] px-2 py-1 bg-neutral-800 border border-neutral-700">
                  {selectedMeal ? getUnitLabel(selectedMeal.unit, lang as 'en' | 'ar', parseFloat(inputValue) || 1) : (en ? 'gm' : 'جرام')}
                </span>
              </div>

              {/* Stepper Up */}
              <button
                type="button"
                onClick={() => handleStepAmount(1)}
                className="w-12 h-[52px] bg-neutral-900 border border-neutral-700 hover:border-[#8cffdb] text-neutral-200 hover:text-[#8cffdb] text-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
                title={en ? 'Increase amount' : 'زيادة'}
              >
                +
              </button>
            </div>

            {/* Quick Amount Pills */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-thin">
              <span className="text-[10px] font-mono text-neutral-500 uppercase me-1 shrink-0">
                {en ? 'Quick' : 'سريع'}:
              </span>
              {quickPills.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInputValue(String(val))}
                  className={cn(
                    'px-2.5 py-0.5 text-[11px] font-mono border transition-colors cursor-pointer shrink-0',
                    inputValue === String(val)
                      ? 'bg-[#8cffdb] text-black border-[#8cffdb] font-bold'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600'
                  )}
                >
                  {val}{selectedMeal ? getUnitLabel(selectedMeal.unit, lang as 'en' | 'ar', val) : (en ? 'g' : 'جم')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Showcase */}
        {selectedMeal && results && results.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-800">
            {/* Header with Title and Copy / Share Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#8cffdb]">
                  {en ? 'MATCHING SUBSTITUTES' : 'البدائل المعادلة في نفس المجموعة'}
                </div>
                <h3 className={cn('text-xl sm:text-2xl font-black text-white mt-1', en ? 'font-sport' : 'font-cairo')}>
                  {en ? 'Equivalent to' : 'يعادل'}{' '}
                  <span className="text-[#8cffdb]">
                    {inputValue} {getUnitLabel(selectedMeal.unit, lang as 'en' | 'ar', parseFloat(inputValue) || 1)} {en ? selectedMeal.titleEn : selectedMeal.titleAr}
                  </span>
                </h3>
              </div>

              {/* Action Buttons with Clean SVG Icons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3.5 py-2 bg-neutral-900 border border-neutral-700 hover:border-[#8cffdb] hover:text-[#8cffdb] text-neutral-300 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>{copied ? (en ? 'Copied!' : 'تم النسخ!') : (en ? 'Copy List' : 'نسخ القائمة')}</span>
                </button>

                <a
                  href={`https://wa.me/201099999999?text=${encodeURIComponent(
                    `Hello Dr. Ahmed Assem! Here is my food substitution check:\n` +
                    `Base: ${inputValue} ${getUnitLabel(selectedMeal.unit, 'en', parseFloat(inputValue))} ${selectedMeal.titleEn}\n` +
                    `Top substitutes: ` +
                    results.slice(0, 3).map((r) => `${r.value} ${r.meal.unit} ${r.meal.titleEn}`).join(', ')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-neutral-900 border border-neutral-700 hover:border-[#25D366] hover:text-[#25D366] text-neutral-300 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.863L.054 23.5l5.824-1.455A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.376l-.36-.213-3.728.931.977-3.592-.234-.369A9.818 9.818 0 012.182 12C2.182 6.568 6.568 2.182 12 2.182S21.818 6.568 21.818 12 17.432 21.818 12 21.818z"/>
                  </svg>
                  <span>{en ? 'WhatsApp Coach' : 'استشر الكوتش'}</span>
                </a>
              </div>
            </div>

            {/* Substitutions Grid Cards with data-lenis-prevent */}
            <div
              data-lenis-prevent
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[500px] overflow-y-auto p-1 scrollbar-thin"
            >
              {results.map(({ meal, value }) => (
                <div
                  key={meal.titleEn}
                  className="p-4 bg-gradient-to-br from-neutral-900/90 to-[#0e1310] border border-neutral-800 hover:border-[#8cffdb]/60 transition-all flex items-center justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white group-hover:text-[#8cffdb] transition-colors truncate capitalize">
                      {en ? meal.titleEn : meal.titleAr}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-1">
                      {en ? meal.titleAr : meal.titleEn}
                    </div>
                  </div>

                  <div className="text-end shrink-0 font-mono">
                    <div className="text-xl font-black text-[#8cffdb] tabular-nums tracking-tight">
                      {value}
                      <span className="text-xs ms-1 text-neutral-400 font-normal">
                        {getUnitLabel(meal.unit, lang as 'en' | 'ar', value)}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      {meal.equalHundred} {getUnitLabel(meal.unit, lang as 'en' | 'ar', meal.equalHundred)} standard
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note & Weighed Rules */}
            <div className="mt-6 p-4 bg-neutral-950/80 border border-neutral-800/80 text-xs text-neutral-400 leading-relaxed">
              <span className="text-[#8cffdb] font-bold me-2 font-mono">[PROTOCOL]</span>
              <span>
                {en
                  ? 'All food weights are cooked weights, except oats and cream of rice which are weighed raw/dry. Fresh fruits and ready-to-eat foods are weighed as eaten.'
                  : 'كل أوزان الأطعمة مطهية وجاهزة للأكل، ما عدا الشوفان وكريمة الأرز توزن جافة (خام). الفواكه الطازجة توزن كما تؤكل.'}
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
              className="px-3 py-1.5 text-xs font-bold border border-neutral-700 bg-neutral-900/80 hover:border-[#8cffdb] hover:text-[#8cffdb] text-neutral-200 transition-colors cursor-pointer"
            >
              {en ? 'العربية' : 'English'}
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
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
              ? 'Select or search any food in your diet plan to get instant equivalent portions calculated from Dr. Ahmed Assem’s clinical nutrition protocol.'
              : 'اختر أو ابحث عن أي طعام في نظامك الغذائي للحصول فوراً على بدائل دقيقة محسوبة من بروتوكول التغذية الرياضية لدكتور أحمد عاصم.'}
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
