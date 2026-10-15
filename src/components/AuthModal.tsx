import React, { useState } from 'react';
import { TranslationContent, Language } from '../translations';
import { BrandLogo } from './BrandLogo';
import { cn } from '../utils/cn';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  lang: Language;
  t: TranslationContent;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  lang,
  t,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0f0d] border border-neutral-700 max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 end-6 text-neutral-400 hover:text-white p-1 text-sm font-mono cursor-pointer"
          aria-label="Close modal"
        >
          ✕ ESC
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <BrandLogo size={42} className="justify-center mb-3" />
          <h3 className={cn(
            "text-2xl font-black text-white",
            lang === 'en' ? 'font-sport' : 'font-cairo'
          )}>
            {mode === 'login' ? t.auth.loginTitle : t.auth.registerTitle}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {lang === 'en'
              ? 'Access your customized Alpha workout & nutrition dashboard'
              : 'ادخل لحسابك لمتابعة خطتك وجداول تمارينك وماكروز وجباتك'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#141a16] border border-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={cn(
              "py-2 text-xs font-bold uppercase transition-colors cursor-pointer",
              mode === 'login'
                ? "bg-[var(--primary)] text-black shadow-sm font-black"
                : "text-neutral-400 hover:text-white"
            )}
          >
            {t.nav.login}
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={cn(
              "py-2 text-xs font-bold uppercase transition-colors cursor-pointer",
              mode === 'register'
                ? "bg-[var(--primary)] text-black shadow-sm font-black"
                : "text-neutral-400 hover:text-white"
            )}
          >
            {t.nav.register}
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-[var(--primary)]/10 border border-[var(--primary)] flex items-center justify-center text-xl text-[var(--primary)] font-mono">
              ✓
            </div>
            <h4 className="text-lg font-bold text-white">
              {mode === 'login'
                ? (lang === 'en' ? 'Welcome Back!' : 'أهلاً بك مجدداً!')
                : (lang === 'en' ? 'Account Created Successfully!' : 'تم إنشاء حسابك بنجاح!')}
            </h4>
            <p className="text-xs text-neutral-400">
              {lang === 'en' ? 'Redirecting to your Alpha Portal...' : 'جاري نقلك لمنصة المتدربين...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    {t.auth.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ahmed Elsissy"
                    className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    {t.auth.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 100 123 4567"
                    className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs font-mono focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.auth.email}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@drahmedassem.com"
                className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.auth.password}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121614] border border-neutral-800 text-white p-3 text-xs font-mono focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 text-xs font-black uppercase tracking-wider text-black bg-[var(--primary)] hover:bg-[var(--primary-hover)] cursor-pointer min-h-[44px]"
              >
                {mode === 'login' ? t.auth.submitLogin : t.auth.submitRegister}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-neutral-400 hover:text-[var(--primary)] transition-colors"
              >
                {mode === 'login' ? t.auth.noAccount : t.auth.haveAccount}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
