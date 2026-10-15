"use client";
import React, { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'What makes Dr. Ahmed Assem’s coaching different from conventional online trainers?',
    a: 'Dr. Ahmed Assem is both a practicing Medical Doctor (M.D.) and an IFBB Pro athlete. Most online coaches rely on generic regurgitated routines with zero medical understanding of endocrine biochemistry, organ safety, or metabolic adaptation. Dr. Assem custom-designs your training, nutrition, and supplementation around your real blood markers, preserving hormonal health while accelerating hypertrophy and fat oxidation.',
  },
  {
    q: 'How does the medical bloodwork review work if I live outside Egypt or the Middle East?',
    a: 'Over 65% of Alpha Team clients reside in the UK, USA, UAE, Saudi Arabia, and Europe. Dr. Assem will provide you with a standardized laboratory requisition checklist (Thyroid, Total/Free Testosterone, Lipid panel, AST/ALT, Fasting Glucose, hs-CRP, Kidney markers) that you can take to any local private clinic or GP. You upload the PDF results directly to your portal, and Dr. Assem conducts a comprehensive clinical video consultation reviewing each metric.',
  },
  {
    q: 'Can I join if I have pre-existing metabolic conditions like thyroid sluggishness or insulin resistance?',
    a: 'Yes. In fact, clinical pathology and metabolic restoration are Dr. Assem’s primary specialties. Rather than forcing you onto extreme low-carb starvation diets that further down-regulate thyroid T3 conversion, we structure progressive refeeds, insulin-sensitizing nutrient timing, and physician-supervised protocols to heal metabolic dysfunction.',
  },
  {
    q: 'How are workouts delivered and monitored?',
    a: 'Workouts are delivered through our private athlete application with exact exercise videos, standardized repetition tempos, target RIR (Reps in Reserve), and warm-up sets. You record your compound lifts and upload video clips directly for biomechanical analysis and form corrections from Dr. Assem.',
  },
  {
    q: 'Do I get direct contact with Dr. Assem, or will an assistant answer me?',
    a: 'Every client communicates directly with Dr. Ahmed Assem. Tier 2 and Tier 3 clients have direct WhatsApp access for real-time questions, voice notes, and weekly video check-in consultations. Client capacity is intentionally restricted to maintain this high-touch physician oversight.',
  },
  {
    q: 'How does the Calorie & Macro Calculator on this site integrate with coaching?',
    a: 'The calculator on this platform provides an initial mathematical estimate based on the Mifflin-St Jeor & Katch-McArdle formulas. When you apply for 1-on-1 coaching, Dr. Assem takes those baseline numbers and fine-tunes them based on your digestive tolerance, biofeedback, and bloodwork to build dynamic carb-cycling protocols.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#090b0a] border-b border-neutral-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-xs font-semibold tracking-wider text-[var(--primary)] uppercase mb-3">
            Common Inquiries
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Everything you need to know about the medical intake, bloodwork process, and IFBB Pro coaching methodology.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#0f1311] border border-neutral-800 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-start p-6 flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  <span className="font-display text-base sm:text-lg font-bold text-white">
                    {item.q}
                  </span>
                  <span className="font-mono text-lg font-bold text-[var(--primary)] shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/60 mt-1">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
