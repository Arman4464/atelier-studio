import React, { useState } from 'react';
import { useUIStore } from '../store/uiStore';

interface SizeGuideModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const CM_ROWS = [
  { size: 'XS (44)', chest: 55.0, shoulder: 46.5, sleeve: 62.0, length: 72.0 },
  { size: 'S  (46)', chest: 58.0, shoulder: 48.5, sleeve: 63.5, length: 74.5 },
  { size: 'M  (48)', chest: 61.0, shoulder: 50.5, sleeve: 65.0, length: 77.0 },
  { size: 'L  (50)', chest: 64.0, shoulder: 52.5, sleeve: 66.5, length: 79.5 },
  { size: 'XL (52)', chest: 67.0, shoulder: 54.5, sleeve: 68.0, length: 82.0 },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = (props) => {
  const uiStore = useUIStore() as any;
  const [unit, setUnit] = useState<'CM' | 'IN'>('CM');

  const isOpen =
    props.isOpen ??
    Boolean(
      uiStore.isSizeGuideOpen ??
        uiStore.sizeGuideOpen ??
        uiStore.activeModal === 'sizeGuide'
    );

  const closeSizeGuide = () => {
    if (props.onClose) props.onClose();
    if (uiStore.closeSizeGuide) uiStore.closeSizeGuide();
    else if (uiStore.setSizeGuideOpen) uiStore.setSizeGuideOpen(false);
    else if (uiStore.closeModal) uiStore.closeModal();
  };

  if (!isOpen) return null;

  const formatVal = (cm: number) =>
    unit === 'CM' ? `${cm.toFixed(1)} cm` : `${(cm / 2.54).toFixed(1)}"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={closeSizeGuide}
        className="fixed inset-0 bg-black/45 backdrop-blur-md transition-opacity"
      />

      <div className="relative z-10 w-full max-w-2xl glass-modal rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-10">
        <div className="flex items-center justify-between pb-5 border-b border-[var(--glass-border-subtle)]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--ink-muted)] block">
              Atelier Sizing Spec
            </span>
            <h2 className="font-editorial italic text-3xl mt-0.5">
              Garment Measurements & Fit
            </h2>
          </div>
          <button
            onClick={closeSizeGuide}
            className="w-9 h-9 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs hover:scale-105 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Unit Toggle Pill */}
        <div className="flex items-center justify-between my-6">
          <p className="text-xs text-[var(--ink-secondary)]">
            Measurements taken flat across exterior seam lines.
          </p>
          <div className="inline-flex rounded-full bg-[var(--bg-sub)] p-1 border border-[var(--glass-border-subtle)]">
            <button
              onClick={() => setUnit('CM')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                unit === 'CM'
                  ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] shadow-sm'
                  : 'text-[var(--ink-secondary)]'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('IN')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                unit === 'IN'
                  ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] shadow-sm'
                  : 'text-[var(--ink-secondary)]'
              }`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Glass Table */}
        <div className="overflow-x-auto no-scrollbar rounded-2xl glass-card border border-[var(--glass-border-subtle)] p-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--glass-border-subtle)] text-[var(--ink-muted)]">
                <th className="py-3 px-4 font-semibold">SIZE</th>
                <th className="py-3 px-4 font-semibold">CHEST</th>
                <th className="py-3 px-4 font-semibold">SHOULDER</th>
                <th className="py-3 px-4 font-semibold">SLEEVE</th>
                <th className="py-3 px-4 font-semibold">LENGTH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border-subtle)] text-[var(--ink-primary)]">
              {CM_ROWS.map((r) => (
                <tr key={r.size} className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-medium">{r.size}</td>
                  <td className="py-3 px-4">{formatVal(r.chest)}</td>
                  <td className="py-3 px-4">{formatVal(r.shoulder)}</td>
                  <td className="py-3 px-4">{formatVal(r.sleeve)}</td>
                  <td className="py-3 px-4">{formatVal(r.length)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-5 border-t border-[var(--glass-border-subtle)] flex items-center justify-between text-xs text-[var(--ink-muted)]">
          <span>Unsure about your fit? Email bespoke@atelier.studio</span>
          <button
            onClick={closeSizeGuide}
            className="text-[var(--ink-primary)] font-medium hover:underline"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
