import React, { useState } from 'react';
import { CoachingTier } from '../types';

interface CoachingTiersProps {
  onSelectTier: (tierName: string) => void;
}

type Currency = 'USD' | 'EGP' | 'AED' | 'SAR' | 'EUR';

const EXCHANGE_RATES: Record<Currency, { rate: number; symbol: string; suffix?: string }> = {
  USD: { rate: 1, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  EGP: { rate: 49.5, symbol: 'E£' },
  AED: { rate: 3.67, symbol: 'AED ' },
  SAR: { rate: 3.75, symbol: 'SAR ' },
};

const TIERS: CoachingTier[] = [
  {
    id: '12_week_recomp',
    name: '12-Week Recomposition',
    subtitle: 'Foundation Physique & Metabolic Acceleration',
    duration: '12 Weeks Protocol',
    basePriceUSD: 450,
    features: [
      'Comprehensive intake & body metric analysis',
      'Personalized periodized lifting program (RPE/RIR)',
      'Custom macro prescription with flexible meal options',
      'Bi-weekly check-in with measurement & photo audit',
      'Supplement safety & foundational vitamin stack',
      'Access to Alpha Team mobile workout portal',
    ],
    deliverables: {
      bloodwork: 'Basic metabolic intake audit',
      nutrition: 'Targeted caloric progression',
      training: 'Phase 1 & 2 mesocycles',
      communication: 'Alpha Team portal messaging',
    },
  },
  {
    id: '24_week_mastery',
    name: '24-Week Medical Mastery',
    subtitle: 'Comprehensive Endocrinology & IFBB Pro Hypertrophy',
    duration: '24 Weeks Protocol',
    popular: true,
    basePriceUSD: 790,
    features: [
      'Full clinical bloodwork audit (Thyroid, Lipids, Liver, Androgens)',
      'Direct weekly video consultation with Dr. Ahmed Assem',
      'Priority 24/7 direct WhatsApp physician hotline',
      'Carb cycling & peri-workout nutrient timing protocols',
      'Biomechanical compound lift video breakdown',
      'HRV, sleep architecture & biofeedback tracking',
      'Free mid-point protocol recalibration & deload sync',
    ],
    deliverables: {
      bloodwork: 'Comprehensive pre/mid panel reviews',
      nutrition: 'Dynamic carb-cycling waves',
      training: 'Full 4-phase periodized hypertrophy',
      communication: 'Direct doctor WhatsApp + Weekly Zoom',
    },
  },
  {
    id: '36_week_pro_prep',
    name: 'IFBB Pro Contest & Peak Prep',
    subtitle: 'Championship Stage Conditioning & Peak Week Science',
    duration: '36 Weeks / Annual',
    basePriceUSD: 1250,
    features: [
      'Stage-ready sub-5% body fat manipulation protocol',
      'Electrolyte, sodium & potassium pump calibration',
      'Peak week daily protocol audits & water loading strategy',
      'Mandatory posing routine video symmetry critique',
      'Daily WhatsApp direct check-ins during peak weeks',
      'Extensive post-contest reverse diet metabolic recovery',
      'Direct on-call competition day physician availability',
    ],
    deliverables: {
      bloodwork: 'Continuous organ & safety monitoring',
      nutrition: 'Day-by-day peak week carb depletion/loading',
      training: 'Stage symmetry & weakness targeting',
      communication: 'Daily on-call doctor access during peak',
    },
  },
];

export const CoachingTiers: React.FC<CoachingTiersProps> = ({ onSelectTier }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const formatPrice = (usd: number) => {
    const { rate, symbol } = EXCHANGE_RATES[currency];
    const converted = Math.round(usd * rate);
    return `${symbol}${converted.toLocaleString()}`;
  };

  return (
    <section id="coaching-tiers" className="py-20 md:py-28 bg-[#0c0f0d] border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wider text-[#ccff00] uppercase mb-3">
              One-on-One Physician Coaching
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]">
              Elite Coaching Programs & Packages
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
              Every coaching spot is handled directly by Dr. Ahmed Assem. Client capacity is strictly capped to guarantee medical precision, rapid response times, and weekly individual attention.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#121614] border border-neutral-800 self-start md:self-end">
            {(['USD', 'EGP', 'AED', 'SAR', 'EUR'] as Currency[]).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase transition-colors ${
                  currency === curr
                    ? 'bg-[#ccff00] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between p-8 border transition-all ${
                tier.popular
                  ? 'bg-[#101512] border-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.12)] relative'
                  : 'bg-[#090b0a] border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-8 bg-[#ccff00] text-black px-3 py-0.5 text-[11px] font-black uppercase tracking-wider">
                  Recommended · Doctor Flagship
                </div>
              )}

              <div>
                <div className="text-xs font-mono uppercase text-[#ccff00] tracking-wider mb-1">
                  {tier.duration}
                </div>
                <h3 className="font-display text-2xl font-black text-white">
                  {tier.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 mb-6">
                  {tier.subtitle}
                </p>

                {/* Price */}
                <div className="pb-6 mb-6 border-b border-neutral-800">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-black text-white font-mono tabular-nums tracking-tight">
                      {formatPrice(tier.basePriceUSD)}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 uppercase">
                      / Full Program
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Direct physician oversight · No recurring surprise billing
                  </div>
                </div>

                {/* Deliverables Overview */}
                <div className="space-y-3 mb-6 p-3.5 bg-[#141a16] border border-neutral-800/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Doctor Touchpoint:</span>
                    <span className="text-white font-medium text-right">{tier.deliverables.communication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Bloodwork Review:</span>
                    <span className="text-[#ccff00] font-medium text-right">{tier.deliverables.bloodwork}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Diet Strategy:</span>
                    <span className="text-white font-medium text-right">{tier.deliverables.nutrition}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <ul className="space-y-2.5 text-xs text-neutral-300 mb-8">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[#ccff00] font-bold font-mono">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => onSelectTier(tier.name)}
                  className={`w-full py-3.5 text-xs font-black uppercase tracking-wider transition-all ${
                    tier.popular
                      ? 'bg-[#ccff00] text-black hover:bg-[#b5e600] shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                      : 'bg-neutral-900 border border-neutral-700 text-white hover:border-neutral-500 hover:bg-neutral-800'
                  }`}
                >
                  Apply For {tier.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
