import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Copy, Check, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { translations, Language } from '../translations';
import { cn } from '../utils/cn';
import instapayIcon from '../assets/images/instapay.png';
import { WhatsappIcon } from './WhatsappIcon';

type PaymentMethod = 'card' | 'instapay';

interface PaymentCheckoutProps {
  lang: Language;
  onToggleLang: () => void;
}

const PACKAGE_IDS = new Set(['starter', 'elite', 'alpha-vip', 'consultation']);
const INSTAPAY_NUMBER = '01063920763';
const WHATSAPP_NUMBER = '201063920763';

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
  const [copiedNumber, setCopiedNumber] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(INSTAPAY_NUMBER);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  const startPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!PACKAGE_IDS.has(packageId) || !selectedPackage) {
      setError(en ? 'This package is unavailable.' : 'هذه الباقة غير متاحة.');
      return;
    }

    if (method === 'instapay') {
      const waMsg = en
        ? `Hello Dr. Ahmed Assem! I have transferred ${selectedPackage.priceNumeric.toLocaleString()} EGP via InstaPay to ${INSTAPAY_NUMBER} for the "${selectedPackage.name}" package.\n\nClient Details:\n• Name: ${name.trim()}\n• Phone: ${phone.trim()}\n• Email: ${email.trim()}\n\nAttaching transfer receipt now!`
        : `أهلاً د. أحمد عاصم! قمت بتحويل ${selectedPackage.priceNumeric.toLocaleString()} جنيه مصري عبر إنستاباي إلى ${INSTAPAY_NUMBER} للاشتراك في باقة "${selectedPackage.name}".\n\nبيانات المشترك:\n• الاسم: ${name.trim()}\n• الهاتف: ${phone.trim()}\n• الإيميل: ${email.trim()}\n\nمرفق صورة إيصال التحويل الآن!`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`, '_blank');
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
    return (
      <div className="min-h-screen bg-[#090b0a] text-white grid place-items-center p-6">
        <button type="button" onClick={() => navigate('/')} className="text-[#8cffdb] underline">
          {en ? 'Return to packages' : 'العودة إلى الباقات'}
        </button>
      </div>
    );
  }

  const fieldClass =
    'w-full min-h-[48px] bg-[#0f1311] border border-neutral-800 text-white px-4 text-sm focus:border-[#8cffdb] focus:outline-none placeholder:text-neutral-600 rounded-lg transition-colors';

  return (
    <div className={cn('min-h-screen bg-[#090b0a] text-neutral-100 flex flex-col', en ? 'font-sans' : 'font-cairo')}>
      <header className="border-b border-neutral-800 bg-[#090b0a]/95 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/#packages')}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {en ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            <span>{en ? 'Back to packages' : 'العودة للباقات'}</span>
          </button>
          <BrandLogo size={34} />
          <button
            type="button"
            onClick={onToggleLang}
            className="text-xs font-bold text-neutral-300 border border-neutral-700 hover:border-[#8cffdb] hover:text-[#8cffdb] px-3 py-1.5 transition-colors cursor-pointer rounded"
          >
            {en ? 'عربي' : 'EN'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10 sm:py-14">
        <div className="text-xs font-mono font-bold tracking-widest text-[#8cffdb] uppercase mb-2">
          {en ? 'Secure Checkout' : 'دفع آمن ومباشر'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">
          {en ? 'Complete your payment' : 'أكمل عملية الاشتراك والدفع'}
        </h1>
        <p className="text-sm text-neutral-400 mb-6">
          {method === 'instapay'
            ? en
              ? 'Instant transfer via InstaPay app directly to Dr. Ahmed Assem.'
              : 'تحويل لحظي مباشر عبر تطبيق إنستاباي لحساب د. أحمد عاصم.'
            : en
              ? 'Your payment details are entered securely via Paymob.'
              : 'تتم معالجة بيانات الدفع بأعلى معايير الأمان عبر Paymob.'}
        </p>

        {/* Selected Package Banner */}
        <div className="border border-[#8cffdb]/40 bg-[#111713] rounded-xl p-5 mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="font-bold text-white text-base sm:text-lg">{selectedPackage.name}</div>
            <div className="text-xs text-neutral-400 mt-1">
              {method === 'instapay'
                ? en
                  ? 'Zero transaction fees via InstaPay'
                  : 'بدون أي رسوم إضافية عبر إنستاباي'
                : en
                  ? 'Paymob processes this payment securely in EGP.'
                  : 'تتم معالجة الدفع بالجنيه المصري عبر Paymob بأمان.'}
            </div>
          </div>
          <div className="font-mono font-black text-xl text-[#8cffdb] whitespace-nowrap">
            {selectedPackage.priceNumeric.toLocaleString()} EGP
          </div>
        </div>

        <form onSubmit={startPayment} className="border border-neutral-800 bg-[#0f1311] rounded-2xl p-5 sm:p-7 space-y-5">
          {/* 1. Payment Method Tabs at the very top of the form */}
          <fieldset>
            <legend className="text-xs font-bold text-neutral-300 mb-2.5">
              {en ? '1. Select payment method' : '١. اختر وسيلة الدفع'}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Card Option */}
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={cn(
                  'min-h-[52px] px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer',
                  method === 'card'
                    ? 'border-[#8cffdb] bg-[#8cffdb]/10 text-[#8cffdb] shadow-[0_0_15px_rgba(140,255,219,0.15)]'
                    : 'border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600'
                )}
              >
                <CreditCard className="w-4 h-4" />
                <span>{en ? 'Credit / Debit Card' : 'بطاقة بنكية'}</span>
              </button>

              {/* InstaPay Option */}
              <button
                type="button"
                onClick={() => setMethod('instapay')}
                className={cn(
                  'min-h-[52px] px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative',
                  method === 'instapay'
                    ? 'border-[#a855f7] bg-[#a855f7]/15 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600'
                )}
              >
                <img src={instapayIcon} alt="InstaPay" className="h-5 w-auto object-contain" />
                <span>{en ? 'InstaPay' : 'إنستاباي'}</span>
              </button>
            </div>
          </fieldset>

          {/* 2. InstaPay Transfer Details Box (Shown when InstaPay is active) */}
          {method === 'instapay' && (
            <div className="border border-[#a855f7]/40 bg-[#170e1c] rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between gap-3 border-b border-[#a855f7]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <img src={instapayIcon} alt="InstaPay" className="h-6 w-auto object-contain" />
                  <span className="font-bold text-white text-sm sm:text-base">
                    {en ? 'InstaPay Transfer Details' : 'بيانات التحويل عبر إنستاباي'}
                  </span>
                </div>
                <span className="text-[0.65rem] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#a855f7]/20 text-[#d8b4fe] border border-[#a855f7]/30">
                  {en ? 'Instant Transfer' : 'تحويل فوري'}
                </span>
              </div>

              {/* Prominent Number & Copy Action */}
              <div className="border border-neutral-700/80 bg-[#090b0a] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[0.7rem] uppercase tracking-wider text-neutral-400 font-bold">
                    {en ? 'InstaPay Mobile Number' : 'رقم الهاتف المسجل على إنستاباي'}
                  </div>
                  <div className="font-mono font-black text-2xl text-white tracking-wider mt-0.5 select-all">
                    {INSTAPAY_NUMBER}
                  </div>
                  <div className="text-xs text-[#d8b4fe] mt-0.5 font-medium">
                    {en ? 'Recipient: Dr. Ahmed Assem' : 'اسم المستلم: د. أحمد عاصم'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className={cn(
                    'min-h-[42px] px-4 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto',
                    copiedNumber
                      ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                      : 'bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  )}
                >
                  {copiedNumber ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNumber ? (en ? 'Number Copied!' : 'تم نسخ الرقم!') : (en ? 'Copy Number' : 'نسخ الرقم')}</span>
                </button>
              </div>

              {/* Steps Guide */}
              <div className="space-y-2 text-xs sm:text-sm text-neutral-300">
                <div className="font-bold text-neutral-200">
                  {en ? 'Quick instructions:' : 'خطوات التحويل والتأكيد:'}
                </div>
                <ol className="list-decimal ps-5 space-y-1.5 text-neutral-300 leading-relaxed text-xs">
                  <li>
                    {en
                      ? `Open your InstaPay app, select "Send Money" to Mobile Number, and enter ${INSTAPAY_NUMBER}.`
                      : `افتح تطبيق إنستاباي، اختر "إرسال نقود" لرقم هاتف، وأدخل الرقم ${INSTAPAY_NUMBER}.`}
                  </li>
                  <li>
                    {en
                      ? `Transfer the exact package amount: ${selectedPackage.priceNumeric.toLocaleString()} EGP.`
                      : `قم بتحويل قيمة الباقة: ${selectedPackage.priceNumeric.toLocaleString()} ج.م.`}
                  </li>
                  <li>
                    {en
                      ? 'Take a screenshot of the successful transfer receipt.'
                      : 'التقط صورة لإيصال التحويل الناجح.'}
                  </li>
                  <li>
                    {en
                      ? 'Fill your contact details below and click the button to send the receipt on WhatsApp to activate immediately.'
                      : 'أدخل بياناتك بالأسفل ثم اضغط لتأكيد الاشتراك وإرسال الإيصال عبر واتساب للتفعيل الفوري.'}
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* 3. Client Information Inputs */}
          <div className="pt-2 border-t border-neutral-800/80 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {en ? '2. Your details' : '٢. بيانات المشترك'}
            </div>

            <label className="block text-xs font-bold text-neutral-300">
              {en ? 'Full name' : 'الاسم بالكامل'}
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={`${fieldClass} mt-2`}
                autoComplete="name"
                placeholder={en ? 'e.g. Mohamed Ali' : 'مثال: محمد علي'}
              />
            </label>

            <label className="block text-xs font-bold text-neutral-300">
              {en ? 'Email address' : 'البريد الإلكتروني'}
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${fieldClass} mt-2`}
                autoComplete="email"
                placeholder="name@example.com"
              />
            </label>

            <label className="block text-xs font-bold text-neutral-300">
              {en ? 'Phone number with country code' : 'رقم الهاتف مع كود الدولة'}
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={`${fieldClass} mt-2`}
                placeholder="+20..."
                autoComplete="tel"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-lg p-3">
              {error}
            </p>
          )}

          {/* Submit Button */}
          {method === 'instapay' ? (
            <button
              type="submit"
              className="w-full min-h-[52px] bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <WhatsappIcon className="w-5 h-5 shrink-0" />
              <span>{en ? 'Confirm on WhatsApp & Send Receipt' : 'تأكيد التحويل عبر واتساب وإرسال الإيصال'}</span>
            </button>
          ) : (
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full min-h-[52px] bg-[#8cffdb] text-black font-black text-sm uppercase tracking-wider hover:bg-[#77d9ba] disabled:opacity-60 cursor-pointer disabled:cursor-wait rounded-xl transition-all shadow-[0_0_20px_rgba(140,255,219,0.25)] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? en
                    ? 'Preparing secure payment…'
                    : 'جارٍ تجهيز الدفع الآمن…'
                  : en
                    ? 'Proceed to Paymob'
                    : 'المتابعة إلى بوابة الدفع'}
              </span>
            </button>
          )}
        </form>
      </main>
    </div>
  );
};
