import React from 'react';
import clinicalMetabolicLabImg from '../assets/images/clinical_metabolic_lab_1791556783263.jpg';
import precisionNutritionProtocolImg from '../assets/images/precision_nutrition_protocol_1791556794751.jpg';

export const Methodology: React.FC = () => {
  return (
    <section id="methodology" className="py-20 md:py-28 bg-[#090b0a] border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold tracking-wider text-[var(--primary)] uppercase mb-3">
            The Scientific Blueprint
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]">
            The 4 Clinical Pillars of the Dr. Assem System
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            Conventional fitness relies on generic templates copied from social media. Our methodology is built like a medical treatment plan: diagnostic intake, biomarker calibration, periodized biomechanics, and continuous physiological feedback.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Card 1: Clinical Blood & Hormonal Profiling (Spans 7 cols) */}
          <div className="md:col-span-12 lg:col-span-7 bg-[#0f1311] border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[var(--primary)] tracking-wider uppercase">
                  01. Diagnostics
                </span>
                <span className="text-xs text-neutral-400">Pre & Post Bloodwork Audits</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Clinical Endocrinology & Biomarker Profiling
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                Before adjusting a single calorie, Dr. Assem reviews full lab work: thyroid panels (TSH, Free T3/T4), metabolic fasting glucose, lipid profiles, liver enzymes, and free/total testosterone. We optimize your internal biochemistry to accelerate fat oxidation and prevent adrenal exhaustion.
              </p>
            </div>

            <div className="relative overflow-hidden border border-neutral-800/80 h-56 sm:h-64 mt-4">
              <img
                src={clinicalMetabolicLabImg}
                alt="Sports science metabolic and biomarker clinical testing lab"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#090b0a]/90 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs font-mono text-neutral-300">
                <span>Thyroid · Cortisol · Lipids</span>
                <span className="text-[var(--primary)] font-semibold">Zero Guesswork</span>
              </div>
            </div>
          </div>

          {/* Card 2: Precision Biomechanics & Hypertrophy (Spans 5 cols) */}
          <div className="md:col-span-12 lg:col-span-5 bg-[#0f1311] border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[var(--primary)] tracking-wider uppercase">
                  02. Biomechanics
                </span>
                <span className="text-xs text-neutral-400">IFBB Pro Mechanics</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Stimulus-to-Fatigue Hypertrophy Protocols
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                More volume is not better—efficient stimulus is. Using elite IFBB Pro resistance curves, movement selection aligns with your specific limb lengths, clavicle width, and orthopedic tolerances to maximize muscle cross-sectional growth without destructive joint wear.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 bg-[#151a17] border border-neutral-800 flex items-start gap-3 text-xs text-neutral-300">
                  <span className="text-[var(--primary)] font-mono font-bold">✓</span>
                  <div>
                    <strong className="text-white block">Mechanical Tension Tracking:</strong>
                    Standardized repetition tempos, pause reps, and RPE/RIR calibrated sets.
                  </div>
                </div>
                <div className="p-3 bg-[#151a17] border border-neutral-800 flex items-start gap-3 text-xs text-neutral-300">
                  <span className="text-[var(--primary)] font-mono font-bold">✓</span>
                  <div>
                    <strong className="text-white block">Video Form Correction:</strong>
                    Direct biomechanical video breakdown for compound lifts.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span>Periodization: Mesocycle Waves</span>
              <span className="text-white font-medium">Deload Synchronized</span>
            </div>
          </div>

          {/* Card 3: Tailored Nutritional Biochemistry (Spans 5 cols) */}
          <div className="md:col-span-12 lg:col-span-5 bg-[#0f1311] border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[var(--primary)] tracking-wider uppercase">
                  03. Nutrition
                </span>
                <span className="text-xs text-neutral-400">Metabolic Calibration</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Nutritional Biochemistry & Carb Cycling
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                Dieting should preserve metabolic rate, not crush it. We leverage insulin sensitivity windows, intra-workout nutrient partitioning, and cyclical refeeds to maintain leptin levels and thyroid output throughout deep cutting phases.
              </p>
            </div>

            <div className="relative overflow-hidden border border-neutral-800/80 h-56 mt-4">
              <img
                src={precisionNutritionProtocolImg}
                alt="Precision athlete nutrition and meal preparation protocol"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#090b0a]/90 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs font-mono text-neutral-300">
                <span>Leptin & Insulin Timing</span>
                <span className="text-[var(--primary)] font-semibold">Macro Precision</span>
              </div>
            </div>
          </div>

          {/* Card 4: 1-on-1 Doctor Oversight & Biofeedback (Spans 7 cols) */}
          <div className="md:col-span-12 lg:col-span-7 bg-[#0f1311] border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[var(--primary)] tracking-wider uppercase">
                  04. Accountability
                </span>
                <span className="text-xs text-neutral-400">Doctor 1-on-1 Line</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Weekly Doctor Video Check-Ins & Real-Time Biofeedback
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                You work directly with Dr. Ahmed Assem—never an outsourced assistant or intern coach. Weekly biometric audits track weight velocity, resting heart rate, HRV trends, gastrointestinal digestion, and sleep hygiene. If a plateau occurs, variables are altered proactively.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 bg-[#151a17] border border-neutral-800">
                  <div className="text-xs font-mono text-[var(--primary)] uppercase">Weekly Video</div>
                  <div className="text-sm font-bold text-white mt-1">Direct Consultation</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Face-to-face progress review</div>
                </div>

                <div className="p-4 bg-[#151a17] border border-neutral-800">
                  <div className="text-xs font-mono text-[var(--primary)] uppercase">Direct Line</div>
                  <div className="text-sm font-bold text-white mt-1">Priority WhatsApp</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Real-time daily adjustments</div>
                </div>

                <div className="p-4 bg-[#151a17] border border-neutral-800">
                  <div className="text-xs font-mono text-[var(--primary)] uppercase">Safety First</div>
                  <div className="text-sm font-bold text-white mt-1">Organ & Liver Audits</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Clinical physician supervision</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span>Alpha Team Portal & Dedicated Client App</span>
              <span className="text-[var(--primary)] font-mono">100% Doctor Accountability</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
