/**
 * Builds src/config/site-config.default.json from what the site ships today:
 *  - src/translations.ts (en + ar merged into { en, ar } leaves)
 *  - the bilingual strings that used to live inline in the components (`en ? '…' : '…'`)
 *  - contact details / social links / nav links / colours that were hard-coded
 *
 * Run:  npx tsx scripts/generate-default-config.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { translations } from '../src/translations.ts';

const PLAIN_KEYS = new Set(['id', 'step', 'number', 'priceNumeric', 'popular', 'currency']);

/** Merge two same-shaped trees into one where every translatable string becomes { en, ar }. */
function merge(en: any, ar: any, key = '', trail = 'root'): any {
  if (Array.isArray(en)) {
    if (!Array.isArray(ar) || en.length !== ar.length) {
      throw new Error(`Shape mismatch (array length) at ${trail}`);
    }
    return en.map((v, i) => merge(v, ar[i], '', `${trail}[${i}]`));
  }
  if (en && typeof en === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(en)) {
      if (!(k in ar)) throw new Error(`Missing key "${k}" in ar at ${trail}`);
      out[k] = merge(en[k], ar[k], k, `${trail}.${k}`);
    }
    return out;
  }
  if (typeof en === 'string' && !PLAIN_KEYS.has(key)) return { en, ar };
  return en;
}

const T: any = merge(translations.en, translations.ar);
const L = (en: string, ar: string) => ({ en, ar });

const config = {
  version: 1,
  site: {
    name: 'Dr. Ahmed Assem',
    seo: {
      title: L(
        'Dr. Ahmed Assem | Elite Fitness & Nutrition Coaching',
        'د. أحمد عاصم | تدريب لياقة وتغذية احترافي'
      ),
      description: L(
        'Official online coaching platform of Dr. Ahmed Assem. Science-based fitness, nutrition protocols, macro calculator, and IFBB Pro physique transformations.',
        'المنصة الرسمية للتدريب أونلاين مع د. أحمد عاصم. لياقة وتغذية مبنية على العلم وتحولات جسدية بإشراف بطل IFBB Pro.'
      ),
    },
    favicon: { asset: 'favicon' },
    logo: { asset: 'brand-logo', style: 'lime', alt: L('Dr. Ahmed Assem', 'د. أحمد عاصم') },
    colors: {
      primary: '#B8232F',
      primaryHover: '#9C1D28',
      accent: '#E5484D',
      background: '#1C1F24',
      surface: '#262A30',
      text: '#E9E9E4',
    },
    copyright: T.footer.rights,
  },

  contact: {
    whatsapp: '201158997825',
    email: 'info@drahmedassem.com',
    instagramHandle: '@drahmedassem_ifbbpro',
    socials: [
      { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@dr_ahmedassem', visible: true },
      { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/Dr.AhmedAssem1', visible: true },
      { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@Dr_ahmedassem/featured', visible: true },
      { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/201158997825', visible: true },
      { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/dr_ahmedassem/', visible: true },
    ],
  },

  navbar: {
    // same order as Navbar.tsx NAV_LINKS
    links: [
      { key: 'home', href: '#', visible: true, label: T.nav.home },
      { key: 'transformations', href: '#transformations', visible: true, label: T.nav.transformations },
      { key: 'packages', href: '#packages', visible: true, label: T.nav.packages },
      { key: 'reviews', href: '#reviews', visible: true, label: T.nav.reviews },
      { key: 'workouts', href: '#workouts', visible: true, label: T.nav.workouts },
      { key: 'calculator', href: '/substitutions', visible: true, label: T.nav.calculator },
      { key: 'features', href: '#features', visible: true, label: T.nav.features },
      { key: 'comparison', href: '#comparison', visible: true, label: T.nav.comparison },
      { key: 'faqs', href: '#faqs', visible: true, label: T.nav.faqs },
    ],
    langToggle: T.nav.langToggle,
  },

  // The "START NOW" button appears in ~10 places; hiding it here hides it everywhere.
  ctas: {
    start: { visible: true, label: T.hero.ctaStart, href: '#packages' },
    packages: { visible: true, label: T.hero.ctaPackages, href: '#packages' },
    footerWhatsapp: { visible: true, label: L('Direct Line to Dr. Assem', 'مكتب الدكتور المباشر'), href: 'https://wa.me/201158997825' },
  },

  // Order of the landing page, exactly as App.tsx renders it today.
  sections: [
    { id: 'home', type: 'hero', visible: true, contentKey: 'hero' },
    { id: 'transformations', type: 'transformations', visible: true, contentKey: 'transformations' },
    { id: 'packages', type: 'packages', visible: true, contentKey: 'packages' },
    { id: 'reviews', type: 'testimonials', visible: true, contentKey: 'testimonials' },
    { id: 'workouts', type: 'workouts', visible: true, contentKey: 'workouts' },
    { id: 'substitutions', type: 'substitutions', visible: true, contentKey: 'substitutions' },
    { id: 'banner', type: 'banner', visible: true, contentKey: 'banner' },
    { id: 'why', type: 'whyChoose', visible: true, contentKey: 'whyChoose' },
    { id: 'coach', type: 'coach', visible: true, contentKey: 'coach' },
    { id: 'features', type: 'features', visible: true, contentKey: 'features' },
    { id: 'comparison', type: 'comparison', visible: true, contentKey: 'comparison' },
    { id: 'how', type: 'howItWorks', visible: true, contentKey: 'howItWorks' },
    { id: 'faqs', type: 'faqs', visible: true, contentKey: 'faqs' },
  ],

  content: {
    hero: {
      image: { asset: 'person_1' },
      headline: T.hero.headline,
      // phrase inside the headline that gets the highlight sweep (per language)
      headlineAccent: L('12 weeks', '12 أسبوعاً'),
      subheadline: T.hero.subheadline,
      badge: L('IFBB PRO ATHLETE & COACH', 'بطل محترف IFBB Pro ومدرب'),
      doctorLabel: T.stats.doctorLabel,
      stats: {
        transformations: { value: T.stats.transformationsCount, label: T.stats.transformationsLabel },
        weeks: { value: T.stats.weeksChange, label: T.stats.weeksLabel },
        experience: { value: T.stats.experienceYears, label: T.stats.experienceLabel },
      },
    },

    transformations: {
      backgroundImage: { asset: 'person_3' },
      // Photos come from the Cloudinary folder (api/transformations); this is just the folder name.
      cloudinaryFolder: 'assem',
      badge: L('Transformation', 'التحول'),
      // {accent} = the highlighted part
      headlineBefore: L('Trusted by ', 'وثق بنا '),
      headlineAccent: L('500+ clients', 'أكثر من 500 متدرب'),
      headlineAfter: L(' who changed their physique', ' غيّروا شكل أجسامهم'),
      subheading: L(
        'Every photo here is a real client, coached end-to-end by Dr. Ahmed Assem.',
        'كل صورة هنا لمتدرب حقيقي، تابعه د. أحمد عاصم خطوة بخطوة من البداية للنهاية.'
      ),
      galleryAlt: L('Client transformations', 'تحولات المتدربين'),
    },

    packages: {
      tag: T.packages.tag,
      heading: T.packages.heading,
      currency: T.packages.currency,
      // Prices in EGP; other currencies are derived from these rates (EGP per 1 unit inverted).
      exchangeRates: { EGP: 1, USD: 1 / 49.5, AED: 3.67 / 49.5, SAR: 3.75 / 49.5 },
      items: T.packages.items.map((p: any) => ({ ...p, visible: true })),
    },

    testimonials: {
      title: T.testimonials.title,
      heading: T.testimonials.heading,
      subheading: T.testimonials.subheading,
      // photo = file in assets/transformation (16.jpg, 17.jpg, 18.jpg), same mapping as Testimonials.tsx
      reviews: T.testimonials.reviews.map((r: any, i: number) => ({
        ...r,
        visible: true,
        photo: { asset: `transformation/${[16, 17, 18][i % 3]}` },
      })),
      footerNote: L(
        'Over 500+ real client transformations logged. Join Dr. Ahmed Assem today.',
        'أكثر من 500 تحول حقيقي موثق بالنتائج. انضم إلى د. أحمد عاصم اليوم.'
      ),
    },

    workouts: {
      image: { asset: 'person_2', alt: L('Training session', 'جلسة تدريب') },
      badge: L('TRAINING', 'التدريب'),
      cards: [
        {
          titleLead: L('HOME OR GYM', 'في البيت أو الجيم'),
          title: L('WORKOUTS', 'تمارين'),
          body: L(
            'Workout wherever is most convenient for you with home or gym workout options!',
            'تدرب في المكان الأنسب لك — خيارات تمارين للبيت أو للجيم!'
          ),
        },
        {
          titleLead: L('Personalised', 'برنامج تدريبي'),
          title: L('WORKOUT PROGRAM', 'مخصص لك'),
          body: L(
            'Workout program just for you! I will customise your own ongoing training program. All exercises have been filmed to demonstrate how to perform them correctly.',
            'برنامج تدريبي لك وحدك! سأصمم لك برنامجاً مستمراً يناسبك، وكل تمرين مصوّر بالفيديو ليوضح الأداء الصحيح.'
          ),
        },
      ],
    },

    // The food-substitution block on the landing page. The tool + /substitutions page stay in code.
    substitutions: {
      tag: L('NUTRITION PROTOCOL', 'بروتوكول التغذية الرياضية'),
      heading: L('Exact Food Substitution System', 'نظام بدائل الأطعمة الدقيق'),
      subheading: L(
        'Swap any food with equal macro equivalents calculated from Dr. Ahmed Assem’s nutrition database.',
        'استبدل أي طعام ببديله الدقيق من قاعدة بيانات د. أحمد عاصم للتغذية الرياضية.'
      ),
      openButton: L('Open Fullscreen Tool ↗', 'فتح الأداة بالكامل ↗'),
    },

    banner: {
      image: { asset: 'coach-header' },
      title: T.banner.title,
      headline: L(
        'Build Your Best Shape With The Right System, Team, And Guidance',
        'ابنِ أفضل نسخة من جسمك مع النظام الصحيح، الفريق المناسب، والتوجيه الصحيح'
      ),
      quote: T.banner.quote,
      pills: T.banner.pills,
      cta: T.banner.cta,
    },

    whyChoose: {
      image: { asset: 'coach-medal', alt: L('Dr. Ahmed Assem holding his IFBB Federation medal', 'د. أحمد عاصم بميدالية الاتحاد الدولي IFBB') },
      tag: T.whyChoose.tag,
      heading: T.whyChoose.heading,
      subheading: T.whyChoose.subheading,
      pillarFooter: { label: L('SCIENCE-BACKED SYSTEM', 'نظام مبني على العلم'), value: L('100% EVIDENCE-BASED', '100% EVIDENCE-BASED') },
      pillars: T.whyChoose.pillars,
      spotlight: {
        value: L('500+', '500+'),
        title: L('Proven Track Record', 'سجل حافل بالنتائج الحقيقية'),
        text: L(
          'Fat loss, muscle building, and full body recomposition with clients across Egypt, UAE, UK, and worldwide.',
          'خسارة دهون، بناء عضلات، وإعادة تشكيل كامل للجسم مع متدربين في مصر والخليج وأوروبا.'
        ),
      },
    },

    coach: {
      image: { asset: 'person_4', alt: L('Dr. Ahmed Assem, IFBB Pro physique athlete', 'د. أحمد عاصم، بطل فيزيك IFBB برو') },
      tag: L('THE MAN BEHIND THE SYSTEM', 'الرجل وراء النظام'),
      heading: L('IFBB Pro Physique Athlete, Your Coach', 'بطل IFBB برو محترف ومدربك الشخصي'),
      text: L(
        'Dr. Ahmed Assem built his own physique the same way he builds yours — with precise tracking, periodized training, and zero guesswork.',
        'د. أحمد عاصم بنى جسمه بنفس الطريقة اللي هيبني بيها جسمك — بمتابعة دقيقة، وتدريب مبرمج علمياً، وبدون أي عشوائية.'
      ),
      badge: L('RESULTS', 'نتائج'),
      stats: {
        experience: { value: T.stats.experienceYears, label: T.stats.experienceLabel },
        transformations: { value: T.stats.transformationsCount, label: T.stats.transformationsLabel },
      },
    },

    features: {
      tag: T.features.tag,
      heading: T.features.heading,
      cards: [
        { title: T.features.mealPlanTitle, description: T.features.mealPlanDesc, footerLabel: L('DIET FRAMEWORKS:', 'الأنظمة المتاحة:'), footerValue: L('Balanced · Carb Cycling · Advanced', 'Balanced · Carb Cycling · Advanced') },
        { title: T.features.workoutTitle, description: T.features.workoutDesc, footerLabel: L('VIDEO LIBRARY:', 'مكتبة الفيديوهات:'), footerValue: L('HD Form Demonstrations', 'HD Form Demonstrations') },
        { title: T.features.locationTitle, description: T.features.locationDesc, footerLabel: L('FLEXIBILITY:', 'مرونة التدريب:'), footerValue: L('Home Equipment & Full Gym', 'Home Equipment & Full Gym') },
      ],
      ctaBox: {
        eyebrow: L('DR. AHMED ASSEM EXCLUSIVE SYSTEM', 'DR. AHMED ASSEM EXCLUSIVE SYSTEM'),
        title: L('START NOW', 'ابدأ الآن'),
        text: L(
          'Join Dr. Ahmed Assem and transform your physique with 1-on-1 direct expert guidance.',
          'انضم للدكتور أحمد عاصم وحقق أفضل شكل لجسمك بإشراف محترف IFBB Pro.'
        ),
      },
    },

    comparison: {
      tag: T.comparison.tag,
      heading: T.comparison.heading,
      subheading: T.comparison.subheading,
      columns: {
        criteria: L('EVALUATION CRITERIA', 'معايير التقييم والمقارنة'),
        us: L("DR. AHMED ASSEM'S SYSTEM", 'نظام د. أحمد عاصم'),
        others: L('TRADITIONAL COACHES / GENERIC PDF', 'المدربون التقليديون / الخطط المنسوخة'),
      },
      rows: T.comparison.table,
      footerNote: L(
        'Don’t gamble your health and hard work with unproven guesswork. Work directly with an IFBB Pro athlete.',
        'لا تخاطر بصحتك ومجهودك مع خطط عشوائية غير مدروسة. انضم لبطل محترف يضمن لك النتيجة بأمان.'
      ),
    },

    howItWorks: {
      image: { asset: 'person_5' },
      tag: T.howItWorks.tag,
      heading: T.howItWorks.heading,
      stepLabel: L('STEP', 'الخطوة'),
      steps: T.howItWorks.steps,
      pills: T.howItWorks.pills,
      cta: T.howItWorks.cta,
    },

    faqs: {
      tag: L('COMMON QUESTIONS', 'كل ما تحتاج معرفته'),
      title: T.faqs.title,
      items: T.faqs.items.map((f: any) => ({ ...f, visible: true })),
    },
  },

  footer: {
    description: L(
      'Transform your whole life in 90 days with a science-based system. Hundreds of clients transformed using science — not guesswork.',
      'غيّر حياتك بالكامل في 90 يوماً بنظام مصمم علمياً. مئات المتدربين غيروا أجسامهم بنظام مثبت علمياً بدون أي عشوائية.'
    ),
    navTitle: L('Navigation', 'روابط سريعة'),
    channelsTitle: L('Direct Channels & WhatsApp', 'التواصل المباشر والواتساب'),
    channelsText: L(
      'Client intake reviews, athlete prep, and 1-on-1 consultations:',
      'استفسارات الاشتراكات، تحضير البطولات، والاستشارات الفردية:'
    ),
    platformLabel: 'Official Platform · drahmedassem.com',
    privacy: T.footer.privacy,
    terms: T.footer.terms,
    links: [
      { key: 'home', href: '#', visible: true, label: T.nav.home },
      { key: 'packages', href: '#packages', visible: true, label: T.nav.packages },
      { key: 'features', href: '#features', visible: true, label: T.nav.features },
      { key: 'transformations', href: '#transformations', visible: true, label: T.nav.transformations },
      { key: 'comparison', href: '#comparison', visible: true, label: T.nav.comparison },
      { key: 'faqs', href: '#faqs', visible: true, label: T.nav.faqs },
    ],
  },

  customSections: {},
};

const out = path.resolve(import.meta.dirname, '../src/config/site-config.default.json');
fs.writeFileSync(out, JSON.stringify(config, null, 2) + '\n');
console.log(`Wrote ${path.relative(process.cwd(), out)} (${fs.statSync(out).size} bytes)`);
