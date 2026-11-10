/** Arabic names for the config keys, and the dashboard's tab structure. */
export const LABELS: Record<string, string> = {
  site: 'بيانات الموقع', name: 'اسم الموقع', seo: 'محركات البحث (SEO)', title: 'العنوان', description: 'الوصف',
  favicon: 'أيقونة التبويب (Favicon)', logo: 'اللوجو', colors: 'ألوان الموقع', primary: 'اللون الأساسي (الأزرار)',
  primaryHover: 'اللون الأساسي عند المرور', accent: 'لون التمييز (النصوص الحمراء)', background: 'لون الخلفية',
  surface: 'لون الكروت والأسطح', text: 'لون النص', copyright: 'نص حقوق النشر',
  contact: 'بيانات التواصل', whatsapp: 'رقم واتساب الحجز (أرقام فقط مع كود الدولة)',
  paymentWhatsapp: 'رقم واتساب صفحة الدفع', email: 'الإيميل', instagramHandle: 'حساب إنستجرام (للعرض في الفوتر)',
  socials: 'روابط السوشيال ميديا', label: 'الاسم', href: 'الرابط', visible: 'ظاهر',
  navbar: 'شريط التنقل', links: 'الروابط', langToggle: 'نص زر تغيير اللغة',
  ctas: 'أزرار الدعوة', start: 'زر "ابدأ الآن" (يظهر في أماكن كتير)', packages: 'زر الباقات', footerWhatsapp: 'زر الواتساب في الفوتر',
  image: 'الصورة', backgroundImage: 'صورة الخلفية', alt: 'وصف الصورة (للقراءة الآلية)', cloudinaryId: 'معرّف Cloudinary',
  headline: 'العنوان الرئيسي', headlineAccent: 'الجزء الملوّن من العنوان', headlineBefore: 'العنوان - قبل الجزء الملوّن',
  headlineAfter: 'العنوان - بعد الجزء الملوّن', subheadline: 'العنوان الفرعي', subheading: 'العنوان الفرعي', heading: 'العنوان',
  tag: 'التاج الصغير فوق العنوان', badge: 'الشارة', badgeClients: 'كلمة "متدرب" في الشارة', doctorLabel: 'اسم الدكتور',
  stats: 'الإحصائيات', value: 'القيمة', transformations: 'التحولات', weeks: 'الأسابيع', experience: 'سنين الخبرة',
  coachedStat: 'إحصائية الإشراف الشخصي', galleryAlt: 'وصف معرض الصور',
  currency: 'العملة', currencyLabel: 'اسم العملة المعروض', exchangeRates: 'أسعار الصرف (مقابل الجنيه المصري)',
  EGP: 'جنيه مصري', USD: 'دولار', AED: 'درهم', SAR: 'ريال', labels: 'نصوص الأزرار والشارات',
  recommended: 'شارة الباقة الموصى بها', tagline: 'السطر تحت السعر', payNow: 'زر الدفع', whatsappDirect: 'زر واتساب المباشر',
  consultationTag: 'شارة كارت الاستشارة', items: 'العناصر', priceNumeric: 'السعر بالجنيه المصري (الرقم اللي بيتحاسب بيه العميل)',
  popular: 'باقة موصى بها', features: 'المميزات', note: 'ملاحظة', price: 'السعر (نص)',
  reviews: 'الآراء', role: 'الوصف الوظيفي', quote: 'نص الرأي', highlight: 'النتيجة المميزة', photo: 'صورة العميل', footerNote: 'الجملة السفلية',
  cards: 'الكروت', titleLead: 'العنوان - الجزء الأول', body: 'النص', openButton: 'نص زر فتح الأداة',
  pills: 'الكلمات المميزة', cta: 'زر الدعوة', brandName: 'اسم البراند', roleLabel: 'الوصف تحت الاسم', medal: 'الميدالية',
  brand: 'الجهة', pillarFooter: 'السطر أسفل كل ركيزة', pillars: 'الركائز', number: 'الرقم', spotlight: 'بانر الأرقام',
  footerLabel: 'عنوان السطر السفلي', footerValue: 'قيمة السطر السفلي', ctaBox: 'صندوق ابدأ الآن', eyebrow: 'السطر الصغير فوق العنوان',
  columns: 'عناوين الأعمدة', criteria: 'المعيار', us: 'نظامنا', others: 'الآخرون', rows: 'صفوف المقارنة', drAssem: 'د. أحمد عاصم',
  stepLabel: 'كلمة "الخطوة"', steps: 'الخطوات', step: 'رقم الخطوة', desc: 'الشرح', q: 'السؤال', a: 'الإجابة',
  footer: 'الفوتر', navTitle: 'عنوان قائمة الروابط', channelsTitle: 'عنوان قسم التواصل', channelsText: 'نص قسم التواصل',
  platformLabel: 'سطر المنصة الرسمية', privacy: 'سياسة الخصوصية', terms: 'الشروط والأحكام',
  en: 'English', ar: 'العربية',
};

/** Keys the editor never shows (internal wiring, or edited somewhere else). */
export const HIDDEN_KEYS = new Set([
  'version', 'contentKey', 'type', 'id', 'key', 'cloudinaryFolder', 'customSections', 'price', 'asset', 'style', 'sections',
]);

export const SECTION_NAMES: Record<string, string> = {
  hero: 'الهيرو (أول الصفحة)', transformations: 'التحولات (معرض الصور)', packages: 'الباقات', testimonials: 'آراء العملاء',
  workouts: 'التمارين', substitutions: 'بدائل الأطعمة', banner: 'البانر', whyChoose: 'ليه د. أحمد عاصم',
  coach: 'عن الدكتور', features: 'المميزات', comparison: 'المقارنة', howItWorks: 'طريقة العمل', faqs: 'الأسئلة الشائعة',
};

/** Which content key each section type edits. */
export const CONTENT_KEY: Record<string, string> = { ...Object.fromEntries(Object.keys(SECTION_NAMES).map((k) => [k, k])) };

export interface TabDef {
  id: string;
  label: string;
  /** one or more config paths rendered with the generic editor */
  paths?: { title?: string; path: (string | number)[] }[];
  /** or a hand-built screen */
  custom?: 'sections' | 'media' | 'backups';
}

export const TABS: TabDef[] = [
  { id: 'general', label: 'عام', paths: [{ title: 'بيانات الموقع والألوان', path: ['site'] }, { title: 'التواصل', path: ['contact'] }] },
  { id: 'sections', label: 'السكاشن (الترتيب والإخفاء)', custom: 'sections' },
  { id: 'nav', label: 'النافبار والأزرار', paths: [{ title: 'شريط التنقل', path: ['navbar'] }, { title: 'أزرار الدعوة', path: ['ctas'] }] },
  ...Object.entries(SECTION_NAMES).map(([k, label]) => ({ id: k, label, paths: [{ path: ['content', k] }] })),
  { id: 'footer', label: 'الفوتر', paths: [{ path: ['footer'] }] },
  { id: 'media', label: 'مكتبة الصور', custom: 'media' as const },
  { id: 'backups', label: 'النسخ الاحتياطية', custom: 'backups' as const },
];

export const humanize = (k: string) => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
