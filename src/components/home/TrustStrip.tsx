import React from 'react';

const PILLARS = [
  {
    icon: '✦',
    title: 'Heritage Mills',
    desc: 'Virgin wools and silk habotai sourced from generational mills in Biella & Kyoto.',
  },
  {
    icon: '◈',
    title: 'Bespoke Fitting',
    desc: 'Complimentary sleeve and hem finishing adjustments upon client request.',
  },
  {
    icon: '◎',
    title: 'Zero Overproduction',
    desc: 'Each garment is cut in small numbered runs with zero synthetic waste.',
  },
  {
    icon: '→',
    title: 'Express Delivery',
    desc: 'Carbon-neutral worldwide courier delivery in recycled, plastic-free packaging.',
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <section className="py-12 px-5 sm:px-10 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PILLARS.map((p, idx) => (
          <div
            key={idx}
            className="glass-card p-6 sm:p-8 flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform duration-300"
          >
            <div className="w-10 h-10 rounded-full aura-badge flex items-center justify-center text-sm font-semibold shadow-inner">
              {p.icon}
            </div>
            <div>
              <h3 className="font-editorial italic text-2xl leading-snug">
                {p.title}
              </h3>
              <p className="mt-2 text-xs text-[var(--ink-secondary)] font-light leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStrip;
