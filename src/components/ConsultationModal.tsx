import React, { useState, useEffect } from 'react';
import { ConsultationFormData } from '../types';
import { Language } from '../translations';
import { cn } from '../utils/cn';
import { WhatsappIcon } from './WhatsappIcon';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTier?: string;
  initialMacroSummary?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTier = 'Elite Coaching (7000 EGP)',
  initialMacroSummary = '',
}) => {
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    email: '',
    whatsapp: '',
    country: '',
    age: '28',
    currentWeight: '82',
    targetGoal: 'Fat Loss & 6-Pack Abs',
    experienceLevel: 'Intermediate (2-4 years)',
    hasRecentBloodwork: true,
    medicalConditions: '',
    selectedTier: initialTier,
    preferredTimezone: 'UTC+2 / Cairo (EET)',
  });

  useEffect(() => {
    if (initialTier) {
      setFormData((prev) => ({ ...prev, selectedTier: initialTier }));
    }
  }, [initialTier]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.whatsapp,
          selectedTier: formData.selectedTier,
          targetGoal: formData.targetGoal,
          weight: formData.currentWeight,
          age: formData.age,
          location: formData.country,
          medicalConditions: formData.medicalConditions || (formData.hasRecentBloodwork ? 'Bloodwork available' : 'Needs doctor guidance'),
          customNotes: `Experience: ${formData.experienceLevel}. Timezone: ${formData.preferredTimezone}. Baseline: ${initialMacroSummary || 'None'}`,
        }),
      }).catch((err) => console.warn('Intake email notification warning:', err));
    } catch {
      // background network ignore
    }
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Dr. Ahmed Assem! I have submitted my intake application for ${formData.selectedTier}.
Name: ${formData.fullName}
Goal: ${formData.targetGoal}
Current Weight: ${formData.currentWeight} kg
Recent Bloodwork: ${formData.hasRecentBloodwork ? 'Available' : 'Needs Doctor Guidance'}
${initialMacroSummary ? `Calculated Baseline: ${initialMacroSummary}` : ''}
Looking forward to starting my 90-day transformation!`
  );

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0f0d] border border-neutral-700 max-w-xl w-full p-6 sm:p-8 relative shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 end-6 text-neutral-400 hover:text-white p-1 text-sm font-mono cursor-pointer"
          aria-label="Close modal"
        >
          ✕ ESC
        </button>

        {!submitted ? (
          <div>
            {/* Modal Header */}
            <div className="mb-6 pe-8">
              <div className="text-xs font-mono uppercase text-[#8cffdb] tracking-wider">
                {lang === 'en' ? `Step ${step} of 3 · Physician Intake` : `الخطوة ${step} من 3 · التقييم الطبي`}
              </div>
              <h3 className={cn(
                "text-2xl sm:text-3xl font-black text-white mt-1",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {lang === 'en' ? 'Apply for 1-on-1 Coaching' : 'التقديم على التدريب المباشر'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {lang === 'en'
                  ? 'Dr. Ahmed Assem reviews all intake applications personally to assess medical suitability.'
                  : 'يقوم د. أحمد عاصم بمراجعة كافة الاستمارات شخصياً لتقييم الحالة وتحديد البروتوكول الأنسب.'}
              </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 transition-all ${step >= s ? 'bg-[#8cffdb]' : 'bg-neutral-800'
                    }`}
                />
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Goals & Physical Baseline */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'Selected Package' : 'الباقة المختارة'}
                    </label>
                    <select
                      value={formData.selectedTier}
                      onChange={(e) => setFormData({ ...formData, selectedTier: e.target.value })}
                      className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs focus:border-[#8cffdb] focus:outline-none"
                    >
                      <option value="Transformation System (4500 EGP)">Transformation System (4500.00 EGP)</option>
                      <option value="Elite Coaching (7000 EGP)">Elite Coaching (7000.00 EGP) — Recommended</option>
                      <option value="Dr. Ahmed Assem VIP Medical Mastery (12000 EGP)">Dr. Ahmed Assem VIP Medical Mastery (12000.00 EGP)</option>
                      <option value="1-on-1 Strategy Consultation (2000 EGP)">1-on-1 Strategy Consultation (2000.00 EGP)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Current Weight (kg)' : 'الوزن الحالي (كجم)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.currentWeight}
                        onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                        className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs font-mono focus:border-[#8cffdb] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Age' : 'العمر'}
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs font-mono focus:border-[#8cffdb] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'Primary Goal' : 'الهدف الأساسي'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { en: 'Fat Loss (8-12 kg)', ar: 'خسارة دهون (8-12 كجم)' },
                        { en: 'Shredded Abs & Recomp', ar: 'تقسيم البطن وإعادة تشكيل' },
                        { en: 'Muscle Hypertrophy', ar: 'بناء كتلة عضلية' },
                        { en: 'Contest / Peak Prep', ar: 'بطولات / تحضير مسرح' },
                      ].map((g, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, targetGoal: g.en })}
                          className={`p-2.5 text-xs text-start border transition-colors cursor-pointer min-h-[42px] ${formData.targetGoal === g.en
                              ? 'border-[#8cffdb] bg-[#141a15] text-[#8cffdb] font-bold'
                              : 'border-neutral-800 bg-[#121614] text-neutral-300 hover:text-white'
                            }`}
                        >
                          {lang === 'en' ? g.en : g.ar}
                        </button>
                      ))}
                    </div>
                  </div>

                  {initialMacroSummary && (
                    <div className="p-3 bg-[#151a17] border border-neutral-800 text-xs">
                      <span className="text-neutral-400 block font-mono">
                        {lang === 'en' ? 'Calculator Baseline:' : 'بيانات حاسبة السعرات:'}
                      </span>
                      <span className="text-[#8cffdb] font-bold font-mono">{initialMacroSummary}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 min-h-[48px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] cursor-pointer"
                    >
                      {lang === 'en' ? 'Continue to Medical Profile →' : 'الانتقال للبيانات الطبية ←'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Training & Health History */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'Training Experience' : 'الخبرة في التمرين'}
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs focus:border-[#8cffdb] focus:outline-none"
                    >
                      <option value="Beginner (< 1 year)">Beginner (&lt; 1 year / مبتدئ)</option>
                      <option value="Intermediate (2-4 years)">Intermediate (2-4 years / متوسط)</option>
                      <option value="Advanced (5+ years)">Advanced (5+ years / متقدم أو لاعب بطولة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'Do you have bloodwork from past 6 months?' : 'هل لديك تحاليل دم من الـ 6 أشهر الماضية؟'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, hasRecentBloodwork: true })}
                        className={`flex-1 p-3 text-xs border font-bold transition-colors cursor-pointer min-h-[44px] ${formData.hasRecentBloodwork
                            ? 'border-[#8cffdb] bg-[#141a15] text-[#8cffdb]'
                            : 'border-neutral-800 bg-[#121614] text-neutral-400'
                          }`}
                      >
                        {lang === 'en' ? 'Yes, available' : 'نعم، متوفرة لدي'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, hasRecentBloodwork: false })}
                        className={`flex-1 p-3 text-xs border font-bold transition-colors cursor-pointer min-h-[44px] ${!formData.hasRecentBloodwork
                            ? 'border-[#8cffdb] bg-[#141a15] text-[#8cffdb]'
                            : 'border-neutral-800 bg-[#121614] text-neutral-400'
                          }`}
                      >
                        {lang === 'en' ? 'No, need doctor to order' : 'لا، أريد طلب التحاليل'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'Injuries or Medical Conditions (Optional)' : 'أي إصابات أو مشكلات صحية سابقة (اختياري)'}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.medicalConditions}
                      onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                      placeholder={lang === 'en' ? 'e.g. Lower back stiffness, thyroid issues, food allergies...' : 'مثال: خشونة في الركبة، خمول غدة، حساسية طعام...'}
                      className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs focus:border-[#8cffdb] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3 px-4 min-h-[44px] text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-800 hover:bg-neutral-900 cursor-pointer"
                    >
                      {lang === 'en' ? '← Back' : '→ السابق'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 min-h-[44px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] cursor-pointer"
                    >
                      {lang === 'en' ? 'Next: Contact Info →' : 'التالي: بيانات التواصل ←'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Direct Doctor Line */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'Full Legal Name' : 'الاسم بالكامل'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zeyad Elnamory"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs focus:border-[#8cffdb] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      {lang === 'en' ? 'WhatsApp Number (With Country Code)' : 'رقم الواتساب (مع كود الدولة)'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+20 100 123 4567 or +971 50 123 4567"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs font-mono focus:border-[#8cffdb] focus:outline-none"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      {lang === 'en'
                        ? 'Dr. Ahmed Assem coordinates directly via WhatsApp voice notes and text.'
                        : 'يتم التواصل ومتابعة البرنامج مباشرة عبر الواتساب مع الدكتور.'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs focus:border-[#8cffdb] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                        {lang === 'en' ? 'Country' : 'دولة الإقامة'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Egypt, UAE, Saudi, UK..."
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs focus:border-[#8cffdb] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-3 px-4 min-h-[44px] text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-800 hover:bg-neutral-900 cursor-pointer"
                    >
                      {lang === 'en' ? '← Back' : '→ السابق'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 min-h-[48px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] shadow-[0_0_20px_rgba(140,255,219,0.3)] cursor-pointer"
                    >
                      {lang === 'en' ? 'Submit Intake Application →' : 'إرسال الاستمارة الطبية ←'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          /* Submission Confirmation */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 mx-auto bg-[#8cffdb]/10 border border-[#8cffdb] flex items-center justify-center text-2xl text-[#8cffdb]">
              ✓
            </div>

            <div>
              <div className="text-xs font-mono uppercase text-[#8cffdb] tracking-wider mb-1">
                {lang === 'en' ? 'APPLICATION CONFIRMED' : 'تم استلام الاستمارة بنجاح'}
              </div>
              <h3 className={cn(
                "text-2xl sm:text-3xl font-black text-white",
                lang === 'en' ? 'font-sport' : 'font-cairo'
              )}>
                {lang === 'en' ? 'Intake Assessment Received' : 'تم إرسال بياناتك للدكتور'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed">
                {lang === 'en'
                  ? `Thank you, ${formData.fullName}. Dr. Ahmed Assem has received your biometrics for ${formData.selectedTier}.`
                  : `شكراً لك يا ${formData.fullName}. استلم د. أحمد عاصم بياناتك وسيتم التواصل معك مباشرة.`}
              </p>
            </div>

            <div className="p-4 bg-[#121614] border border-neutral-800 text-start text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">{lang === 'en' ? 'Package:' : 'الباقة:'}</span>
                <span className="text-white font-bold">{formData.selectedTier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">{lang === 'en' ? 'Target:' : 'الهدف:'}</span>
                <span className="text-[#8cffdb] font-bold">{formData.targetGoal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">{lang === 'en' ? 'SLA:' : 'وقت الرد:'}</span>
                <span className="text-white font-bold">Within 24 Hours</span>
              </div>
            </div>

            {/* Direct WhatsApp Fast-Track Button */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/201158997825?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 py-3.5 min-h-[48px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] cursor-pointer"
              >
                <WhatsappIcon className="w-4 h-4 shrink-0 text-black" />
                <span>{lang === 'en' ? 'Fast-Track via WhatsApp Direct' : 'محادثة سريعة عبر الواتساب مباشرة'}</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white cursor-pointer min-h-[40px]"
              >
                {lang === 'en' ? 'Close & Return to Site' : 'إغلاق والعودة للموقع'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
