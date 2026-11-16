/** Starter articles for the Blogs feature. They are general educational pieces — edit or replace them from /admin. */
const L = (en: string, ar: string) => ({ en, ar });
const img = (asset: string, en: string, ar: string) => ({ asset, alt: L(en, ar) });

const cat = {
  training: L('Training', 'تدريب'),
  nutrition: L('Nutrition', 'تغذية'),
  recovery: L('Recovery', 'استشفاء'),
  fatLoss: L('Fat loss', 'خسارة الدهون'),
  mindset: L('Mindset', 'عقلية'),
};

export const blogContent = {
  tag: L('THE JOURNAL', 'المدونة'),
  heading: L('Training & Nutrition, Explained Simply', 'التدريب والتغذية بشكل مبسّط'),
  subheading: L(
    'Practical articles from Dr. Ahmed Assem to help you train smarter and eat better.',
    'مقالات عملية من د. أحمد عاصم تساعدك تتدرب بذكاء وتاكل أحسن.'
  ),
  page: {
    title: L('Blog', 'المدونة'),
    subtitle: L(
      'Science-based tips on training, nutrition and recovery.',
      'نصائح مبنية على العلم في التدريب والتغذية والاستشفاء.'
    ),
  },
  labels: {
    viewAll: L('View all articles', 'كل المقالات'),
    readMore: L('Read article', 'اقرأ المقال'),
    all: L('All', 'الكل'),
    back: L('All articles', 'كل المقالات'),
    empty: L('No articles yet.', 'مفيش مقالات لسه.'),
    related: L('Keep reading', 'كمّل قراءة'),
    cta: L('Start your transformation', 'ابدأ تحولك الآن'),
    ctaText: L(
      'Get a plan built around your body, schedule and goal — with direct follow-up from Dr. Ahmed Assem.',
      'احصل على خطة مبنية على جسمك ووقتك وهدفك، مع متابعة مباشرة من د. أحمد عاصم.'
    ),
  },
  posts: [
    {
      id: 'post-1', slug: 'progressive-overload-basics', visible: true, tone: 'brand', date: '2026-11-12',
      category: cat.training,
      title: L('Progressive overload: the one rule behind every result', 'الحمل التدريجي: القاعدة الواحدة ورا كل نتيجة'),
      excerpt: L('Muscles grow when you give them a reason to. Here is how to keep that reason growing.', 'العضلة بتكبر لما تدّيها سبب. إزاي تكبّر السبب ده أسبوع ورا التاني.'),
      readTime: L('4 min read', '٤ دقائق قراءة'),
      image: img('person_1', 'Athlete training', 'متدرب أثناء التمرين'),
      body: L(
        'Progressive overload simply means asking your body to do a little more over time: one more rep, a bit more weight, or better control of the same weight.\n\nYou do not need to add weight every session. Track your numbers, aim to beat last week by a small margin, and keep your form strict. If the same weight feels easier with clean technique, that is progress too.\n\nWhen you stall for several weeks, look at sleep, food and total weekly volume before changing the whole programme.',
        'الحمل التدريجي معناه إنك تطلب من جسمك أكتر شوية مع الوقت: تكرار زيادة، وزن أعلى شوية، أو تحكم أحسن في نفس الوزن.\n\nمش لازم تزوّد وزن كل حصة. سجّل أرقامك، وحاول تتخطى الأسبوع اللي فات بفارق صغير، وحافظ على الفورم. لو نفس الوزن بقى أسهل بتكنيك نضيف، ده تقدم برضو.\n\nلو وقفت كذا أسبوع، راجع النوم والأكل وحجم التمرين الأسبوعي قبل ما تغيّر البرنامج كله.'
      ),
    },
    {
      id: 'post-2', slug: 'how-much-protein', visible: true, tone: 'dark', date: '2026-11-09',
      category: cat.nutrition,
      title: L('How much protein do you really need?', 'محتاج بروتين قد إيه فعلًا؟'),
      excerpt: L('A simple range, how to spread it through the day, and what matters more than the exact number.', 'رينج بسيط، وإزاي توزّعه على اليوم، وإيه اللي أهم من الرقم بالظبط.'),
      readTime: L('3 min read', '٣ دقائق قراءة'),
      image: img('person_2', 'Healthy meal prep', 'تحضير وجبات صحية'),
      body: L(
        'For people who lift weights, intakes around 1.6–2.2 grams of protein per kilogram of body weight per day are commonly recommended.\n\nSpread it over three to five meals instead of one huge serving, and pick sources you actually enjoy and can repeat: eggs, chicken, fish, dairy, legumes.\n\nConsistency beats perfection. Hitting your range most days matters more than hitting an exact number every day.',
        'للي بيتمرن بأوزان، بيتوصى عادةً بحوالي ١٫٦ لـ ٢٫٢ جرام بروتين لكل كيلو من وزن الجسم يوميًا.\n\nوزّعه على ٣ لـ ٥ وجبات بدل وجبة ضخمة واحدة، واختار مصادر بتحبها وتقدر تكررها: بيض، فراخ، سمك، ألبان، بقوليات.\n\nالاستمرارية أهم من الكمال. إنك توصل للرينج أغلب الأيام أهم من رقم مظبوط كل يوم.'
      ),
    },
    {
      id: 'post-3', slug: 'sleep-and-muscle', visible: true, tone: 'light', date: '2026-11-06',
      category: cat.recovery,
      title: L('Sleep is part of your programme', 'النوم جزء من برنامجك'),
      excerpt: L('Why the hours after the gym decide how much you gain from the hours in it.', 'ليه الساعات بعد الجيم بتحدد هتستفيد قد إيه من الساعات جواه.'),
      readTime: L('3 min read', '٣ دقائق قراءة'),
      image: img('person_3', 'Rest and recovery', 'راحة واستشفاء'),
      body: L(
        'Training is the signal; recovery is where the body adapts. Most adults do best with roughly seven to nine hours of sleep.\n\nKeep a regular bedtime, keep the room dark and cool, and cut screens and caffeine late in the day. Small habits repeated nightly add up faster than any supplement.',
        'التمرين هو الإشارة، والاستشفاء هو المرحلة اللي الجسم بيتأقلم فيها. أغلب البالغين بيكونوا أحسن مع حوالي ٧ لـ ٩ ساعات نوم.\n\nثبّت ميعاد النوم، خلّي الأوضة ضلمة وباردة، وقلل الشاشات والكافيين آخر اليوم. عادات صغيرة بتتكرر كل ليلة بتفرق أكتر من أي مكمل.'
      ),
    },
    {
      id: 'post-4', slug: 'fat-loss-beyond-cardio', visible: true, tone: 'accent', date: '2026-11-03',
      category: cat.fatLoss,
      title: L('Fat loss is not only about cardio', 'خسارة الدهون مش كارديو بس'),
      excerpt: L('Food, lifting and daily movement do most of the work. Cardio is a tool, not the plan.', 'الأكل والحديد والحركة اليومية بيعملوا أغلب الشغل. الكارديو أداة مش خطة.'),
      readTime: L('4 min read', '٤ دقائق قراءة'),
      image: img('person_4', 'Fat loss training', 'تدريب خسارة الدهون'),
      body: L(
        'A modest calorie deficit, enough protein and regular strength training keep muscle while the fat comes off.\n\nWalking more every day is an underrated way to raise energy expenditure without adding stress. Use cardio to support the deficit, not to punish yourself for a meal.',
        'عجز بسيط في السعرات، وبروتين كفاية، وتمرين مقاومة منتظم بيحافظوا على العضل وإنت بتخسر الدهون.\n\nالمشي أكتر كل يوم طريقة مظلومة لزيادة الحرق من غير ضغط زيادة. استخدم الكارديو يدعم العجز، مش يعاقبك على وجبة.'
      ),
    },
    {
      id: 'post-5', slug: 'carb-cycling-simply', visible: true, tone: 'dark', date: '2026-10-30',
      category: cat.nutrition,
      title: L('Carb cycling, explained simply', 'الكارب سايكلينج بشكل بسيط'),
      excerpt: L('What it is, who it suits, and why it is not a magic trick.', 'إيه هو، بيناسب مين، وليه مش سحر.'),
      readTime: L('5 min read', '٥ دقائق قراءة'),
      image: img('person_5', 'Balanced plate', 'طبق متوازن'),
      body: L(
        'Carb cycling means eating more carbohydrates on harder training days and fewer on rest days, while weekly calories stay the same.\n\nIt can make a plan easier to follow for some people, but it is a preference, not a requirement. Start with a simple, consistent plan and only adjust when you have a clear reason.',
        'الكارب سايكلينج معناه تاكل كارب أكتر في أيام التمرين الشديد وأقل في أيام الراحة، والسعرات الأسبوعية ثابتة.\n\nممكن يسهّل الالتزام عند ناس، بس هو تفضيل مش شرط. ابدأ بخطة بسيطة ثابتة، وعدّل بس لما يكون عندك سبب واضح.'
      ),
    },
    {
      id: 'post-6', slug: 'why-diets-fail', visible: true, tone: 'brand', date: '2026-10-27',
      category: cat.mindset,
      title: L('Why most diets fail in the first month', 'ليه أغلب الدايتات بتفشل في الشهر الأول'),
      excerpt: L('It is rarely willpower. It is usually a plan that does not fit your real life.', 'نادرًا الإرادة. غالبًا خطة مش مناسبة لحياتك الحقيقية.'),
      readTime: L('4 min read', '٤ دقائق قراءة'),
      image: img('transformation/16', 'Client transformation', 'تحول متدرب'),
      body: L(
        'Extreme plans look great on day one and collapse by week three. If you cannot imagine eating this way in six months, it is not a plan, it is a short challenge.\n\nBuild around foods you like, your work schedule and your family meals. Aim for steady, boring consistency; that is where the results hide.',
        'الخطط المتطرفة بتبان حلوة يوم أول وبتنهار في الأسبوع التالت. لو مش قادر تتخيل نفسك بتاكل كده بعد ٦ شهور، دي مش خطة، دي تحدي قصير.\n\nابنِ على أكل بتحبه، ومواعيد شغلك، وأكل البيت. اهدف لاستمرارية ثابتة وممله شوية؛ هناك النتيجة مستخبية.'
      ),
    },
    {
      id: 'post-7', slug: 'warm-up-mistakes', visible: true, tone: 'light', date: '2026-10-24',
      category: cat.training,
      title: L('Three warm-up mistakes that cost you reps', 'تلات أخطاء في الإحماء بتخسّرك تكرارات'),
      excerpt: L('A better warm-up takes eight minutes and makes your first working set count.', 'إحماء أحسن بياخد ٨ دقايق وبيخلّي أول سيت فعلي يفرق.'),
      readTime: L('3 min read', '٣ دقائق قراءة'),
      image: img('transformation/17', 'Gym warm-up', 'إحماء في الجيم'),
      body: L(
        'Static stretching for ten minutes then jumping into heavy sets is the classic mistake. Raise your temperature first, then do lighter ramp-up sets of the first exercise.\n\nWarm up the joints you are about to load, not everything. Keep it short and specific, then get to work.',
        'الإطالة الثابتة ١٠ دقايق وبعدها سيتات تقيلة هي الغلطة الكلاسيكية. ارفع حرارة جسمك الأول، وبعدها اعمل سيتات تصاعدية أخف من أول تمرين.\n\nسخّن المفاصل اللي هتشيل عليها بس، مش كل حاجة. خليه قصير ومحدد وبعدها ابدأ شغل.'
      ),
    },
    {
      id: 'post-8', slug: 'track-progress-beyond-scale', visible: true, tone: 'dark', date: '2026-10-21',
      category: cat.mindset,
      title: L('Track progress beyond the scale', 'تابع تقدمك بعيدًا عن الميزان'),
      excerpt: L('Photos, measurements, strength and energy tell a fuller story than daily weight.', 'الصور والمقاسات والقوة والطاقة بتحكي قصة أكمل من الوزن اليومي.'),
      readTime: L('3 min read', '٣ دقائق قراءة'),
      image: img('transformation/18', 'Progress photos', 'صور التقدم'),
      body: L(
        'Body weight moves with water, salt and sleep. Use weekly averages together with photos, a tape measure and your lifting numbers.\n\nTake pictures in the same light and pose every two weeks. Trends over a month matter; a single morning does not.',
        'وزن الجسم بيتأثر بالمية والملح والنوم. استخدم متوسط أسبوعي مع الصور وشريط القياس وأرقام الحديد.\n\nصوّر بنفس الإضاءة ونفس الوضعية كل أسبوعين. اتجاه الشهر هو المهم، مش صبحية واحدة.'
      ),
    },
    {
      id: 'post-9', slug: 'contest-prep-lessons', visible: true, tone: 'accent', date: '2026-10-18',
      category: cat.mindset,
      title: L('What contest prep teaches everyday trainees', 'إيه اللي تحضير البطولات بيعلّمه للمتدرب العادي'),
      excerpt: L('Structure, patience and honest tracking — habits that work at any level.', 'التنظيم والصبر والتتبع الصادق — عادات بتنفع على أي مستوى.'),
      readTime: L('5 min read', '٥ دقائق قراءة'),
      image: img('coach-header', 'Dr. Ahmed Assem', 'د. أحمد عاصم'),
      body: L(
        'Preparing for a stage teaches you that results come from boring things done well for a long time.\n\nYou can borrow the same habits: a written plan, weekly check-ins, adjusting based on data instead of mood, and respecting rest.',
        'التحضير للبطولات بيعلّمك إن النتايج بتيجي من حاجات مملة بتتعمل صح لفترة طويلة.\n\nتقدر تستعير نفس العادات: خطة مكتوبة، متابعة أسبوعية، تعديل بناءً على أرقام مش مزاج، واحترام الراحة.'
      ),
    },
  ],
};
