import React, { useState } from 'react';
import { TransformationItem } from '../types';
import physiqueTransformationShowcaseImg from '../assets/images/physique_transformation_showcase_1791556772517.jpg';

interface TransformationsProps {
  onOpenConsultation: () => void;
}

const TRANSFORMATIONS_DATA: TransformationItem[] = [
  {
    id: 'kareem-m',
    name: 'Kareem M.',
    category: 'recomp',
    durationWeeks: 16,
    weightDelta: '-11.5 kg',
    bodyFatDelta: '23.8% → 9.4%',
    muscleDelta: '+4.8 kg Lean Mass',
    highlight: 'Full metabolic recomposition with normalized lipid panel and liver enzymes.',
    clientQuote:
      'Working with a physician who is also an IFBB Pro changed everything. Dr. Ahmed fixed my sluggish digestion and tailored my refeeds so I was never brain-fogged during work.',
    location: 'Dubai, UAE',
    keyStrategy: [
      'Carb cycling synchronized with heavy squat and deadlift days',
      'Clinical thyroid (Free T3) preservation through planned refeeds',
      'Orthopedic exercise adjustments for prior shoulder impingement',
    ],
  },
  {
    id: 'omar-h',
    name: 'Omar H.',
    category: 'fat_loss',
    durationWeeks: 20,
    weightDelta: '-22.0 kg',
    bodyFatDelta: '31.2% → 12.8%',
    muscleDelta: 'Preserved 100% Lean Tissue',
    highlight: 'Reversed pre-diabetic markers while shedding 22kg of visceral adipose tissue.',
    clientQuote:
      'I thought I was just genetically unlucky with my slow metabolism. Dr. Assem reviewed my bloodwork, diagnosed my subclinical insulin resistance, and gave me a protocol that melted fat effortlessly.',
    location: 'Cairo, Egypt',
    keyStrategy: [
      'Post-meal glycemic stabilization walks & berberine optimization',
      'High satiety nutrient-dense whole food prescription',
      'Step-wise 200kcal deficits preventing metabolic down-regulation',
    ],
  },
  {
    id: 'tarek-s',
    name: 'Tarek S.',
    category: 'contest_prep',
    durationWeeks: 24,
    weightDelta: '-14.0 kg',
    bodyFatDelta: '16.5% → 4.8%',
    muscleDelta: '1st Place Men’s Physique Regional',
    highlight: 'Peak stage conditioning achieved without kidney or electrolyte stress.',
    clientQuote:
      'Most prep coaches ruin their athletes with extreme water cuts and diuretics. Dr. Assem used medical precision for water and sodium loading. I came in full, vascular, and healthy.',
    location: 'Riyadh, Saudi Arabia',
    keyStrategy: [
      'Sodium-potassium pump calibration for peak vascular fullness',
      'Weekly stage posing video breakdown and posture symmetry audits',
      'Meticulous post-show reverse diet avoiding metabolic rebound',
    ],
  },
  {
    id: 'nour-e',
    name: 'Nour E.',
    category: 'recomp',
    durationWeeks: 18,
    weightDelta: '-7.2 kg',
    bodyFatDelta: '27.4% → 16.2%',
    muscleDelta: '+3.1 kg Lower Body Hypertrophy',
    highlight: 'Female athletic transformation with optimized hormonal balance.',
    clientQuote:
      'Every other coach put me on 1,000 calories and hours of cardio until my cycle stopped. Dr. Ahmed restored my energy, boosted my calories to 1,900, and sculpted my physique.',
    location: 'London, UK',
    keyStrategy: [
      'Menstrual cycle phase-adapted training and recovery volume',
      'Glute and posterior chain mechanical tension focus',
      'Cortisol reduction protocol with sleep architecture tracking',
    ],
  },
];

export const Transformations: React.FC<TransformationsProps> = ({ onOpenConsultation }) => {
  const [filter, setFilter] = useState<'all' | 'fat_loss' | 'recomp' | 'contest_prep'>('all');
  const [selectedItem, setSelectedItem] = useState<TransformationItem | null>(null);

  const filteredItems = TRANSFORMATIONS_DATA.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="transformations" className="py-20 md:py-28 bg-[#090b0a] border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wider text-[var(--primary)] uppercase mb-3">
              Documented Client Outcomes
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]">
              Over 500 Real Medical & Physique Transformations
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
              Every client trajectory is documented with physiological data, before-and-after biometrics, and bloodwork parameters. Real people, verifiable results.
            </p>
          </div>

          {/* Interactive Filter Tabs (Buttons with click handlers) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121614] border border-neutral-800 self-start md:self-end">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === 'all'
                  ? 'bg-[var(--primary)] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('recomp')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === 'recomp'
                  ? 'bg-[var(--primary)] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Recomp
            </button>
            <button
              type="button"
              onClick={() => setFilter('fat_loss')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === 'fat_loss'
                  ? 'bg-[var(--primary)] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Fat Loss
            </button>
            <button
              type="button"
              onClick={() => setFilter('contest_prep')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === 'contest_prep'
                  ? 'bg-[var(--primary)] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Contest Prep
            </button>
          </div>
        </div>

        {/* Featured Showcase Banner */}
        <div className="mb-12 bg-[#0e1210] border border-neutral-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 relative h-72 lg:h-full min-h-[300px]">
            <img
              src={physiqueTransformationShowcaseImg}
              alt="Elite athletic muscular conditioning showcase"
              className="w-full h-full object-cover filter brightness-95"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-[#0e1210] lg:opacity-100 opacity-60"
              aria-hidden="true"
            />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--primary)] mb-2">
                <span>Featured Trajectory</span>
                <span className="text-neutral-600">·</span>
                <span>Sub-10% Body Fat Milestone</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Precision Conditioning Without Muscle Loss
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                Notice the vascular fullness, separation, and deep abdominal density. Under Dr. Assem&apos;s medical direction, aggressive body fat reductions are engineered alongside glycogen replenishment protocols that preserve dry lean mass.
              </p>

              <div className="grid grid-cols-3 gap-4 pb-6 border-b border-neutral-800 font-mono">
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase">Body Fat</div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--primary)] mt-0.5 tabular-nums">9.4%</div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase">Duration</div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">16 Wks</div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase">Strength</div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">+15%</div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-neutral-400">
                Client: Kareem M. · Dubai Executive
              </span>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors"
              >
                Start Your Protocol
              </button>
            </div>
          </div>
        </div>

        {/* Case Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f1311] border border-neutral-800 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                {/* Unboxed Metadata (Zero-pill discipline) */}
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-3 font-mono">
                  <span className="text-[var(--primary)] font-bold uppercase">
                    {item.category.replace('_', ' ')}
                  </span>
                  <span>{item.durationWeeks} Weeks</span>
                </div>

                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <div className="text-xs text-neutral-400 mt-0.5 mb-4">{item.location}</div>

                {/* Quantitative Delta Box */}
                <div className="p-3 bg-[#151a17] border border-neutral-800/90 mb-4 space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Weight Shift:</span>
                    <span className="text-white font-bold tabular-nums">{item.weightDelta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Body Fat:</span>
                    <span className="text-[var(--primary)] font-bold tabular-nums">{item.bodyFatDelta}</span>
                  </div>
                  {item.muscleDelta && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Muscle:</span>
                      <span className="text-white font-bold">{item.muscleDelta}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-neutral-300 italic leading-relaxed line-clamp-3 mb-4">
                  &ldquo;{item.clientQuote}&rdquo;
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="w-full py-2 text-center text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors"
                >
                  View Clinical Strategy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for In-depth Clinical Strategy */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0f1311] border border-neutral-700 max-w-lg w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono uppercase text-[var(--primary)]">
                    Clinical Case Breakdown · {selectedItem.durationWeeks} Weeks
                  </div>
                  <h3 className="text-2xl font-display font-black text-white mt-1">
                    {selectedItem.name} — {selectedItem.location}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-neutral-400 hover:text-white p-1"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-[#151a17] border border-neutral-800 text-xs font-mono grid grid-cols-2 gap-2">
                <div>
                  <span className="text-neutral-400 block">Weight Change</span>
                  <span className="text-white font-bold text-sm">{selectedItem.weightDelta}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Body Composition</span>
                  <span className="text-[var(--primary)] font-bold text-sm">{selectedItem.bodyFatDelta}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Physician Protocol Strategy
                </h4>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {selectedItem.keyStrategy.map((strat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--primary)] font-mono font-bold">›</span>
                      <span>{strat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    onOpenConsultation();
                  }}
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider text-black bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                >
                  Apply for a Similar Protocol
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
