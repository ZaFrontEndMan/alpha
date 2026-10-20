import { Language } from '../translations';

/**
 * Dr. Ahmed Assem's substitution list.
 *
 * Each entry is a reference amount that yields a fixed amount of one macro, so any two foods in
 * the same group swap one-for-one. `per` says what the reference amount buys:
 *   'protein' | 'carbs' | 'fat' → `grams` of that food = 100 g of that macro
 *   'calories'                  → `grams` of that food = 100 kcal
 *
 * `also` carries the side macros worth knowing about (per the same reference amount).
 */
export type MacroBasis = 'protein' | 'carbs' | 'fat' | 'calories';

export interface FoodItem {
  en: string;
  ar: string;
  /** Reference amount in grams (or ml where noted in the name). */
  grams: number;
  /** Extra note shown under the name, e.g. "~4 scoops". */
  noteEn?: string;
  noteAr?: string;
  /** Side macros that come with the reference amount. */
  also?: { protein?: number; carbs?: number; fat?: number };
}

export interface FoodGroup {
  id: string;
  en: string;
  ar: string;
  basis: MacroBasis;
  items: FoodItem[];
}

export const FOOD_GROUPS: FoodGroup[] = [
  {
    id: 'proteins',
    en: 'Proteins',
    ar: 'البروتينات',
    basis: 'protein',
    items: [
      { en: 'Chicken breast', ar: 'صدور دجاج', grams: 320 },
      { en: 'Turkey breast', ar: 'صدور تركي', grams: 335 },
      { en: 'Beef steak', ar: 'ستيك لحم بقري', grams: 380, also: { fat: 65 } },
      { en: 'Beef liver', ar: 'كبد بقري', grams: 345 },
      { en: 'White fish (cod)', ar: 'سمك أبيض (كود)', grams: 440 },
      { en: 'Canned tuna in water', ar: 'تونة معلبة في ماء', grams: 390, noteEn: 'drained', noteAr: 'مصفاة' },
      { en: 'Shrimp', ar: 'جمبري', grams: 420 },
      { en: 'Salmon', ar: 'سلمون', grams: 490, also: { fat: 65 } },
      { en: 'Whey protein isolate', ar: 'واي بروتين أيزوليت', grams: 116, noteEn: '~4 scoops', noteAr: '~٤ سكوب' },
      { en: 'Egg whites', ar: 'بياض بيض', grams: 28, noteEn: '28 whites, not grams', noteAr: '٢٨ بياضة، وليست جرامات' },
      { en: 'Whole boiled eggs', ar: 'بيض مسلوق كامل', grams: 16, noteEn: '16 eggs, not grams', noteAr: '١٦ بيضة، وليست جرامات', also: { fat: 85 } },
    ],
  },
  {
    id: 'carbs_high_gi',
    en: 'High GI carbs',
    ar: 'كربوهيدرات عالية المؤشر',
    basis: 'carbs',
    items: [
      { en: 'Basmati rice', ar: 'أرز بسمتي', grams: 355 },
      { en: 'White rice', ar: 'أرز أبيض', grams: 355 },
      { en: 'Cream of rice', ar: 'كريمة الأرز', grams: 125, noteEn: 'raw / dry weight', noteAr: 'وزن خام' },
      { en: 'Potatoes', ar: 'بطاطس', grams: 475 },
      { en: 'Sweet potatoes', ar: 'بطاطا حلوة', grams: 485 },
      { en: 'White toast', ar: 'توست أبيض', grams: 7, noteEn: '7 slices (~28 g each)', noteAr: '٧ شرائح (~٢٨ جم للشريحة)' },
      { en: 'Corn flakes', ar: 'كورن فليكس', grams: 120 },
      { en: 'Rice cakes', ar: 'كيك الأرز', grams: 125, noteEn: '~14 cakes', noteAr: '~١٤ قرصاً' },
      { en: 'Honey', ar: 'عسل', grams: 120 },
    ],
  },
  {
    id: 'carbs_low_gi',
    en: 'Low GI carbs & snacks',
    ar: 'كربوهيدرات منخفضة المؤشر وسناكس',
    basis: 'carbs',
    items: [
      { en: 'Oats', ar: 'شوفان', grams: 150, noteEn: 'raw / dry weight', noteAr: 'وزن خام' },
      { en: 'Pasta', ar: 'مكرونة', grams: 325 },
      { en: 'Corn tortillas', ar: 'تورتيلا ذرة', grams: 225, noteEn: '~9 tortillas', noteAr: '~٩ أرغفة' },
      { en: 'Granola', ar: 'جرانولا', grams: 155, also: { fat: 30 } },
      { en: 'Medjool dates', ar: 'تمر مجدول', grams: 135, noteEn: 'pitted', noteAr: 'منزوع النوى' },
    ],
  },
  {
    id: 'fats',
    en: 'Healthy fats',
    ar: 'الدهون الصحية',
    basis: 'fat',
    items: [
      { en: 'Extra virgin olive oil', ar: 'زيت زيتون بكر ممتاز', grams: 100, noteEn: '~110 ml', noteAr: '~١١٠ مل' },
      { en: 'Avocado', ar: 'أفوكادو', grams: 680 },
      { en: 'Almonds', ar: 'لوز', grams: 200, also: { protein: 42 } },
      { en: 'Walnuts', ar: 'عين جمل', grams: 155 },
      { en: 'Cashews', ar: 'كاجو', grams: 230, also: { carbs: 70 } },
      { en: 'Macadamia nuts', ar: 'مكاداميا', grams: 130 },
      { en: 'Peanut butter', ar: 'زبدة فول سوداني', grams: 200, noteEn: 'no added sugar', noteAr: 'بدون سكر مضاف', also: { protein: 50 } },
      { en: 'Pumpkin seeds', ar: 'بذور اليقطين', grams: 205, also: { protein: 60 } },
      { en: 'Flax seeds', ar: 'بذور الكتان', grams: 235 },
      { en: 'Chia seeds', ar: 'بذور الشيا', grams: 325, noteEn: 'carbs mostly fiber', noteAr: 'الكربوهيدرات غالبها ألياف', also: { carbs: 135 } },
      { en: 'Dark chocolate 70–85%', ar: 'شوكولاتة داكنة ٧٠-٨٥٪', grams: 235, also: { carbs: 110 } },
      { en: 'Dark chocolate 90%', ar: 'شوكولاتة داكنة ٩٠٪', grams: 205, also: { carbs: 70 } },
      { en: 'Wheat germ', ar: 'جنين القمح', grams: 1030, also: { protein: 240, carbs: 530 } },
    ],
  },
  {
    id: 'dairy',
    en: 'Dairy',
    ar: 'الألبان',
    basis: 'protein',
    items: [
      { en: 'Cottage cheese', ar: 'جبن قريش', grams: 900, noteEn: 'low fat', noteAr: 'قليل الدسم' },
      { en: 'Greek yogurt 0%', ar: 'زبادي يوناني ٠٪', grams: 980 },
      { en: 'Whole milk', ar: 'لبن كامل الدسم', grams: 3170, noteEn: 'millilitres', noteAr: 'مليلتر', also: { carbs: 150, fat: 105 } },
    ],
  },
  {
    id: 'vegetables',
    en: 'Vegetables',
    ar: 'الخضروات',
    basis: 'calories',
    items: [
      { en: 'Green peas', ar: 'بازلاء خضراء', grams: 120 },
      { en: 'Zucchini', ar: 'كوسة', grams: 590 },
      { en: 'Green beans', ar: 'فاصوليا خضراء', grams: 285 },
      { en: 'Asparagus', ar: 'هليون', grams: 455 },
      { en: 'Mushroom', ar: 'مشروم', grams: 355 },
      { en: 'Carrot', ar: 'جزر', grams: 285 },
      { en: 'Red bell pepper', ar: 'فلفل ألوان أحمر', grams: 320, noteEn: 'raw', noteAr: 'طازج' },
      { en: 'Tomatoes', ar: 'طماطم', grams: 555, noteEn: 'raw', noteAr: 'طازجة' },
      { en: 'Cucumber', ar: 'خيار', grams: 665, noteEn: 'raw', noteAr: 'طازج' },
      { en: 'Lettuce', ar: 'خس', grams: 590, noteEn: 'raw', noteAr: 'طازج' },
    ],
  },
  {
    id: 'fruits',
    en: 'Fruits',
    ar: 'الفواكه',
    basis: 'calories',
    items: [
      { en: 'Banana', ar: 'موز', grams: 110, noteEn: 'peeled', noteAr: 'مقشر' },
      { en: 'Apple', ar: 'تفاح', grams: 190 },
      { en: 'Pomegranate seeds', ar: 'حبوب رمان', grams: 120 },
      { en: 'Orange', ar: 'برتقال', grams: 210, noteEn: 'peeled', noteAr: 'مقشر' },
      { en: 'Watermelon', ar: 'بطيخ', grams: 330 },
      { en: 'Strawberry', ar: 'فراولة', grams: 310 },
      { en: 'Kiwi', ar: 'كيوي', grams: 165, noteEn: 'peeled', noteAr: 'مقشر' },
      { en: 'Cantaloupe', ar: 'كانتالوب', grams: 295 },
    ],
  },
];

/** Foods counted in pieces, not grams — the reference number is the count itself. */
const COUNTED = new Set(['Egg whites', 'Whole boiled eggs', 'White toast']);

export const isCounted = (item: FoodItem) => COUNTED.has(item.en);

export const basisLabel = (basis: MacroBasis, lang: Language) => {
  if (lang === 'ar') {
    return basis === 'calories' ? '١٠٠ سعر حراري' : basis === 'protein' ? '١٠٠ جم بروتين' : basis === 'carbs' ? '١٠٠ جم كربوهيدرات' : '١٠٠ جم دهون';
  }
  return basis === 'calories' ? '100 kcal' : basis === 'protein' ? '100 g protein' : basis === 'carbs' ? '100 g carbs' : '100 g fat';
};

export const WEIGHING_NOTE = {
  en: 'All weights are cooked weights, except oats and cream of rice (raw / dry). Ready-to-eat foods — bread, cereals, fruits, dairy, nuts, oils, whey — are weighed as eaten.',
  ar: 'كل الأوزان مطهية، ما عدا الشوفان وكريمة الأرز (وزن خام). الأطعمة الجاهزة للأكل — الخبز، الحبوب، الفواكه، الألبان، المكسرات، الزيوت، الواي — توزن كما تؤكل.',
};
