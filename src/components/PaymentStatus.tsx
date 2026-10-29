import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  CreditCard,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Language, translations } from '../translations';
import { cn } from '../utils/cn';
import { WhatsappIcon } from './WhatsappIcon';

interface PaymentStatusProps {
  status?: 'success' | 'failed' | 'pending';
  lang: Language;
  onToggleLang: () => void;
}

const WHATSAPP_NUMBER = '201158997825';

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status: forcedStatus,
  lang,
  onToggleLang,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  const en = lang === 'en';
  const t = translations[lang];

  // Parse all query parameters from Paymob callback
  const searchParams = new URLSearchParams(location.search);
  const transactionId = searchParams.get('id') || searchParams.get('transaction_id') || '';
  const orderId = searchParams.get('order') || searchParams.get('order_id') || '';
  const merchantOrderId = searchParams.get('merchant_order_id') || '';
  const amountCentsRaw = searchParams.get('amount_cents') || searchParams.get('amount_cents_int') || '';
  const currency = searchParams.get('currency') || 'EGP';
  const successParam = searchParams.get('success');
  const pendingParam = searchParams.get('pending');
  const rawMessage = searchParams.get('data.message') || searchParams.get('message') || searchParams.get('error') || '';
  const cardPan = searchParams.get('source_data.pan') || searchParams.get('pan') || '';
  const cardSubType = searchParams.get('source_data.sub_type') || searchParams.get('sub_type') || '';
  const cardType = searchParams.get('source_data.type') || searchParams.get('type') || '';
  const createdAt = searchParams.get('created_at') || '';
  const txnCode = searchParams.get('txn_response_code') || '';
  const acqCode = searchParams.get('acq_response_code') || '';
  const packageParam = searchParams.get('package') || '';

  // Determine effective status
  let effectiveStatus: 'success' | 'failed' | 'pending' = 'failed';
  if (forcedStatus) {
    effectiveStatus = forcedStatus;
  } else if (successParam === 'true' && pendingParam !== 'true') {
    effectiveStatus = 'success';
  } else if (pendingParam === 'true') {
    effectiveStatus = 'pending';
  } else if (successParam === 'false') {
    effectiveStatus = 'failed';
  } else if (location.pathname.toLowerCase().includes('success')) {
    effectiveStatus = 'success';
  } else if (location.pathname.toLowerCase().includes('pending')) {
    effectiveStatus = 'pending';
  } else {
    effectiveStatus = 'failed';
  }

  // Calculate human amount
  const amountNumeric = amountCentsRaw ? parseInt(amountCentsRaw, 10) / 100 : null;

  // Resolve matching package
  let matchedPackage = t.packages.items.find((item) => item.id === packageParam);
  if (!matchedPackage && amountNumeric) {
    matchedPackage = t.packages.items.find((item) => Math.abs(item.priceNumeric - amountNumeric) < 5);
  }

  const packageName = matchedPackage?.name || (amountNumeric ? `${amountNumeric.toLocaleString()} ${currency}` : (en ? 'Transformation Coaching' : 'برنامج التدريب والمتابعة'));

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Humanize common Paymob failure messages
  const getHumanizedMessage = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes('risk')) {
      return {
        title: en ? 'Security Risk Check Declined' : 'لم تجتز المعاملة فحص الأمان للبنك',
        desc: en
          ? 'The card-issuing bank or payment gateway flagged this transaction during automated risk checks. This frequently happens if international/online transactions are restricted or if the bank requires explicit customer confirmation.'
          : 'قام البنك المصدر للبطاقة أو بوابة الدفع بتعليق المعاملة خلال فحص الحماية الآلي. يحدث هذا عادةً إذا كانت مدفوعات الإنترنت مقيدة على بطاقتك أو تتطلب موافقة يدوية من تطبيق البنك.',
        tips: en
          ? ['Try another debit/credit card', 'Call your bank to authorize transactions for Paymob', 'Contact us via WhatsApp for instant InstaPay or Vodafone Cash transfer']
          : ['جرّب بطاقة بنكية أخرى (ائتمانية أو خصم مباشر)', 'تواصل مع البنك لتفعيل الشراء عبر الإنترنت أو رفع حد المعاملات', 'تواصل معنا مباشرة عبر واتساب للتحويل الفوري عبر إنستاباي أو فودافون كاش'],
      };
    }
    if (lower.includes('declined') || lower.includes('rejected')) {
      return {
        title: en ? 'Transaction Declined by Bank' : 'تم رفض العملية من البنك',
        desc: en
          ? 'Your issuing bank declined the charge. Please check your available balance, card limits, or card expiration date.'
          : 'رفض البنك المصدر للبطاقة العملية. يرجى التأكد من توفر الرصيد الكافي وصلاحية البطاقة.',
        tips: en
          ? ['Ensure sufficient account balance', 'Check your online daily spending limit', 'Pay via InstaPay or Vodafone Cash']
          : ['تأكد من وجود رصيد كافٍ بالحساب', 'تحقق من الحد اليومي للشراء عبر الإنترنت', 'الدفع عبر إنستاباي أو فودافون كاش'],
      };
    }
    if (lower.includes('insufficient')) {
      return {
        title: en ? 'Insufficient Funds' : 'رصيد الحساب غير كافٍ',
        desc: en
          ? 'The card does not have sufficient balance to cover the package fee.'
          : 'لا يتوفر رصيد كافٍ في البطاقة لتغطية قيمة الاشتراك.',
        tips: en
          ? ['Top up your bank account and retry', 'Use another payment card', 'Contact support for flexible payment options']
          : ['قم بتغذية الحساب وإعادة المحاولة', 'استخدم بطاقة دفع أخرى', 'تواصل مع الدعم لخيارات الدفع المتاحة'],
      };
    }
    if (lower.includes('expired')) {
      return {
        title: en ? 'Card Expired' : 'البطاقة منتهية الصلاحية',
        desc: en ? 'The card entered has expired.' : 'تاريخ صلاحية البطاقة المدخلة منتهٍ.',
        tips: en
          ? ['Check the expiry date and retry with a valid card']
          : ['يرجى استخدام بطاقة سارية المفعول'],
      };
    }
    return {
      title: en ? 'Payment Incomplete' : 'لم تكتمل عملية الدفع',
      desc: msg || (en ? 'The payment could not be processed at this time.' : 'تعذر إتمام عملية الدفع في الوقت الحالي.'),
      tips: en
        ? ['Verify your card details and balance', 'Try using a different card or browser', 'Contact support for instant alternative payment (InstaPay / Cash)']
        : ['تأكد من صحة بيانات البطاقة والرصيد', 'جرّب بطاقة أخرى أو متصفحاً مختلفاً', 'تواصل مع الدعم للدفع الفوري عبر إنستاباي أو كاش'],
    };
  };

  const humanized = getHumanizedMessage(rawMessage);

  // Pre-filled WhatsApp message
  const getWhatsAppMessage = () => {
    const ref = merchantOrderId || orderId || transactionId || 'N/A';
    if (effectiveStatus === 'success') {
      return en
        ? `Hello Dr. Ahmed Assem! I have successfully paid for the ${packageName} (Reference: ${ref}). Please guide me through my onboarding!`
        : `أهلاً د. أحمد عاصم! قمت بالدفع وتأكيد الاشتراك بنجاح في ${packageName} (رقم المرجع: ${ref}). في انتظار خطوات البدء والمتابعة!`;
    }
    if (effectiveStatus === 'pending') {
      return en
        ? `Hello Dr. Ahmed Assem! My payment for ${packageName} is currently pending (Reference: ${ref}). Could you please verify the status?`
        : `أهلاً د. أحمد عاصم! معاملة الدفع الخاصة بي لـ ${packageName} معلقة حالياً (رقم المرجع: ${ref}). يرجى التحقق من الحالة.`;
    }
    return en
      ? `Hello Dr. Ahmed Assem! My online card payment for ${packageName} was not completed (Reference: ${ref}${rawMessage ? `, Note: ${rawMessage}` : ''}). Can I complete the subscription via InstaPay, Vodafone Cash, or direct bank transfer?`
      : `أهلاً د. أحمد عاصم! لم تكتمل عملية الدفع الإلكتروني لباقة ${packageName} (رقم المرجع: ${ref}${rawMessage ? `، ملاحظة: ${rawMessage}` : ''}). هل يمكنني استكمال الاشتراك والتحويل عبر إنستاباي (InstaPay) أو فودافون كاش؟`;
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  // Retry checkout link
  const retryPackageId = matchedPackage?.id || packageParam || 'starter';
  const retryUrl = `/checkout?package=${encodeURIComponent(retryPackageId)}`;

  return (
    <div
      className={cn(
        'min-h-screen bg-[#090b0a] text-neutral-100 flex flex-col selection:bg-[#8cffdb] selection:text-black',
        en ? 'font-sans' : 'font-cairo'
      )}
    >
      {/* Top Header */}
      <header className="border-b border-neutral-800/80 bg-[#090b0a]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {en ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            <span>{en ? 'Back to home' : 'الرئيسية'}</span>
          </button>

          <BrandLogo size={34} />

          <button
            type="button"
            onClick={onToggleLang}
            className="text-xs font-bold text-neutral-300 border border-neutral-700 hover:border-[#8cffdb] hover:text-[#8cffdb] px-3 py-1.5 transition-colors cursor-pointer"
          >
            {en ? 'عربي' : 'EN'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Glow ambient effect */}
        <div className="relative">
          <div
            className={cn(
              'absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[110px] pointer-events-none opacity-40',
              effectiveStatus === 'success' && 'bg-[#8cffdb]',
              effectiveStatus === 'failed' && 'bg-rose-500',
              effectiveStatus === 'pending' && 'bg-amber-400'
            )}
          />

          {/* Hero Status Card */}
          <div
            className={cn(
              'relative rounded-2xl border p-6 sm:p-10 text-center backdrop-blur-xl transition-all',
              effectiveStatus === 'success' && 'border-[#8cffdb]/40 bg-[#0c1410]/95 shadow-[0_0_50px_rgba(140,255,219,0.12)]',
              effectiveStatus === 'failed' && 'border-rose-500/40 bg-[#140b0d]/95 shadow-[0_0_50px_rgba(244,63,94,0.12)]',
              effectiveStatus === 'pending' && 'border-amber-400/40 bg-[#14120b]/95 shadow-[0_0_50px_rgba(251,191,36,0.12)]'
            )}
          >
            {/* Status Icon with concentric glowing rings */}
            <div className="flex justify-center mb-6">
              <div
                className={cn(
                  'relative w-20 h-20 rounded-full flex items-center justify-center border',
                  effectiveStatus === 'success' && 'border-[#8cffdb]/60 bg-[#8cffdb]/10 text-[#8cffdb]',
                  effectiveStatus === 'failed' && 'border-rose-500/60 bg-rose-500/10 text-rose-400',
                  effectiveStatus === 'pending' && 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-full animate-ping opacity-25',
                    effectiveStatus === 'success' && 'bg-[#8cffdb]',
                    effectiveStatus === 'failed' && 'bg-rose-500',
                    effectiveStatus === 'pending' && 'bg-amber-400'
                  )}
                />
                {effectiveStatus === 'success' && <CheckCircle2 className="w-10 h-10 relative z-10" />}
                {effectiveStatus === 'failed' && <XCircle className="w-10 h-10 relative z-10" />}
                {effectiveStatus === 'pending' && <Clock className="w-10 h-10 relative z-10" />}
              </div>
            </div>

            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-widest mb-4 border">
              {effectiveStatus === 'success' && (
                <span className="text-[#8cffdb] border-[#8cffdb]/30 bg-[#8cffdb]/10 px-3 py-1 rounded-full">
                  {en ? 'Payment Confirmed' : 'تم استلام وتأكيد الدفع'}
                </span>
              )}
              {effectiveStatus === 'failed' && (
                <span className="text-rose-400 border-rose-500/30 bg-rose-500/10 px-3 py-1 rounded-full">
                  {en ? 'Payment Unsuccessful' : 'لم تكتمل المعاملة'}
                </span>
              )}
              {effectiveStatus === 'pending' && (
                <span className="text-amber-300 border-amber-400/30 bg-amber-400/10 px-3 py-1 rounded-full">
                  {en ? 'Pending Processing' : 'قيد المراجعة والمعالجة'}
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              {effectiveStatus === 'success' && (en ? 'Welcome to Dr. Ahmed Assem’s Team!' : 'أهلاً بك في فريق د. أحمد عاصم!')}
              {effectiveStatus === 'failed' && humanized.title}
              {effectiveStatus === 'pending' && (en ? 'Payment is Pending Confirmation' : 'المعاملة قيد التأكيد')}
            </h1>

            {/* Sub-description */}
            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed mb-6">
              {effectiveStatus === 'success' &&
                (en
                  ? 'Your payment was processed successfully. Our coaching and medical team will contact you within 24 hours to begin your tailored protocol.'
                  : 'تم استلام وتأكيد دفعتك بنجاح. سيتواصل معك الفريق الطبي والتدريبي خلال 24 ساعة للبدء في خطتك المخصصة.')}
              {effectiveStatus === 'failed' && humanized.desc}
              {effectiveStatus === 'pending' &&
                (en
                  ? 'Your transaction is being confirmed by the payment gateway or bank.'
                  : 'معاملتك قيد التأكيد من قِبل بوابة الدفع أو البنك.')}
            </p>

            {/* Package & Amount Highlight Banner */}
            <div className="border border-neutral-800 bg-[#090c0a]/80 rounded-xl p-4 sm:p-5 max-w-lg mx-auto flex items-center justify-between gap-4 text-start">
              <div>
                <div className="text-[0.7rem] uppercase tracking-wider text-neutral-400 font-bold">
                  {en ? 'Package' : 'الباقة المحددة'}
                </div>
                <div className="font-bold text-white text-base sm:text-lg mt-0.5">{packageName}</div>
              </div>
              {amountNumeric && (
                <div className="text-end">
                  <div className="text-[0.7rem] uppercase tracking-wider text-neutral-400 font-bold">
                    {en ? 'Amount' : 'المبلغ'}
                  </div>
                  <div className="font-mono font-black text-lg sm:text-xl text-[#8cffdb] whitespace-nowrap">
                    {amountNumeric.toLocaleString()} {currency}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Receipt & Transaction Metadata */}
        {(transactionId || orderId || merchantOrderId || cardPan || cardSubType) && (
          <div className="mt-6 border border-neutral-800 bg-[#0f1311] rounded-2xl p-5 sm:p-7">
            <h2 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#8cffdb]" />
              <span>{en ? 'Transaction Details' : 'تفاصيل المعاملة'}</span>
            </h2>

            <div className="divide-y divide-neutral-800/80 text-sm">
              {merchantOrderId && (
                <div className="py-3 flex items-center justify-between gap-3">
                  <span className="text-neutral-400 text-xs sm:text-sm">{en ? 'Order Reference' : 'رقم مرجع الطلب'}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs sm:text-sm">{merchantOrderId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(merchantOrderId, 'merchant_order_id')}
                      className="p-1 hover:text-[#8cffdb] text-neutral-400 transition-colors cursor-pointer"
                      title={en ? 'Copy reference' : 'نسخ رقم المرجع'}
                    >
                      {copiedField === 'merchant_order_id' ? <Check className="w-3.5 h-3.5 text-[#8cffdb]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {transactionId && (
                <div className="py-3 flex items-center justify-between gap-3">
                  <span className="text-neutral-400 text-xs sm:text-sm">{en ? 'Transaction ID' : 'رقم المعاملة (Paymob ID)'}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs sm:text-sm">{transactionId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(transactionId, 'transaction_id')}
                      className="p-1 hover:text-[#8cffdb] text-neutral-400 transition-colors cursor-pointer"
                      title={en ? 'Copy ID' : 'نسخ رقم المعاملة'}
                    >
                      {copiedField === 'transaction_id' ? <Check className="w-3.5 h-3.5 text-[#8cffdb]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {cardPan && (
                <div className="py-3 flex items-center justify-between gap-3">
                  <span className="text-neutral-400 text-xs sm:text-sm">{en ? 'Payment Method' : 'وسيلة الدفع'}</span>
                  <span className="font-medium text-white text-xs sm:text-sm flex items-center gap-1.5">
                    {cardSubType && <span className="uppercase font-bold text-neutral-300">{cardSubType}</span>}
                    <span className="font-mono text-neutral-400">•••• {cardPan}</span>
                  </span>
                </div>
              )}

              {createdAt && (
                <div className="py-3 flex items-center justify-between gap-3">
                  <span className="text-neutral-400 text-xs sm:text-sm">{en ? 'Timestamp' : 'تاريخ وتوقيت المحاولة'}</span>
                  <span className="font-mono text-neutral-300 text-xs sm:text-sm">
                    {new Date(createdAt).toLocaleString(en ? 'en-US' : 'ar-EG')}
                  </span>
                </div>
              )}

              {(txnCode || acqCode) && (
                <div className="py-3 flex items-center justify-between gap-3">
                  <span className="text-neutral-400 text-xs sm:text-sm">{en ? 'Response Codes' : 'رموز الاستجابة'}</span>
                  <span className="font-mono text-xs text-neutral-400">
                    TXN: {txnCode || '-'} | ACQ: {acqCode || '-'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="mt-8 space-y-3 sm:space-y-4">
          {/* Success actions */}
          {effectiveStatus === 'success' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[50px] bg-[#8cffdb] text-black font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-[#77d9ba] flex items-center justify-center gap-2 rounded-xl transition-all shadow-[0_0_25px_rgba(140,255,219,0.3)] cursor-pointer"
              >
                <WhatsappIcon className="w-4 h-4 shrink-0 text-black" />
                <span>{en ? 'Chat on WhatsApp to Start' : 'تواصل مع د. أحمد عبر واتساب'}</span>
              </a>

              <button
                type="button"
                onClick={() => navigate('/form')}
                className="min-h-[50px] bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-colors cursor-pointer"
              >
                <span>{en ? 'Complete Intake Form' : 'تعبئة استمارة المشترك'}</span>
                {en ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Failed actions */}
          {effectiveStatus === 'failed' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate(retryUrl)}
                  className="min-h-[50px] bg-[#8cffdb] text-black font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-[#77d9ba] flex items-center justify-center gap-2 rounded-xl transition-all shadow-[0_0_20px_rgba(140,255,219,0.2)] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{en ? 'Retry Payment / Change Card' : 'إعادة المحاولة / تغيير البطاقة'}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[50px] bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366]/30 text-[#8cffdb] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-colors cursor-pointer"
                >
                  <WhatsappIcon className="w-4 h-4 shrink-0 text-[#25D366]" />
                  <span>{en ? 'Pay via InstaPay / WhatsApp' : 'الدفع عبر إنستاباي / واتساب'}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => navigate('/#packages')}
                className="w-full min-h-[44px] text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                ← {en ? 'View all packages' : 'استعراض جميع الباقات'}
              </button>
            </div>
          )}

          {/* Pending actions */}
          {effectiveStatus === 'pending' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-[50px] bg-[#fbbf24] text-black font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-[#f59e0b] flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{en ? 'Refresh Status' : 'تحديث حالة المعاملة'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[50px] bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-colors cursor-pointer"
              >
                <WhatsappIcon className="w-4 h-4 shrink-0 text-[#8cffdb]" />
                <span>{en ? 'Contact Support on WhatsApp' : 'مساعدة عبر واتساب'}</span>
              </a>
            </div>
          )}
        </div>

        {/* Troubleshooting & Direct Payment Guidance Box for Failed */}
        {effectiveStatus === 'failed' && (
          <div className="mt-8 border border-neutral-800 bg-[#0f1311] rounded-2xl p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setShowTroubleshooting((prev) => !prev)}
              className="w-full flex items-center justify-between text-start cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-neutral-200">
                <HelpCircle className="w-4 h-4 text-[#8cffdb]" />
                <span>{en ? 'Why did my payment fail? Quick solutions' : 'لماذا لم تكتمل العملية؟ حلول سريعة'}</span>
              </div>
              {showTroubleshooting ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {showTroubleshooting && (
              <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-4 text-xs sm:text-sm text-neutral-300">
                <p className="leading-relaxed">
                  {en
                    ? 'Card transactions can fail for several standard banking reasons:'
                    : 'قد تفشل عمليات الدفع الإلكتروني لأسباب مصرفية شائعة، مثل:'}
                </p>

                <ul className="list-disc ps-5 space-y-2 text-neutral-400">
                  {humanized.tips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed text-neutral-300">
                      {tip}
                    </li>
                  ))}
                  <li className="leading-relaxed text-neutral-300">
                    {en
                      ? 'Daily e-commerce spending limit on your card (you can raise it instantly from your bank app).'
                      : 'الحد اليومي للشراء عبر الإنترنت للبطاقة (يمكنك رفعه بلحظة من تطبيق البنك الخاص بك).'}
                  </li>
                  <li className="leading-relaxed text-neutral-300">
                    {en
                      ? 'Delayed 3D Secure OTP verification SMS from your telecom provider.'
                      : 'تأخر وصول كود التحقق الأمني (OTP) في رسالة الـ SMS من شبكة المحمول.'}
                  </li>
                </ul>

                <div className="rounded-xl border border-[#8cffdb]/30 bg-[#8cffdb]/5 p-3 sm:p-4 text-neutral-300">
                  <div className="font-bold text-[#8cffdb] mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{en ? 'Alternative Direct Methods' : 'طرق دفع بديلة ومباشرة'}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {en
                      ? 'We accept direct InstaPay transfers, Vodafone Cash, and direct bank deposits. Message us on WhatsApp to receive the account details immediately.'
                      : 'نقبل التحويل الفوري عبر إنستاباي (InstaPay) ومحافظ فودافون كاش والإيداع البنكي المباشر. تواصل معنا على واتساب لتزويدك ببيانات التحويل فوراً.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
