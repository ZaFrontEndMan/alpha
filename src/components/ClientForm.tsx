import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Language } from '../translations';
import { BrandLogo } from './BrandLogo';

interface FormPageProps {
  lang: Language;
  onToggleLang: () => void;
}

// ─── Form Data ───────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  gender: 'Male' | 'Female';
  age: string;
  location: string;
  phone: string;
  email: string;
  height: string;
  weight: string;
  bodyFat: string;
  sleepHours: string;
  sleepQuality: string;
  targetGoal: string;
  dailyActivity: string;
  trainingDays: string;
  benchPressMax: string;
  squatsMax: string;
  barbellRowsMax: string;
  medicalConditions: 'Yes' | 'No' | '';
  onlineCoachingExp: 'Yes' | 'No' | '';
  cardioMachines: string[];
  reachSource: string;
  subscriptionReason: string;
  selectedTier: string;
  proteins: string[];
  carbs: string[];
  fruits: string[];
  veggies: string[];
  healthyFats: string[];
}

// ─── Options ─────────────────────────────────────────────────────────────────
const GOALS = [
  'Fat loss - rapid',
  'Body recomposition - slow fat loss and muscle gain',
  'Lean Bulking - muscle gain',
];

const ACTIVITIES = [
  'Working from home - zero activity',
  'Light activity - normal daily activity',
  'Moderate - 1-2 working out days',
  'Active - up to 4 working out days',
  'Athlete - working out 6-7 days a week',
];

const CARDIO_MACHINES = ['Treadmill', 'Bike', 'Elliptical', 'Rowing', 'Jumping rope'];
const REACH_SOURCES = ['Instagram', 'Facebook', 'TikTok', 'Referral', 'YouTube', 'Other'];

const PROTEIN_OPTIONS = ['Chicken breast', 'Eggs', 'Steak', 'Salmon', 'White fish', 'Tuna', 'Protein shakes', 'Turkey breasts', 'Shrimps', 'Greek yogurt'];
const CARB_OPTIONS = ['Sweet potatoes', 'Corn flakes', 'Toast', 'Pasta', 'Cream of rice', 'Rice cakes', 'Dates', 'Oats', 'Basmati rice', 'White rice'];
const FRUIT_OPTIONS = ['Apples', 'Oranges', 'Kiwi', 'Strawberries', 'Bananas', 'Watermelon', 'Pomegranate'];
const VEGGIE_OPTIONS = ['Green peas', 'Zucchini', 'Green beans', 'Asparagus', 'Lettuce', 'Bell peppers', 'Broccoli', 'Tomatoes', 'Cucumber', 'Mushroom', 'Carrot'];
const FAT_OPTIONS = ['Almonds', 'Cashews', 'Pecan', 'Pistachio', 'Avocado', 'Olive oil', 'Dark chocolate', 'Peanut butter', 'Walnuts'];

const PACKAGES = [
  'Transformation System (4500 EGP)',
  'Elite Coaching (7000 EGP)',
  'VIP Medical Mastery (12000 EGP)',
  '1-on-1 Strategy Consultation (2000 EGP)',
];

const TOTAL_STEPS = 6;
const STEP_LABELS_EN = ['Personal Info', 'Body Metrics', 'Fitness Profile', 'Health & History', 'Extra Info', 'Nutrition'];
const STEP_LABELS_AR = ['البيانات الشخصية', 'القياسات', 'الملف الرياضي', 'الصحة والتاريخ', 'معلومات إضافية', 'التفضيلات الغذائية'];

const WHATSAPP_NUMBER = '201002146690';

// ─── WhatsApp Message Builder ─────────────────────────────────────────────────
function buildWhatsAppMessage(d: FormData): string {
  return `*New Client Application*
----------------------------------------
*Personal Info:*
- *Name:* ${d.name}
- *Gender:* ${d.gender}
- *Age:* ${d.age}
- *Location:* ${d.location}
*Contact Info:*
- *Phone:* ${d.phone}
- *Email:* ${d.email}
*Body Metrics:*
- *Height:* ${d.height} cm
- *Weight:* ${d.weight} kg
- *Body Fat:* ${d.bodyFat}%
*Fitness Profile:*
- *Target Goal:* ${d.targetGoal}
- *Daily Activity:* ${d.dailyActivity}
- *Training Days:* ${d.trainingDays} days/week
- *Max Bench Press:* ${d.benchPressMax} kg
- *Max Squats:* ${d.squatsMax} kg
- *Max Barbell Rows:* ${d.barbellRowsMax} kg
*Health & History:*
- *Medical Conditions:* ${d.medicalConditions}
- *Online Coaching Exp:* ${d.onlineCoachingExp}
- *Sleep Hours:* ${d.sleepHours} hrs
- *Sleep Quality:* ${d.sleepQuality}/10
- *Cardio Machines:* ${d.cardioMachines.join(', ') || 'None'}
*Extra Info:*
- *Reach source:* ${d.reachSource}
- *Subscription reason:* ${d.subscriptionReason}
- *Package:* ${d.selectedTier}
*Nutrition Preferences:*
- *Proteins:* ${d.proteins.join(', ') || 'None'}
- *Carbs:* ${d.carbs.join(', ') || 'None'}
- *Fruits:* ${d.fruits.join(', ') || 'None'}
- *Veggies:* ${d.veggies.join(', ') || 'None'}
- *Healthy Fats:* ${d.healthyFats.join(', ') || 'None'}
----------------------------------------`;
}

// ─── Shared Components ───────────────────────────────────────────────────────
const CheckOption: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
  type?: 'checkbox' | 'radio';
}> = ({ label, checked, onChange, type = 'checkbox' }) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(
      'flex items-center gap-3 w-full text-start px-4 py-3.5 border text-sm transition-all cursor-pointer',
      checked
        ? 'border-[#8cffdb] bg-[#8cffdb]/10 text-[#8cffdb] font-semibold'
        : 'border-neutral-800 bg-[#0f1311] text-neutral-300 hover:border-neutral-600 hover:text-white'
    )}
  >
    <span className={cn(
      'w-5 h-5 shrink-0 border-2 flex items-center justify-center text-[11px] font-black transition-all',
      checked ? 'border-[#8cffdb] bg-[#8cffdb] text-black' : 'border-neutral-600',
      type === 'radio' ? 'rounded-full' : 'rounded-sm'
    )}>
      {checked && (type === 'radio' ? '●' : '✓')}
    </span>
    <span>{label}</span>
  </button>
);

// ─── Main Page ───────────────────────────────────────────────────────────────
export const FormPage: React.FC<FormPageProps> = ({ lang, onToggleLang }) => {
  const navigate = useNavigate();
  const en = lang === 'en';
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Read ?tier= query param to pre-select a package
  const tierParam = new URLSearchParams(window.location.search).get('tier') ?? 'Elite Coaching (7000 EGP)';

  const [data, setData] = useState<FormData>({
    name: '', gender: 'Male', age: '', location: '', phone: '', email: '',
    height: '', weight: '', bodyFat: '', sleepHours: '', sleepQuality: '',
    targetGoal: GOALS[0], dailyActivity: '', trainingDays: '',
    benchPressMax: '', squatsMax: '', barbellRowsMax: '',
    medicalConditions: '', onlineCoachingExp: '',
    cardioMachines: [], reachSource: 'Instagram', subscriptionReason: '',
    selectedTier: tierParam,
    proteins: [], carbs: [], fruits: [], veggies: [], healthyFats: [],
  });

  // Lock body scroll on this page
  useEffect(() => {
    document.documentElement.setAttribute('dir', en ? 'ltr' : 'rtl');
    document.documentElement.setAttribute('lang', lang);
  }, [lang, en]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const toggleArr = (
    key: 'proteins' | 'carbs' | 'fruits' | 'veggies' | 'healthyFats' | 'cardioMachines',
    val: string
  ) =>
    setData((prev) => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [emailDispatched, setEmailDispatched] = useState<boolean | null>(null);

  const handleSubmit = async () => {
    setIsSubmittingForm(true);
    // 1. Dispatch email notification to owner and confirmation to customer
    try {
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((resData) => {
          setEmailDispatched(resData?.success === true);
        })
        .catch((err) => {
          console.warn('Subscription email dispatch warning:', err);
          setEmailDispatched(false);
        });
    } catch {
      // Ignore background network issues for whatsapp flow
    }

    // 2. Open WhatsApp fast-track
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(data))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setIsSubmittingForm(false);
  };

  const stepLabels = en ? STEP_LABELS_EN : STEP_LABELS_AR;

  // Shared class names
  const fieldCls = 'w-full bg-[#0f1311] border border-neutral-800 text-white px-4 py-3 min-h-[48px] text-sm focus:border-[#8cffdb] focus:outline-none transition-colors placeholder:text-neutral-600';
  const labelCls = 'block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2';

  return (
    <div
      className={cn(
        'min-h-screen w-full bg-[#090b0a] text-neutral-100 flex flex-col',
        en ? 'font-sans' : 'font-cairo'
      )}
    >
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#090b0a]/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-semibold cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {en ? 'Back to site' : 'العودة للموقع'}
          </button>

          {/* Logo */}
          <a href="/" className="shrink-0">
            <BrandLogo size={28} />
          </a>

          {/* Lang toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-3 py-1.5 text-xs font-bold border border-neutral-700 bg-neutral-900/80 hover:border-[#8cffdb] hover:text-[#8cffdb] text-neutral-300 transition-colors cursor-pointer min-h-[36px]"
          >
            {en ? 'عربي' : 'EN'}
          </button>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-2xl">
          {!submitted ? (
            <>
              {/* Heading */}
              <div className="mb-8">
                <div className="text-xs font-mono text-[#8cffdb] uppercase tracking-widest mb-2">
                  {en ? 'New Client Application' : 'استمارة عميل جديد'}
                </div>
                <h1 className={cn('text-3xl sm:text-4xl font-black text-white tracking-tight', en ? 'font-sport' : 'font-cairo')}>
                  {en ? 'Start Your Journey' : 'ابدأ رحلتك الآن'}
                </h1>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {en
                    ? 'Complete the form below and we\'ll send everything straight to Dr. Ahmed Assem via WhatsApp.'
                    : 'أكمل الاستمارة وسنرسل بياناتك مباشرةً لدكتور أحمد عاصم عبر الواتساب.'}
                </p>
              </div>

              {/* Step indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    {en ? `Step ${step} of ${TOTAL_STEPS}` : `الخطوة ${step} من ${TOTAL_STEPS}`}
                  </span>
                  <span className="text-[11px] font-mono text-[#8cffdb] font-bold">
                    {stepLabels[step - 1]}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="flex gap-1">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1 flex-1 transition-all duration-300',
                        i + 1 <= step ? 'bg-[#8cffdb]' : 'bg-neutral-800'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Card */}
              <div className="bg-[#0c0f0d] border border-neutral-800 p-6 sm:p-8 space-y-5">

                {/* ── STEP 1: Personal Info ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>{en ? 'Full Name' : 'الاسم الكامل'}</label>
                      <input type="text" placeholder={en ? 'e.g. Ahmed Assem' : 'مثال: أحمد عاصم'} value={data.name} onChange={(e) => set('name', e.target.value)} className={fieldCls} />
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Gender' : 'الجنس'}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Male', 'Female'] as const).map((g) => (
                          <CheckOption key={g} type="radio" label={en ? g : g === 'Male' ? 'ذكر' : 'أنثى'} checked={data.gender === g} onChange={() => set('gender', g)} />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>{en ? 'Age' : 'العمر'}</label>
                        <input type="number" min={14} max={90} placeholder="28" value={data.age} onChange={(e) => set('age', e.target.value)} className={fieldCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{en ? 'Location / Country' : 'البلد / الموقع'}</label>
                        <input type="text" placeholder={en ? 'Cairo, Dubai…' : 'القاهرة، دبي…'} value={data.location} onChange={(e) => set('location', e.target.value)} className={fieldCls} />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Phone / WhatsApp (with country code)' : 'الهاتف / واتساب (مع كود الدولة)'}</label>
                      <input type="tel" placeholder="+20 100 123 4567" value={data.phone} onChange={(e) => set('phone', e.target.value)} className={fieldCls} />
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Email Address' : 'البريد الإلكتروني'}</label>
                      <input type="email" placeholder="client@gmail.com" value={data.email} onChange={(e) => set('email', e.target.value)} className={fieldCls} />
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Body Metrics ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>{en ? 'Height (cm)' : 'الطول (سم)'}</label>
                        <input type="number" min={120} max={230} placeholder="178" value={data.height} onChange={(e) => set('height', e.target.value)} className={fieldCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{en ? 'Weight (kg)' : 'الوزن (كجم)'}</label>
                        <input type="number" min={30} max={250} placeholder="82" value={data.weight} onChange={(e) => set('weight', e.target.value)} className={fieldCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{en ? 'Body Fat %' : 'نسبة الدهون'}</label>
                        <input type="number" min={1} max={60} step={0.1} placeholder="18" value={data.bodyFat} onChange={(e) => set('bodyFat', e.target.value)} className={fieldCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>{en ? 'Sleep Hours / night' : 'ساعات النوم / ليلة'}</label>
                        <input type="number" min={1} max={24} step={0.5} placeholder="8" value={data.sleepHours} onChange={(e) => set('sleepHours', e.target.value)} className={fieldCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{en ? 'Sleep Quality (1–10)' : 'جودة النوم (١–١٠)'}</label>
                        <input type="number" min={1} max={10} placeholder="7" value={data.sleepQuality} onChange={(e) => set('sleepQuality', e.target.value)} className={fieldCls} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Fitness Profile ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>{en ? 'Target Goal' : 'الهدف'}</label>
                      <div className="space-y-2">
                        {GOALS.map((g) => <CheckOption key={g} type="radio" label={g} checked={data.targetGoal === g} onChange={() => set('targetGoal', g)} />)}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Daily Activity Level' : 'مستوى النشاط اليومي'}</label>
                      <div className="space-y-2">
                        {ACTIVITIES.map((a) => <CheckOption key={a} type="radio" label={a} checked={data.dailyActivity === a} onChange={() => set('dailyActivity', a)} />)}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Exact Training Days / Week (1–7)' : 'أيام التمرين الأسبوعية (١–٧)'}</label>
                      <input type="number" min={1} max={7} placeholder="4" value={data.trainingDays} onChange={(e) => set('trainingDays', e.target.value)} className={fieldCls} />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>{en ? 'Bench Press (kg)' : 'الضغة (كجم)'}</label>
                        <input type="number" min={0} step={0.5} placeholder="80" value={data.benchPressMax} onChange={(e) => set('benchPressMax', e.target.value)} className={fieldCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{en ? 'Back Squats (kg)' : 'السكوات (كجم)'}</label>
                        <input type="number" min={0} step={0.5} placeholder="100" value={data.squatsMax} onChange={(e) => set('squatsMax', e.target.value)} className={fieldCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{en ? 'Barbell Rows (kg)' : 'التجديف (كجم)'}</label>
                        <input type="number" min={0} step={0.5} placeholder="80" value={data.barbellRowsMax} onChange={(e) => set('barbellRowsMax', e.target.value)} className={fieldCls} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Health & History ── */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <label className={labelCls}>{en ? 'Medical Conditions / Allergies?' : 'مشكلات صحية أو حساسية؟'}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Yes', 'No'] as const).map((v) => (
                          <CheckOption key={v} type="radio"
                            label={en ? (v === 'Yes' ? 'Yes, I have' : 'No') : (v === 'Yes' ? 'نعم، لدي' : 'لا')}
                            checked={data.medicalConditions === v}
                            onChange={() => set('medicalConditions', v)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Tried Online Coaching Before?' : 'جربت الكوتشنج أونلاين من قبل؟'}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Yes', 'No'] as const).map((v) => (
                          <CheckOption key={v} type="radio"
                            label={en ? (v === 'Yes' ? 'Yes, I have' : 'No') : (v === 'Yes' ? 'نعم، جربت' : 'لا')}
                            checked={data.onlineCoachingExp === v}
                            onChange={() => set('onlineCoachingExp', v)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Desired Cardio Machines' : 'أجهزة الكارديو المفضلة'}</label>
                      <div className="space-y-2">
                        {CARDIO_MACHINES.map((m) => (
                          <CheckOption key={m} label={m} checked={data.cardioMachines.includes(m)} onChange={() => toggleArr('cardioMachines', m)} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 5: Extra Info ── */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <label className={labelCls}>{en ? 'Selected Package' : 'الباقة المختارة'}</label>
                      <div className="space-y-2">
                        {PACKAGES.map((p) => (
                          <CheckOption key={p} type="radio" label={p} checked={data.selectedTier === p} onChange={() => set('selectedTier', p)} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'How did you find us?' : 'كيف وجدتنا؟'}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {REACH_SOURCES.map((s) => (
                          <CheckOption key={s} type="radio" label={s} checked={data.reachSource === s} onChange={() => set('reachSource', s)} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{en ? 'Why did you decide to subscribe?' : 'لماذا قررت الاشتراك؟'}</label>
                      <textarea
                        rows={4}
                        placeholder={en ? 'Tell us what motivated you…' : 'أخبرنا ما الذي دفعك لذلك…'}
                        value={data.subscriptionReason}
                        onChange={(e) => set('subscriptionReason', e.target.value)}
                        className={cn(fieldCls, 'resize-none min-h-[110px]')}
                      />
                    </div>
                  </div>
                )}

                {/* ── STEP 6: Nutrition Preferences ── */}
                {step === 6 && (
                  <div className="space-y-7">
                    {[
                      { emoji: '🥩', labelEn: 'Proteins', labelAr: 'البروتينات', key: 'proteins' as const, opts: PROTEIN_OPTIONS },
                      { emoji: '🍚', labelEn: 'Carbs', labelAr: 'الكربوهيدرات', key: 'carbs' as const, opts: CARB_OPTIONS },
                      { emoji: '🍎', labelEn: 'Fruits', labelAr: 'الفواكه', key: 'fruits' as const, opts: FRUIT_OPTIONS },
                      { emoji: '🥦', labelEn: 'Vegetables', labelAr: 'الخضروات', key: 'veggies' as const, opts: VEGGIE_OPTIONS },
                      { emoji: '🥑', labelEn: 'Healthy Fats', labelAr: 'الدهون الصحية', key: 'healthyFats' as const, opts: FAT_OPTIONS },
                    ].map(({ emoji, labelEn, labelAr, key, opts }) => (
                      <div key={key}>
                        <label className={labelCls}>
                          {emoji} {en ? labelEn : labelAr}{' '}
                          <span className="text-neutral-600 normal-case">({en ? 'pick your favorites' : 'اختر المفضلة'})</span>
                        </label>
                        <div className="space-y-2">
                          {opts.map((o) => (
                            <CheckOption key={o} label={o} checked={(data[key] as string[]).includes(o)} onChange={() => toggleArr(key, o)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="py-3.5 px-6 min-h-[50px] text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-800 hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    {en ? '← Back' : '→ السابق'}
                  </button>
                )}

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="flex-1 py-3.5 min-h-[50px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] transition-colors cursor-pointer"
                  >
                    {en ? 'Continue →' : '→ التالي'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 py-4 min-h-[52px] text-sm font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] shadow-[0_0_24px_rgba(140,255,219,0.35)] transition-colors cursor-pointer"
                  >
                    {en ? '📲 Submit via WhatsApp →' : '📲 إرسال عبر واتساب ←'}
                  </button>
                )}
              </div>

              {/* Step dots (mobile) */}
              <div className="flex justify-center gap-1.5 mt-5">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStep(i + 1)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all cursor-pointer',
                      i + 1 === step ? 'bg-[#8cffdb] w-4' : i + 1 < step ? 'bg-[#8cffdb]/50' : 'bg-neutral-700'
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            /* ── Confirmation ── */
            <div className="text-center py-16 space-y-7">
              <div className="w-20 h-20 mx-auto bg-[#8cffdb]/10 border-2 border-[#8cffdb] flex items-center justify-center text-3xl text-[#8cffdb]">
                ✓
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-[#8cffdb] tracking-widest mb-2">
                  {en ? 'APPLICATION SUBMITTED' : 'تم إرسال الاستمارة'}
                </div>
                <h2 className={cn('text-3xl font-black text-white', en ? 'font-sport' : 'font-cairo')}>
                  {en ? 'WhatsApp Opened!' : 'تم فتح واتساب!'}
                </h2>
                <p className="mt-3 text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  {en
                    ? `Thank you, ${data.name || 'client'}. Your full application has been sent to Dr. Ahmed Assem via WhatsApp.`
                    : `شكراً ${data.name || ''}. تم إرسال استمارتك الكاملة لدكتور أحمد عاصم عبر الواتساب.`}
                </p>
              </div>

              <div className="p-5 bg-[#0c0f0d] border border-neutral-800 text-start text-xs font-mono space-y-2 max-w-xs mx-auto">
                {[
                  [en ? 'Name' : 'الاسم', data.name],
                  [en ? 'Package' : 'الباقة', data.selectedTier],
                  [en ? 'Goal' : 'الهدف', data.targetGoal],
                  [en ? 'Email' : 'البريد', data.email || 'N/A'],
                  [en ? 'SLA' : 'وقت الرد', 'Within 24 Hours'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <span className="text-neutral-500">{k}:</span>
                    <span className="text-white font-bold text-end truncate">{v}</span>
                  </div>
                ))}
              </div>

              {data.email && (
                <div className="max-w-xs mx-auto text-xs text-neutral-400 bg-[#0f1411] border border-neutral-800 p-3 rounded text-center">
                  ✉ {en ? 'A confirmation email was sent to ' : 'تم إرسال رسالة تأكيد إلى '}
                  <span className="text-[#8cffdb] font-bold">{data.email}</span>.
                  <div className="mt-1 text-[11px] text-neutral-500">
                    {en ? 'Official correspondence:' : 'البريد الرسمي:'}{' '}
                    <a href="mailto:info@drahmedassem.com" className="text-neutral-300 hover:text-[#8cffdb] underline">
                      info@drahmedassem.com
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-3 max-w-xs mx-auto w-full">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(data))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 py-4 min-h-[52px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] transition-colors cursor-pointer"
                >
                  💬 {en ? 'Resend via WhatsApp' : 'إعادة الإرسال عبر واتساب'}
                </a>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white cursor-pointer border border-neutral-800 hover:border-neutral-600 transition-colors"
                >
                  {en ? '← Back to Site' : '→ العودة للموقع'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
