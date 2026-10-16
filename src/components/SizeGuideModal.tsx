// src/components/SizeGuideModal.tsx
import React, { useState } from 'react';
import { useAtelierBridge } from '../lib/storeBridge';

const ROWS = [
  { size: 'XS', chest: 54, shoulder: 46, length: 71 },
  { size: 'S', chest: 57, shoulder: 48, length: 73 },
  { size: 'M', chest: 60, shoulder: 50, length: 76 },
  { size: 'L', chest: 63, shoulder: 52, length: 78 },
  { size: 'XL', chest: 66, shoulder: 54, length: 81 },
];

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useAtelierBridge();
  const [unit, setUnit] = useState<'CM' | 'IN'>('CM');

  if (!isSizeGuideOpen) return null;

  const fmt = (cm: number) =>
    unit === 'CM' ? `${cm} cm` : `${(cm / 2.54).toFixed(1)}"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={closeSizeGuide}
        className="fixed inset-0 bg-black/55 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-2xl surface-modal rounded-[28px] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-tech text-xs text-[var(--accent-signal)] font-bold uppercase block">
              ATELIER PROPORTIONS
            </span>
            <h2 className="font-display font-extrabold text-xl uppercase">
              Garment Measurement Matrix
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnit(unit === 'CM' ? 'IN' : 'CM')}
              className="px-3.5 py-1.5 rounded-full bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-mono-tech text-xs font-bold"
            >
              Unit: {unit}
            </button>
            <button
              onClick={closeSizeGuide}
              className="w-8 h-8 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-tech text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--ink-muted)] uppercase">
                <th className="py-3">Size</th>
                <th className="py-3">Half-Chest</th>
                <th className="py-3">Shoulder</th>
                <th className="py-3 text-right">Back Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {ROWS.map((r) => (
                <tr key={r.size}>
                  <td className="py-3.5 font-bold">{r.size}</td>
                  <td className="py-3.5">{fmt(r.chest)}</td>
                  <td className="py-3.5">{fmt(r.shoulder)}</td>
                  <td className="py-3.5 text-right">{fmt(r.length)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
