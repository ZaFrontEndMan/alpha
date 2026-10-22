import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { translations, Language } from '../translations';
import { cn } from '../utils/cn';

type PaymentMethod = 'card' | 'cash';

interface PaymentCheckoutProps {
  lang: Language;
  onToggleLang: () => void;
}

const PACKAGE_IDS = new Set(['starter', 'elite', 'alpha-vip', 'consultation']);

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ lang, onToggleLang }) => {
  const navigate = useNavigate();
  const en = lang === 'en';
  const t = translations[lang];
  const packageId = new URLSearchParams(window.location.search).get('package') ?? 'elite';
  const selectedPackage = t.packages.items.find((item) => item.id === packageId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!PACKAGE_IDS.has(packageId) || !selectedPackage) {
      setError(en ? 'This package is unavailable.' : 'هذه الباقة غير متاحة.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/paymob/create-payment-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, method, name, email, phone }),
      });
      const result = await response.json() as { paymentUrl?: string; error?: string };
      if (!response.ok || !result.paymentUrl) {
        throw new Error(result.error || 'Unable to start payment.');
      }
      window.location.assign(result.paymentUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : (en ? 'Unable to start payment.' : 'تعذر بدء الدفع.'));
      setIsSubmitting(false);
    }
  };

  if (!selectedPackage) {
    return <div className="min-h-screen bg-[#090b0a] text-white grid place-items-center p-6">
      <button type="button" onClick={() => navigate('/')} className="text-[#8cffdb] underline">{en ? 'Return to packages' : 'العودة إلى الباقات'}</button>
    </div>;
  }

  const fieldClass = 'w-full min-h-[48px] bg-[#0f1311] border border-neutral-800 text-white px-4 text-sm focus:border-[#8cffdb] focus:outline-none placeholder:text-neutral-600';

  return (
    <div className={cn('min-h-screen bg-[#090b0a] text-neutral-100', en ? 'font-sans' : 'font-cairo')}>
      <header className="border-b border-neutral-800 bg-[#090b0a]/95">
        <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between gap-4">
          <button type="button" onClick={() => navigate('/#packages')} className="text-sm text-neutral-400 hover:text-white cursor-pointer">← {en ? 'Back to packages' : 'العودة للباقات'}</button>
          <BrandLogo size={34} />
          <button type="button" onClick={onToggleLang} className="text-xs font-bold text-neutral-300 border border-neutral-700 px-3 py-2 cursor-pointer">{en ? 'عربي' : 'EN'}</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-xs font-mono font-bold tracking-widest text-[#8cffdb] uppercase mb-3">{en ? 'Secure checkout' : 'دفع آمن'}</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{en ? 'Complete your payment' : 'أكمل عملية الدفع'}</h1>
        <p className="text-sm text-neutral-400 mb-8">{en ? 'Your card details are entered securely on Paymob.' : 'يتم إدخال بيانات البطاقة بأمان على Paymob.'}</p>

        <div className="border border-[#8cffdb]/40 bg-[#111713] p-5 mb-6 flex items-start justify-between gap-4">
          <div><div className="font-bold text-white">{selectedPackage.name}</div><div className="text-xs text-neutral-400 mt-1">{en ? 'Paymob processes this payment in EGP.' : 'تتم معالجة الدفع بالجنيه المصري عبر Paymob.'}</div></div>
          <div className="font-mono font-black text-xl text-[#8cffdb] whitespace-nowrap">{selectedPackage.priceNumeric.toLocaleString()} EGP</div>
        </div>

        <form onSubmit={startPayment} className="border border-neutral-800 bg-[#0f1311] p-5 sm:p-7 space-y-5">
          <label className="block text-xs font-bold text-neutral-300">{en ? 'Full name' : 'الاسم بالكامل'}<input required value={name} onChange={(event) => setName(event.target.value)} className={`${fieldClass} mt-2`} autoComplete="name" /></label>
          <label className="block text-xs font-bold text-neutral-300">{en ? 'Email address' : 'البريد الإلكتروني'}<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`${fieldClass} mt-2`} autoComplete="email" /></label>
          <label className="block text-xs font-bold text-neutral-300">{en ? 'Phone number with country code' : 'رقم الهاتف مع كود الدولة'}<input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={`${fieldClass} mt-2`} placeholder="+20..." autoComplete="tel" /></label>

          <fieldset><legend className="text-xs font-bold text-neutral-300 mb-2">{en ? 'Payment method' : 'طريقة الدفع'}</legend><div className="grid grid-cols-2 gap-3">
            {(['card', 'cash'] as PaymentMethod[]).map((option) => <button key={option} type="button" onClick={() => setMethod(option)} className={cn('min-h-[48px] border text-sm font-bold cursor-pointer', method === option ? 'border-[#8cffdb] bg-[#8cffdb]/10 text-[#8cffdb]' : 'border-neutral-700 text-neutral-300')}>
              {option === 'card' ? (en ? 'Card' : 'بطاقة') : (en ? 'Cash / kiosk' : 'نقدي / كشك')}
            </button>)}
          </div></fieldset>

          {error && <p role="alert" className="text-sm text-red-300 bg-red-950/40 border border-red-900 p-3">{error}</p>}
          <button disabled={isSubmitting} type="submit" className="w-full min-h-[52px] bg-[#8cffdb] text-black font-black text-sm uppercase tracking-wider hover:bg-[#77d9ba] disabled:opacity-60 cursor-pointer disabled:cursor-wait">{isSubmitting ? (en ? 'Preparing secure payment…' : 'جارٍ تجهيز الدفع الآمن…') : (en ? 'Pay now' : 'ادفع الآن')}</button>
        </form>
      </main>
    </div>
  );
};
