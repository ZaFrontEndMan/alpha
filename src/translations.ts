export type Language = 'en' | 'ar';

export interface TranslationContent {
  nav: {
    home: string;
    packages: string;
    features: string;
    transformations: string;
    workouts: string;
    comparison: string;
    faqs: string;
    calculator: string;
    langToggle: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaStart: string;
    ctaPackages: string;
  };
  stats: {
    transformationsCount: string;
    transformationsLabel: string;
    weeksChange: string;
    weeksLabel: string;
    doctorLabel: string;
    experienceYears: string;
    experienceLabel: string;
  };
  testimonials: {
    title: string;
    heading: string;
    subheading: string;
    reviews: Array<{
      name: string;
      role: string;
      quote: string;
      highlight: string;
      stats: string;
    }>;
  };
  whyChoose: {
    tag: string;
    heading: string;
    subheading: string;
    pillars: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  features: {
    tag: string;
    heading: string;
    mealPlanTitle: string;
    mealPlanDesc: string;
    workoutTitle: string;
    workoutDesc: string;
    locationTitle: string;
    locationDesc: string;
  };
  comparison: {
    tag: string;
    heading: string;
    subheading: string;
    table: Array<{
      criteria: string;
      drAssem: string;
      others: string;
    }>;
  };
  packages: {
    tag: string;
    heading: string;
    currency: string;
    items: Array<{
      id: string;
      name: string;
      price: string;
      priceNumeric: number;
      description: string;
      popular?: boolean;
      features: string[];
      note?: string;
    }>;
  };
  howItWorks: {
    tag: string;
    heading: string;
    steps: Array<{
      step: string;
      title: string;
      desc: string;
    }>;
  };
  banner: {
    title: string;
    quote: string;
    pills: string[];
    cta: string;
  };
  faqs: {
    title: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
  };
}

export const translations: Record<Language, TranslationContent> = {
  en: {
    nav: {
      home: 'Home',
      packages: 'Packages',
      features: 'Features',
      transformations: 'Transformation',
      workouts: 'Workouts',
      comparison: 'System Comparison',
      faqs: 'FAQs',
      calculator: 'Macro Calculator',
      langToggle: 'العربية',
    },
    hero: {
      headline: 'Transform your whole life in 12 weeks with a medically designed system',
      subheadline: 'Hundreds of clients transformed their bodies using a proven system — not guesswork',
      ctaStart: 'START NOW',
      ctaPackages: 'VIEW PACKAGES',
    },
    stats: {
      transformationsCount: '500+',
      transformationsLabel: 'Real Transformations',
      weeksChange: '12',
      weeksLabel: 'Weeks To Change',
      doctorLabel: 'Dr Ahmed Assem, M.D.',
      experienceYears: '14+',
      experienceLabel: 'IFBB Pro & Clinical Experience',
    },
    testimonials: {
      title: 'TESTIMONIALS',
      heading: 'Real Feedback From Clients Who Followed The System',
      subheading: 'A premium front-end testimonial section designed to make trust visible at a glance.',
      reviews: [
        {
          name: 'Zeyad elnamory',
          role: 'Fat Loss Client',
          quote:
            'Before starting, I tried everything and always failed to stay consistent. The difference here was the system — everything was clear, structured, and adjusted weekly. I never felt lost. I dropped from 152 kg to 100 kg, and for the first time I can actually maintain my results.',
          highlight: '152 kg → 100 kg (-52 kg Fat Loss)',
          stats: '-52 KG',
        },
        {
          name: 'Ahmed elsissy',
          role: 'Body Recomp Client',
          quote:
            'I built muscle and lost fat at the same time — something I never thought was possible. I wasn’t overweight, but I had no shape. With this coaching, everything changed — training, nutrition, mindset. I look completely different now, and people actually notice.',
          highlight: 'Lean Mass Gain & Abdominal Definition',
          stats: '+4.5 KG MUSCLE',
        },
        {
          name: 'Mohamed nizar',
          role: 'Muscle Gain Client',
          quote:
            'Consistency was my biggest problem… until this system. I used to start and quit every time. The weekly follow-ups and adjustments made it impossible to fall off. This wasn’t just a plan — it was my saver.',
          highlight: '100% Habit & Gym Adherence',
          stats: 'UNBROKEN STREAK',
        },
      ],
    },
    whyChoose: {
      tag: 'WHY CHOOSE',
      heading: 'Why Choose Dr. Ahmed Assem?',
      subheading: 'Not Just Ordinary Coaching — A Complete System Built with Science & Experience',
      pillars: [
        {
          number: '01',
          title: 'Medically Guided Approach',
          description:
            'As a doctor, every plan is built with a deep understanding of Hormones, Metabolism, Recovery, and Long-term health. No random plans. No guesswork.',
        },
        {
          number: '02',
          title: 'IFBB PRO Athlete Experience',
          description:
            'I don’t just study transformations — I live them. With years of competitive experience and real-world results, you get a system tested under pressure — not just theory.',
        },
        {
          number: '03',
          title: 'Proven Track Record',
          description:
            'Over 500+ real transformations. Fat loss, muscle building, full body recomposition with clients from different backgrounds and levels.',
        },
        {
          number: '04',
          title: 'Fully Customized — No Templates',
          description:
            'Your plan is built based on your body, your lifestyle, your goal, and your blood work. Not copied. Not reused.',
        },
      ],
    },
    features: {
      tag: 'CORE OFFERINGS',
      heading: 'Features That Deliver Guaranteed Results',
      mealPlanTitle: 'Personalized MEAL PLAN',
      mealPlanDesc:
        'Fully customised training & meal plans customised to YOU & YOUR goals as well as your schedule and lifestyle which will be updated based on your progress. Choose from Balanced, Carbcycling, and Advanced diets!',
      workoutTitle: 'Personalised WORKOUT PROGRAM',
      workoutDesc:
        'Workout program just for you! I will customise your own ongoing training program. All exercises have been filmed to demonstrate how to perform them correctly.',
      locationTitle: 'HOME OR GYM WORKOUTS',
      locationDesc:
        'Workout wherever is most convenient for you with home or gym workout options!',
    },
    comparison: {
      tag: 'SYSTEM ADVANTAGE',
      heading: 'Dr. Ahmed Assem vs Conventional Coaching',
      subheading: 'See the clinical difference between a doctor-guided protocol and cookie-cutter social media plans.',
      table: [
        {
          criteria: 'Medical Doctor Supervision (M.D.)',
          drAssem: 'Yes — Full endocrine, metabolic, and biomarker oversight',
          others: 'None — Uncertified gym trainers or fitness influencers',
        },
        {
          criteria: 'Hormonal & Bloodwork Analysis',
          drAssem: 'Comprehensive lab reviews (Thyroid, Lipids, Liver, Androgens)',
          others: 'Ignored or dangerous guesswork',
        },
        {
          criteria: 'Competitive IFBB Pro Credentials',
          drAssem: 'International IFBB Pro Athlete with stage-proven methods',
          others: 'Theoretical knowledge or amateur bro-splits',
        },
        {
          criteria: 'Plan Customization',
          drAssem: '100% Bespoke — built around your metabolism, schedule & bloodwork',
          others: 'Generic copy-pasted PDF templates',
        },
        {
          criteria: 'Follow-ups & Accountability',
          drAssem: 'Weekly detailed video audits & direct physician WhatsApp hotline',
          others: 'Sporadic copy-paste text or automated bots',
        },
        {
          criteria: 'Long-term Metabolic Health',
          drAssem: 'Reverse-dieting & leptin/thyroid preservation built into every cut',
          others: 'Metabolic damage, starvation, and rapid rebound weight gain',
        },
      ],
    },
    packages: {
      tag: 'PACKAGES',
      heading: 'Select Your Transformation Package',
      currency: 'EGP',
      items: [
        {
          id: 'starter',
          name: 'Transformation System',
          price: '4500.00 EGP',
          priceNumeric: 4500,
          description:
            'A structured system designed to help you lose fat, build muscle, and stay consistent — without extreme dieting.',
          features: [
            'Customized Training Program with Video Demonstrations',
            'Structured Cardio & Fat Loss Protocol',
            'Meal Alternatives & Food Substitution System',
            'Supplement Guidance Based on Your Needs',
            'Weekly Check-ins & Progress Tracking',
            'Flexible Macro and micro -Based Nutrition Plan',
            'Ongoing Plan Adjustments Based on Progress',
            'Direct Support (Response within 24 Hours)',
            'Lifestyle & Habit Guidance',
          ],
        },
        {
          id: 'elite',
          name: 'Elite Coaching',
          price: '7000.00 EGP',
          priceNumeric: 7000,
          popular: true,
          description:
            'A premium coaching experience combining medical knowledge, structured follow-ups, and continuous optimization to deliver real transformations',
          features: [
            '2 Check-ins per Week with Detailed Analysis',
            'Advanced Nutrition System (Flexible & Macro and micro -Based)',
            'Continuous Plan Adjustments Based on Progress',
            'Meal Alternatives & Food Substitution System',
            'Customized Training Program with Video Demonstrations',
            'Supplements and PEDs Guidance Based on Your Needs',
            'Accountability System & Progress Tracking',
            'Priority Daily Support',
            'Lifestyle & Habit Optimization Guidance',
          ],
        },
        {
          id: 'alpha-vip',
          name: 'Dr. Ahmed Assem VIP Medical Mastery',
          price: '12000.00 EGP',
          priceNumeric: 12000,
          description:
            'A high-level coaching experience designed for serious individuals who want maximum results with full medical guidance, close monitoring, and elite-level customization.',
          features: [
            'Everything in Elite Coaching',
            'Daily Check-ins & Close Monitoring',
            'Weekly Video Calls (1:1 with Dr. Assem)',
            'Direct WhatsApp And Calls Support (Fast Response Priority)',
            'Advanced Nutrition System (Fully Customized)',
            'Advanced Training Program with Continuous Optimization',
            'Medical Guidance & Hormonal Awareness',
            'Blood Test Guidance & Interpretation',
            'Supplement Protocol (Precise & Personalized)',
            'Lifestyle Optimization & Habit Coaching',
            'Peak Week Strategy (if needed)',
          ],
        },
        {
          id: 'consultation',
          name: '1-on-1 Strategy Consultation',
          price: '2000.00 EGP',
          priceNumeric: 2000,
          description:
            'A personalized one-on-one session designed to analyze your current situation, identify what’s holding you back, and build a clear, actionable strategy to reach your goal efficiently.',
          note: '“If you decide to join coaching after the session, the consultation fee will be deducted from your program.”',
          features: [
            'Full Body & Goal Assessment',
            'Nutrition Strategy (Fat loss / Muscle gain / Recomp)',
            'Training Direction Based on Your Level',
            'Supplement Guidance (if needed)',
            'Problem Solving (Plateaus, adherence, confusion, etc.)',
            'Clear Action Plan to Follow After the Session',
          ],
        },
      ],
    },
    howItWorks: {
      tag: 'PROCESS',
      heading: 'How It Works',
      steps: [
        {
          step: '01',
          title: 'Fill the form & upload your pictures',
          desc: 'Complete the biometric intake form and submit current physique baseline photos.',
        },
        {
          step: '02',
          title: 'Wait your customized program',
          desc: 'Dr. Assem engineers your bespoke training, macro split, and metabolic plan.',
        },
        {
          step: '03',
          title: 'Send any concerns or questions',
          desc: 'Clarify any schedule, dietary restrictions, or equipment preferences.',
        },
        {
          step: '04',
          title: 'Receive your program',
          desc: 'Access your full program with demonstration videos and macro guidelines.',
        },
        {
          step: '05',
          title: 'Follow the diet & the workout plan',
          desc: 'Execute with structured check-ins, weekly biofeedback, and continuous tweaks.',
        },
        {
          step: '06',
          title: 'Look better within 12 weeks',
          desc: 'Witness drastic fat loss, dense muscle gains, and elevated health biomarkers.',
        },
      ],
    },
    banner: {
      title: 'START NOW',
      quote:
        'Build Your Best Shape With The Right System, Team, And Guidance. BY JOINING MY TEAM YOU WILL HAVE THE RIGHT GUIDANCE, GAIN THE KNOWLEDGE AND MOST IMPORTANTLY UNLOCK THE MINDSET THAT WILL STREAMLINE YOUR ROAD TO RESULTS NO MATTER WHAT YOUR GOAL IS.',
      pills: ['Custom Plan', 'Weekly Follow-up', 'Real Results'],
      cta: 'JOIN DR. AHMED ASSEM TODAY',
    },
    faqs: {
      title: 'FREQUENTLY ASKED QUESTIONS',
      items: [
        {
          q: 'How do I receive the program?',
          a: 'Your programs will be sent within 7-10 days after purchase.',
        },
        {
          q: 'Are the programs available world wide?',
          a: 'Yes, 100% online remote coaching is available worldwide. We work with clients across 18+ countries.',
        },
        {
          q: 'Do I need a gym?',
          a: 'No. You can choose between full gym access or a structured home workout option using dumbbells and resistance bands.',
        },
        {
          q: 'I’m new to the gym - is this good for beginner?',
          a: 'Yes. Every exercise has been filmed with high-definition video demonstrations showing exact execution, tempos, and setup.',
        },
        {
          q: 'Am I obligated to eat certain foods?',
          a: 'No! Our flexible macro and micro-based nutrition system includes a comprehensive meal alternative and food substitution framework.',
        },
        {
          q: 'How Many Days A Week Will I Train?',
          a: 'We design your split around your schedule and recovery capacity—typically between 3 to 6 days per week.',
        },
        {
          q: 'Will I have to train for hours?',
          a: 'No. Sessions are designed for maximum stimulus-to-fatigue efficiency and typically take 45 to 60 minutes.',
        },
        {
          q: 'How long between signing up and getting started ?',
          a: 'You will receive your intake assessment immediately upon registration, and your finalized custom program within 7-10 days.',
        },
      ],
    },
    footer: {
      rights: '© Copyright 2026 DR. AHMED ASSEM. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms and Conditions',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      packages: 'الباقات',
      features: 'المميزات',
      transformations: 'التحول',
      workouts: 'التدريب',
      comparison: 'مقارنة النظام',
      faqs: 'الأسئلة الشائعة',
      calculator: 'حاسبة السعرات والماكروز',
      langToggle: 'English',
    },
    hero: {
      headline: 'غيّر حياتك بالكامل في 12 أسبوعاً بنظام مصمم طبياً',
      subheadline: 'مئات المتدربين غيروا أجسامهم بنظام مثبت علمياً — بدون أي عشوائية',
      ctaStart: 'ابدأ الآن',
      ctaPackages: 'استعرض الباقات',
    },
    stats: {
      transformationsCount: '+500',
      transformationsLabel: 'تحول حقيقي موثق',
      weeksChange: '12',
      weeksLabel: 'أسبوعاً للتحول الكامل',
      doctorLabel: 'د. أحمد عاصم',
      experienceYears: '+14',
      experienceLabel: 'سنة خبرة طبية واحتراف IFBB',
    },
    testimonials: {
      title: 'آراء وتقييمات الأبطال',
      heading: 'تجارب حقيقية لعملاء اتبعوا نظام الألفا',
      subheading: 'ثقة مرئية وملموسة من خلال نتائج واقعية وموثقة بالأرقام.',
      reviews: [
        {
          name: 'زياد النموري',
          role: 'بطل خسارة الدهون',
          quote:
            'قبل ما أبدأ، جربت كل حاجة وكنت ديماً بفشل في الاستمرارية. الفرق هنا كان في النظام — كل تفصيلة واضحة، منظمة، وبتتعدل أسبوعياً. عمري ما حسيت إني تايه. نزلت من 152 كجم إلى 100 كجم، ولأول مرة قادر أحافظ على نتيجتي.',
          highlight: 'من 152 كجم إلى 100 كجم (-52 كجم دهون)',
          stats: '-52 كجم',
        },
        {
          name: 'أحمد السيسي',
          role: 'بطل إعادة التشكيل (Recomp)',
          quote:
            'بنيت عضلات ونزلت دهون في نفس الوقت — حاجة كنت فاكرها مستحيلة علمياً. مكنتش تخين بس جسمي مكنش ليه أي شكل. مع دكتور أحمد كل حاجة اتغيرت — التمرين، الأكل، وطريقة التفكير. جسمي بقى مختلف تماماً وكل الناس لاحظت ده.',
          highlight: 'زيادة كتلة عضلية صافية وبروز عضلات البطن',
          stats: '+4.5 كجم عضل',
        },
        {
          name: 'محمد نزار',
          role: 'بطل زيادة الكتلة العضلية',
          quote:
            'الاستمرارية كانت أكبر مشكلة بتواجهني… لحد ما بدأت النظام ده. كنت كل مرة أبدأ وأوقف. المتابعة الأسبوعية والتعديلات الدورية خلت الانقطاع مستحيل. ده مكنش مجرد دايت — ده كان نقطة تحول في حياتي.',
          highlight: 'التزام كامل وعادات رياضية دائمة',
          stats: 'استمرارية تامة',
        },
      ],
    },
    whyChoose: {
      tag: 'لماذا تختارنا',
      heading: 'لماذا تختار د. أحمد عاصم؟',
      subheading: 'ليس مجرد تدريب عادي — نظام متكامل مبني على العلم والخبرة العملية',
      pillars: [
        {
          number: '01',
          title: 'منهجية بإشراف طبي (Medically Guided)',
          description:
            'بصفتي طبيباً بشرياً، كل خطة تُبنى بفهم عميق للهرمونات، معدل الحرق والتمثيل الغذائي، الاستشفاء، والصحة العامة على المدى الطويل. لا خطط عشوائية ولا تجارب.',
        },
        {
          number: '02',
          title: 'خبرة لاعب محترف IFBB PRO',
          description:
            'أنا لا أدرس التحولات نظرياً فقط — أنا أعيشها يومياً. مع سنوات من الخبرة التنافسية على مسارح كمال الأجسام العالمية، ستحصل على نظام تم اختباره تحت أقصى درجات الضغط وليس مجرد نظريات كتب.',
        },
        {
          number: '03',
          title: 'سجل حافل بالنتائج (+500 تحول)',
          description:
            'أكثر من 500 تحول حقيقي موثق. خسارة دهون، بناء عضلات، وإعادة تشكيل كامل للجسم مع متدربين من مختلف المستويات وأنماط الحياة.',
        },
        {
          number: '04',
          title: 'تخصيص كامل 100% — بدون قوالب جاهزة',
          description:
            'خطتك تُصمم خصيصاً لجسمك، أسلوب حياتك، أهدافك، وتحاليلك الطبية. ليست منسوخة وليست قالباً مكرراً.',
        },
      ],
    },
    features: {
      tag: 'المميزات الرئيسية',
      heading: 'مميزات تضمن لك أسرع نتيجة بأمان',
      mealPlanTitle: 'نظام غذائي مخصص لك بالكامل',
      mealPlanDesc:
        'خطط تمرين وتغذية مخصصة بالكامل لك ولأهدافك وجدولك اليومي، ويتم تحديثها باستمرار بناءً على تطور جسمك. اختر بين النظام المتوازن، تدوير الكارب (Carb Cycling)، أو الأنظمة المتقدمة!',
      workoutTitle: 'برنامج تدريبي مخصص',
      workoutDesc:
        'برنامج تدريبي صُمم لك وحدك! سأقوم بتصميم جدولك التدريبي المستمر مع فيديوهات مصورة لكل تمرين توضح الأداء الحركي الصحيح بالتفصيل لتفادي الإصابات.',
      locationTitle: 'تمارين في الجيم أو في المنزل',
      locationDesc:
        'تمرّن في المكان الأنسب لك مع خيارات كاملة للتمارين في الجيم أو في المنزل بأبسط الإمكانيات!',
    },
    comparison: {
      tag: 'المقارنة العلمية',
      heading: 'نظام د. أحمد عاصم مقابل التدريب التقليدي',
      subheading: 'اكتشف الفارق الجوهري بين إشراف طبيب ومحترف دولي وبين الخطط العشوائية المنسوخة.',
      table: [
        {
          criteria: 'إشراف طبيب بشري متخصص (M.D.)',
          drAssem: 'نعم — فهم كامل للغدد والهرمونات والكيمياء الحيوية ومعدل الحرق',
          others: 'لا يوجد — مدربون غير معتمدين أو هواة سوشيال ميديا',
        },
        {
          criteria: 'قراءة وفحص التحاليل الطبية',
          drAssem: 'تحليل دوري شامل (الغدة الدرقية، دهون الدم، وظائف الكبد، التستوستيرون)',
          others: 'تجاهل تام للتحاليل أو وصف عشوائي مضر بالصحة',
        },
        {
          criteria: 'اعتماد رسمي كلاعب محترف IFBB Pro',
          drAssem: 'بطل ومحترف IFBB Pro على المسارح الدولية مع خبرة بطولات عملية',
          others: 'خبرة سطحية أو برامج كمال أجسام تقليدية بدون تخصيص',
        },
        {
          criteria: 'تخصيص الخطة والوجبات',
          drAssem: 'تخصيص 100% متوافق مع وزنك، نشاطك، وتفضيلات طعامك ونظام تبديل الأكل',
          others: 'ملفات PDF موحدة منسوخة لجميع المشتركين',
        },
        {
          criteria: 'المتابعة والدعم المباشر',
          drAssem: 'متابعة أسبوعية بفيديوهات تقييم وخط واتساب مباشر وسريع مع الدكتور',
          others: 'ردود آلية أو رسائل جاهزة كل أسبوعين',
        },
        {
          criteria: 'الحفاظ على الحرق وصحة الجسم',
          drAssem: 'خطط Reverse Dieting وتنشيط الغدة الدرقية لمنع ثبات الوزن والارتداد',
          others: 'تجويع قاسي وحرمان يؤدي لدمار الحرق واكتساب الوزن بسرعة مضاعفة',
        },
      ],
    },
    packages: {
      tag: 'الباقات والأسعار',
      heading: 'اختر باقة التدريب الأنسب لهدفك',
      currency: 'جنيه مصري',
      items: [
        {
          id: 'starter',
          name: 'نظام التحول الأساسي',
          price: '4500.00 EGP',
          priceNumeric: 4500,
          description:
            'نظام منظم مصمم لمساعدتك على خسارة الدهون، بناء العضلات، والاستمرار — بدون حرمان أو دايت قاسي.',
          features: [
            'برنامج تدريبي مخصص مع فيديوهات توضيحية لكل تمرين',
            'بروتوكول كارديو وخسارة دهون منظم',
            'نظام بدائل غذائية لمرونة كاملة في الوجبات',
            'إرشادات المكملات الغذائية بناءً على احتياجك الفعلي',
            'متابعة أسبوعية وتتبع مستمر للنتائج والمقاسات',
            'خطة تغذية مرنة معتمدة على الماكروز والميكروز',
            'تعديلات مستمرة على الخطة وفقاً لسرعة تقدمك',
            'دعم مباشر (الرد خلال 24 ساعة كحد أقصى)',
            'توجيهات لضبط العادات اليومية وأسلوب الحياة',
          ],
        },
        {
          id: 'elite',
          name: 'التدريب المتميز (Elite Coaching)',
          price: '7000.00 EGP',
          priceNumeric: 7000,
          popular: true,
          description:
            'تجربة تدريب استثنائية تجمع بين المعرفة الطبية، المتابعة الدقيقة، والتطوير المستمر لتحقيق تحول حقيقي وفارق.',
          features: [
            'متابعتان أسبوعياً (2 Check-ins) مع تحليل تفصيلي للتطور',
            'نظام تغذية متقدم (مرن ومعتمد على الماكروز والميكروز بدقة)',
            'تعديلات دورية مستمرة على الخطة وفقاً للتقدم',
            'نظام بدائل وجبات واسع وخيارات متنوعة',
            'برنامج تدريبي مخصص مع فيديوهات أداء واضحة',
            'توجيه وإشراف كامل على المكملات الغذائية ومحسنات الأداء (PEDs)',
            'نظام محاسبة وتتبع دقيق للمؤشرات الحيوية',
            'دعم يومي ذو أولوية وسرعة في الرد',
            'توجيه لضبط النوم والاستشفاء والعادات الصحية',
          ],
        },
        {
          id: 'alpha-vip',
          name: 'تدريب النخبة الطبي مع د. أحمد عاصم',
          price: '12000.00 EGP',
          priceNumeric: 12000,
          description:
            'أعلى مستويات التدريب والمتابعة للمتدربين الجادين الراغبين في أقصى نتيجة ممكنة بإشراف طبي كامل وتواصل مباشر ولحظي.',
          features: [
            'كل مميزات باقة الـ Elite Coaching',
            'متابعة وتقييم يومي دقيق',
            'مكالمات فيديو أسبوعية 1-on-1 مباشرة مع د. أحمد عاصم',
            'دعم واتساب ومكالمات مباشرة (أولوية رد فائقة السرعة)',
            'نظام تغذية فائق التخصيص والدقة',
            'برنامج تدريبي متقدم مع تطوير مستمر للأحمال والأداء',
            'توجيه طبي وفهم عميق للاتزان الهرموني',
            'طلب وقراءة وتفسير التحاليل الطبية الشاملة دورياً',
            'بروتوكول مكملات دقيق ومخصص لأعلى استفادة بأمان',
            'تطوير أسلوب الحياة والنوم وإدارة التوتر',
            'استراتيجية أسبوع الذروة (Peak Week) في حال الاستعداد للبطولات أو المناسبات',
          ],
        },
        {
          id: 'consultation',
          name: 'جلسة استشارية خاصة (1-on-1 Session)',
          price: '2000.00 EGP',
          priceNumeric: 2000,
          description:
            'جلسة خاصة فردية لتحليل وضعك الحالي، تحديد ما يعيق تقدمك، وبناء استراتيجية واضحة وقابلة للتطبيق للوصول لهدفك بكفاءة.',
          note: '“إذا قررت الانضمام لأي باقة تدريبية بعد الجلسة، فسيتم خصم قيمة الاستشارة بالكامل من سعر باقتك.”',
          features: [
            'تقييم شامل لحالة الجسم والهدف المطلوب',
            'استراتيجية تغذية واضحة (تخسيس / تضخيم / ريكومب)',
            'توجيه تدريبي مخصص لمستواك وإمكانياتك',
            'إرشادات المكملات المناسبة لحالتك',
            'حل المشكلات (ثبات الوزن، عدم الالتزام، الحيرة في الدايت)',
            'خطة عمل واضحة لتنفيذها مباشرة بعد الجلسة',
          ],
        },
      ],
    },
    howItWorks: {
      tag: 'خطوات النظام',
      heading: 'كيف يعمل النظام؟',
      steps: [
        {
          step: '01',
          title: 'املأ الاستمارة وارفع صورك',
          desc: 'املأ استمارة البيانات الطبية والرياضية وارفع صورك الحالية لتحديد نقطة البداية بدقة.',
        },
        {
          step: '02',
          title: 'انتظر برنامجك المخصص',
          desc: 'يقوم د. أحمد عاصم بتصميم خطتك التدريبية والغذائية والماكروز وفقاً لبياناتك.',
        },
        {
          step: '03',
          title: 'أرسل أي استفسارات أو أسئلة',
          desc: 'ناقش أي تفاصيل متعلقة بجدول مواعيدك أو أجهزتك أو أكلاتك المفضلة.',
        },
        {
          step: '04',
          title: 'استلم برنامجك المتكامل',
          desc: 'استلم ملفاتك الكاملة مع الفيديوهات التوضيحية وجدول المغذيات والبدائل.',
        },
        {
          step: '05',
          title: 'التزم بالدايت وخطة التمرين',
          desc: 'ابدأ التنفيذ مع متابعات دورية وقياسات مستمرة وتعديلات تواكب التطور.',
        },
        {
          step: '06',
          title: 'شاهد أفضل نسخة من جسمك في 12 أسبوعاً',
          desc: 'استمتع بنزول ملحوظ للدهون، شكل عضلات مقسم ومشدود، وصحة ونشاط أعلى.',
        },
      ],
    },
    banner: {
      title: 'ابدأ الآن',
      quote:
        'ابنِ أفضل نسخة من جسمك مع النظام الصحيح، الفريق المناسب، والتوجيه الطبي الدقيق. بانضمامك لفريقي ستحصل على التوجيه السليم، المعرفة الحقيقية، والأهم من ذلك العقلية التي ستختصر طريقك للنتائج مهما كان هدفك.',
      pills: ['خطة مخصصة', 'متابعة أسبوعية', 'نتائج حقيقية'],
      cta: 'انضم لفريق الألفا الآن',
    },
    faqs: {
      title: 'الأسئلة الشائعة',
      items: [
        {
          q: 'كيف أستلم البرنامج؟',
          a: 'يتم إرسال برامجك المخصصة خلال 7-10 أيام عمل بعد الاشتراك وإتمام بيانات الاستمارة.',
        },
        {
          q: 'هل البرامج متاحة لجميع دول العالم؟',
          a: 'نعم، التدريب أونلاين 100% ومتاح لجميع الدول. لدينا متدربون في أكثر من 18 دولة حول العالم.',
        },
        {
          q: 'هل أحتاج بالضرورة للاشتراك في جيم؟',
          a: 'لا، يمكنك الاختيار بين التدريب في الجيم أو التدريب المنزلي بالدمبلز وحبال المقاومة وفقاً لظروفك.',
        },
        {
          q: 'أنا مبتدئ تماماً في التمرين - هل هذا النظام مناسب لي؟',
          a: 'نعم بالتأكيد! كل تمرين مصور بفيديو توضيحي عالي الجودة يشرح طريقة الأداء والزوايا السليمة تفصيلياً.',
        },
        {
          q: 'هل أنا مجبر على تناول أطعمة معينة؟',
          a: 'لا على الإطلاق! نظامنا الغذائي المرن يشمل قائمة بدائل متكاملة تتيح لك تبديل الأطعمة حسب ما تحب وتفضل.',
        },
        {
          q: 'كم يوماً سأتمرن في الأسبوع؟',
          a: 'يتم تحديد أيام التمرين وفقاً لوقتك وقدرتك على الاستشفاء — عادةً من 3 إلى 6 أيام في الأسبوع.',
        },
        {
          q: 'هل سأقضي ساعات طويلة في التمرين يومياً؟',
          a: 'لا، التمارين مصممة بأعلى كفاءة لتحفيز البناء العضلي وتستغرق بين 45 إلى 60 دقيقة فقط في الجلسة.',
        },
        {
          q: 'كم المدة بين الاشتراك وبداية البرنامج؟',
          a: 'تصلك استمارة التقييم فوراً، ويتم تسليم برنامجك المخصص والمصمم خصيصاً لك خلال 7-10 أيام.',
        },
      ],
    },
    footer: {
      rights: '© جميع الحقوق محفوظة 2026 د. أحمد عاصم.',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
    },
  },
};
