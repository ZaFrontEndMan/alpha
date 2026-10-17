import React from 'react';

export const ProofStrip: React.FC = () => {
  const proofs = [
    {
      metric: '500+',
      label: 'Verified Transformations',
      context: 'Across 18 countries with documented biometrics',
    },
    {
      metric: '14+',
      label: 'Years Clinical & Pro Experience',
      context: 'Combining hospital medicine and IFBB stages',
    },
    {
      metric: '100%',
      label: 'Doctor-Supervised Bloodwork',
      context: 'Thyroid, lipid, testosterone & liver safety audits',
    },
    {
      metric: '98.4%',
      label: 'Protocol Adherence Rate',
      context: 'Sustainable lifestyle integration without burnout',
    },
  ];

  return (
    <section className="bg-[#0c0f0d] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {proofs.map((item, idx) => (
            <div key={idx} className="flex flex-col justify-start">
              <span className="font-display text-3xl sm:text-4xl font-black text-white font-mono tabular-nums tracking-tight">
                {item.metric.includes('+') || item.metric.includes('%') ? (
                  <>
                    <span>{item.metric.slice(0, -1)}</span>
                    <span className="text-[#8cffdb]">{item.metric.slice(-1)}</span>
                  </>
                ) : (
                  item.metric
                )}
              </span>
              <span className="mt-2 text-sm font-semibold text-neutral-200">
                {item.label}
              </span>
              <span className="mt-1 text-xs text-neutral-400 leading-normal">
                {item.context}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
