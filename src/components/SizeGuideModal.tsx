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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={closeSizeGuide}
        className="fixed inset-0 bg-black/65 backdrop-blur-[2px]"
      />

      <div className="relative z-10 w-full max-w-3xl bg-[var(--bg-canvas)] text-[var(--ink-primary)] hairline-box shadow-2xl overflow-hidden font-ledger text-xs">
        {/* Top Blueprint Header */}
        <div className="px-6 py-4 hairline-b bg-[var(--bg-sub)] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[var(--accent-stamp)] uppercase font-bold block">
              // PATTERN CUTTING TABLE N° 02
            </span>
            <h2 className="font-grotesk font-extrabold text-xl uppercase">
              Flat Garment Tolerances & Proportions
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnit(unit === 'CM' ? 'IN' : 'CM')}
              className="px-3 py-1.5 bg-[var(--ink-primary)] text-[var(--bg-canvas)] uppercase"
            >
              UNIT: [ {unit} ]
            </button>
            <button
              onClick={closeSizeGuide}
              className="px-3 py-1.5 hairline-box bg-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] hover:text-white"
            >
              [ ESC ]
            </button>
          </div>
        </div>

        {/* Schematic + Table Body */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left 4 Columns: Technical Garment Schematic */}
          <div className="md:col-span-4 p-6 hairline-r bg-[var(--bg-elevated)] flex flex-col justify-between">
            <div className="text-[10px] text-[var(--ink-muted)] uppercase">
              FIG. A — FLAT BLOCK SCHEMATIC
            </div>

            <svg
              viewBox="0 0 200 220"
              className="w-full max-w-[180px] mx-auto my-4 stroke-current fill-none"
              strokeWidth="1.2"
            >
              {/* Outer Coat / Block Outline */}
              <path d="M65,20 L135,20 L185,55 L165,115 L145,95 L145,200 L55,200 L55,95 L35,115 L15,55 Z" />
              {/* Collar */}
              <path d="M75,20 Q100,38 125,20" />
              {/* Measurement Callout Lines (Dashed) */}
              <line x1="65" y1="35" x2="135" y2="35" strokeDasharray="3 3" />
              <line x1="55" y1="105" x2="145" y2="105" strokeDasharray="3 3" />
              <line x1="100" y1="25" x2="100" y2="200" strokeDasharray="3 3" />
              {/* Callout Labels */}
              <text x="96" y="32" fontSize="9" fill="currentColor">B</text>
              <text x="96" y="101" fontSize="9" fill="currentColor">A</text>
              <text x="105" y="160" fontSize="9" fill="currentColor">D</text>
            </svg>

            <div className="space-y-1 text-[10px] text-[var(--ink-secondary)] pt-3 perforated-b pb-3">
              <div><strong>[A] PIT-TO-PIT:</strong> 2cm below armhole</div>
              <div><strong>[B] SHOULDER:</strong> Seam to seam</div>
              <div><strong>[C] SLEEVE:</strong> Shoulder crown to cuff</div>
              <div><strong>[D] LENGTH:</strong> Collar base to hem</div>
            </div>
          </div>

          {/* Right 8 Columns: Tolerance Matrix */}
          <div className="md:col-span-8 p-6 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="hairline-b text-[10px] text-[var(--ink-muted)] uppercase">
                    <th className="py-3 pr-3">INDEX</th>
                    <th className="py-3 px-2">[A] CHEST</th>
                    <th className="py-3 px-2">[B] SHOULDER</th>
                    <th className="py-3 px-2">[C] SLEEVE</th>
                    <th className="py-3 pl-2 text-right">[D] LENGTH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {CM_ROWS.map((row) => (
                    <tr key={row.size} className="hover:bg-[var(--bg-sub)]">
                      <td className="py-3.5 pr-3 font-bold">{row.size}</td>
                      <td className="py-3.5 px-2">{formatVal(row.chest)}</td>
                      <td className="py-3.5 px-2">{formatVal(row.shoulder)}</td>
                      <td className="py-3.5 px-2">{formatVal(row.sleeve)}</td>
                      <td className="py-3.5 pl-2 text-right">{formatVal(row.length)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-[var(--bg-sub)] hairline-box text-[11px] text-[var(--ink-secondary)] leading-relaxed">
              <strong>TAILOR NOTE:</strong> Garments are cut with an intentional architectural drape. Because each batch is cold-vat dyed in small lots, please allow a <strong>±0.8 cm</strong> natural shrinkage variance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
