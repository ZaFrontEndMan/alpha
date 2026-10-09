import React from 'react';
import { BrandLogo } from './BrandLogo';

interface DoctorBioProps {
  onOpenConsultation: () => void;
}

export const DoctorBio: React.FC<DoctorBioProps> = ({ onOpenConsultation }) => {
  return (
    <section id="about-doctor" className="py-20 md:py-28 bg-[#090b0a] border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Brand Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#121614] border border-neutral-800 p-8 sm:p-10 relative overflow-hidden">
              {/* Subtle AA vector emblem watermark */}
              <div className="mb-8">
                <BrandLogo size={64} variant="lime" showWordmark />
              </div>

              <blockquote className="font-display text-xl sm:text-2xl font-bold text-white leading-snug mb-6">
                &ldquo;Your body is an intricate biological system governed by hormonal signals, metabolic rate, and cellular recovery. Treating it with random gym bro-science is not just ineffective—it is dangerous.&rdquo;
              </blockquote>

              <div className="pt-6 border-t border-neutral-800/80 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Credentials:</span>
                  <span className="text-white font-bold">Medical Doctor (M.D.)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Athletic Status:</span>
                  <span className="text-[#ccff00] font-bold">IFBB Pro League Athlete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Organization:</span>
                  <span className="text-white">Founder, Alpha Team</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Global Reach:</span>
                  <span className="text-white">Clients across 18+ Countries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="text-xs font-semibold tracking-wider text-[#ccff00] uppercase mb-3">
              Physician & Pro Athlete
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]">
              Dr. Ahmed Assem: Bridging Clinical Endocrinology & Pro Bodybuilding
            </h2>

            <div className="mt-6 space-y-4 text-base text-neutral-300 leading-relaxed">
              <p>
                In an industry overflowing with uncertified influencers selling 6-week cookie-cutter PDF meal plans, Dr. Ahmed Assem brings something exceptionally rare: rigorous medical training coupled with top-tier international competitive bodybuilding credentials.
              </p>
              <p>
                As a practicing physician, Dr. Assem understands liver function panels, renal biomarkers, lipid fractions, thyroid hormones, and androgen metabolism at a biochemical level. As an IFBB Pro athlete, he has tested these physiological principles on the international stage, achieving single-digit body fat while preserving maximum muscle density.
              </p>
              <p>
                Under his leadership, <strong>Alpha Team</strong> has grown into a premiere international coaching collective for executives, busy professionals, and ambitious athletes who demand uncompromising physical excellence without sacrificing long-term longevity.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black bg-[#ccff00] hover:bg-[#b5e600] transition-colors"
              >
                Schedule Direct Consultation
              </button>
              <a
                href="#transformations"
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
              >
                View 500+ Outcomes
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
