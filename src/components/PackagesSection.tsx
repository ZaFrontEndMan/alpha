import React, { useState } from 'react';
import { TranslationContent, Language } from '../translations';
import { cn } from '../utils/cn';

interface PackagesSectionProps {
  t: TranslationContent;
  lang: Language;
  onSelectPackage: (packageName: string) => void;
}

type CurrencyChoice = 'EGP' | 'USD' | 'AED' | 'SAR';

const RATES: Record<CurrencyChoice, { rate: number; label: string }> = {
  EGP: { rate: 1, label: 'EGP' },
  USD: { rate: 1 / 49.5, label: 'USD' },
  AED: { rate: 3.67 / 49.5, label: 'AED' },
  SAR: { rate: 3.75 / 49.5, label: 'SAR' },
};

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  t,
  lang,
  onSelectPackage,
}) => {
  const [currency, setCurrency] = useState<CurrencyChoice>('EGP');

  const formatPrice = (baseEgp: number) => {
    if (currency === 'EGP') {
      return `${baseEgp.toFixed(2)} EGP`;
    }
    const converted = Math.round(baseEgp * RATES[currency].rate);
    return `${converted.toLocaleString()} ${RATES[currency].label}`;
  };

  return (
    <section id="packages" className="py-20 md:py-28 section-blend @container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-3xl">
            <div className="text-xs font-bold tracking-widest text-[#8cffdb] uppercase mb-3">
              {t.packages.tag}
            </div>
            <h2 className={cn(
              "text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]",
              lang === 'en' ? 'font-sport' : 'font-cairo'
            )}>
              {t.packages.heading}
            </h2>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#121614] border border-neutral-800 self-start md:self-end">
            {(['EGP', 'USD', 'AED', 'SAR'] as CurrencyChoice[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors min-h-[36px] cursor-pointer",
                  currency === c
                    ? "bg-[#8cffdb] text-black shadow-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Main Coaching Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-10">
          {t.packages.items.slice(0, 3).map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                "p-8 border flex flex-col justify-between transition-all relative",
                pkg.popular
                  ? "bg-[#111713] border-[#8cffdb] shadow-[0_0_30px_rgba(140,255,219,0.12)]"
                  : "bg-[#090b0a] border-neutral-800 hover:border-neutral-700"
              )}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3.5 start-8 bg-[#8cffdb] text-black px-3.5 py-0.5 text-[11px] font-black uppercase tracking-wider">
                  {lang === 'en' ? 'RECOMMENDED · ELITE' : 'الباقة الأكثر طلباً · تميز'}
                </div>
              )}

              <div>
                <h3 className={cn(
                  "text-2xl font-black text-white mb-2",
                  lang === 'en' ? 'font-sport' : 'font-cairo'
                )}>
                  {pkg.name}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed min-h-[3rem] mb-6">
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div className="pb-6 mb-6 border-b border-neutral-800">
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums text-[#8cffdb]">
                    {formatPrice(pkg.priceNumeric)}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    {lang === 'en'
                      ? 'All-inclusive medical coaching protocol'
                      : 'إشراف طبي وتدريبي كامل متكامل'}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-neutral-300 mb-8">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#8cffdb] font-bold font-mono text-sm shrink-0">✓</span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onSelectPackage(pkg.name)}
                  className={cn(
                    "w-full py-3.5 px-4 min-h-[44px] text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center",
                    pkg.popular
                      ? "bg-[#8cffdb] text-black hover:bg-[#77d9ba] shadow-[0_0_20px_rgba(140,255,219,0.3)]"
                      : "bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-500"
                  )}
                >
                  {lang === 'en' ? `SELECT ${pkg.name.toUpperCase()}` : `اشترك في ${pkg.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 4th Package: 1-on-1 Consultation Session Card */}
        {t.packages.items.length >= 4 && (
          <div className="bg-[#121614] border border-neutral-800 p-8 sm:p-10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="text-xs font-mono font-bold text-[#8cffdb] uppercase tracking-wider mb-2">
                  {lang === 'en' ? 'PRIVATE 1-ON-1 STRATEGY CALL' : 'جلسة استشارية خاصة فردية'}
                </div>
                <h3 className={cn(
                  "text-2xl sm:text-3xl font-black text-white mb-2",
                  lang === 'en' ? 'font-sport' : 'font-cairo'
                )}>
                  {t.packages.items[3].name} — {formatPrice(t.packages.items[3].priceNumeric)}
                </h3>
                <p className="text-sm text-neutral-300 mb-4 max-w-2xl leading-relaxed">
                  {t.packages.items[3].description}
                </p>

                {t.packages.items[3].note && (
                  <div className="p-3 bg-[#18201a] border border-[#8cffdb]/30 text-xs text-[#8cffdb] font-semibold mb-6">
                    {t.packages.items[3].note}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-medium">
                  {t.packages.items[3].features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#8cffdb] font-mono font-bold">›</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center items-stretch lg:items-end">
                <button
                  type="button"
                  onClick={() => onSelectPackage(t.packages.items[3].name)}
                  className="w-full sm:w-auto px-8 py-4 min-h-[48px] text-xs font-black uppercase tracking-wider text-black bg-[#8cffdb] hover:bg-[#77d9ba] transition-colors cursor-pointer text-center"
                >
                  {lang === 'en' ? 'BOOK STRATEGY CALL' : 'احجز جلستك الآن'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
