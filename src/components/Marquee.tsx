import React from 'react';

interface MarqueeProps {
  items?: string[];
  className?: string;
  speed?: 'slow' | 'fast';
}

export const Marquee: React.FC<MarqueeProps> = ({
  items = [
    'AUTUMN—WINTER 2026 GARMENT STUDY',
    'LOOMSTATE SELVEDGE TEXTILES FROM OKAYAMA & BIELLA',
    'NUMBERED SMALL-BATCH PRODUCTION',
    'COMPLIMENTARY AIR WAYBILL DISPATCH ON ALL ARCHIVE REQUISITIONS',
  ],
  className = '',
}) => {
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className={`overflow-hidden hairline-b bg-[var(--ink-primary)] text-[var(--bg-canvas)] py-2.5 select-none ${className}`}
    >
      <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite] font-ledger text-[11px] uppercase tracking-[0.18em]">
        {repeated.map((text, idx) => (
          <div key={idx} className="flex items-center mx-6">
            <span className="inline-block w-1.5 h-1.5 bg-[var(--accent-stamp)] mr-4" />
            <span>{text}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
