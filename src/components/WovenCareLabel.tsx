// src/components/WovenCareLabel.tsx
import React, { useState } from 'react';
import { getProductLedgerSpec } from '../data/products';
import { useThemeStore } from '../store/themeStore';
import { soundEngine } from '../lib/soundEngine';

interface WovenCareLabelProps {
  productId: string;
  productName: string;
  category?: string;
  selectedSize?: 'XS' | 'S' | 'M' | 'L' | 'XL';
}

export const WovenCareLabel: React.FC<WovenCareLabelProps> = ({
  productId,
  productName,
  category = 'Atelier Outerwear',
  selectedSize = 'M',
}) => {
  const ledgerXRay = useThemeStore((s) => s.ledgerXRay);
  const toggleLedgerXRay = useThemeStore((s) => s.toggleLedgerXRay);
  const [activeSize, setActiveSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>(selectedSize);

  const spec = getProductLedgerSpec(productId, category);
  const activeDims = spec.gradingMatrixMm[activeSize];

  const handleToggleLedger = () => {
    soundEngine.playPaperRustle();
    toggleLedgerXRay();
  };

  const handleSelectSize = (size: 'XS' | 'S' | 'M' | 'L' | 'XL') => {
    soundEngine.playShearSnip();
    setActiveSize(size);
  };

  return (
    <section
      aria-label="Garment Care Label and Pattern Ledger"
      className="woven-salvage-edge pattern-ledger-grid bg-card text-ink p-5 my-6 transition-colors duration-300 border border-stitch rounded-xl"
    >
      {/* Top Salvage Header */}
      <div className="flex items-center justify-between border-b border-stitch pb-3 mb-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted block">
            {ledgerXRay ? 'ARCHIVAL DRAFTING LEDGER // X-RAY' : 'JACQUARD WOVEN CARE LABEL'}
          </span>
          <h3 className="font-serif text-base tracking-wide mt-0.5">
            {productName} — <span className="font-mono text-xs text-oxblood">{spec.patternBlockId}</span>
          </h3>
        </div>

        <button
          type="button"
          onClick={handleToggleLedger}
          aria-pressed={ledgerXRay}
          className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-stitch bg-paper text-ink hover:border-oxblood focus-visible:outline-2 focus-visible:outline-oxblood transition-colors cursor-pointer rounded-full"
        >
          {ledgerXRay ? 'View Woven Label [L]' : 'Pattern X-Ray [L]'}
        </button>
      </div>

      {!ledgerXRay ? (
        /* STATE A: WOVEN CARE LABEL VIEW */
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            <div>
              <span className="text-muted block text-[10px] uppercase">Lot / Serial</span>
              <span className="font-medium">{spec.lotNumber}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Fabric Weight</span>
              <span className="font-medium">{spec.fabricWeightGsm} GSM</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-muted block text-[10px] uppercase">Mill Origin</span>
              <span className="font-medium">{spec.millOrigin}</span>
            </div>
          </div>

          {/* Fiber Composition Bar */}
          <div className="pt-2 border-t border-stitch">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted block mb-1.5">
              Certified Fiber Composition
            </span>
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              {spec.fiberComposition.map((item) => (
                <span key={item.fiber} className="px-2 py-0.5 bg-paper border border-stitch rounded">
                  {item.percentage}% {item.fiber}
                </span>
              ))}
            </div>
          </div>

          {/* ISO Care Symbol Strip */}
          <div className="pt-2 border-t border-stitch flex items-center justify-between font-mono text-[11px] text-muted">
            <span>CARE: DRY CLEAN ONLY · COOL IRON (110°C) · DRY FLAT IN SHADE</span>
            <span className="text-oxblood font-semibold">{spec.stitchDensitySpi} SPI</span>
          </div>
        </div>
      ) : (
        /* STATE B: GARMENT PATTERN LEDGER X-RAY VIEW (THE VIDEO TWIST) */
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-3 gap-2 bg-paper p-3 border border-stitch rounded-lg">
            <div>
              <span className="text-[10px] text-muted block">SEAM ALLOWANCE</span>
              <span className="text-sm font-semibold text-oxblood">±{spec.seamAllowanceMm} mm</span>
            </div>
            <div>
              <span className="text-[10px] text-muted block">GRAINLINE AXIS</span>
              <span className="text-sm font-semibold">
                {spec.grainlineAngleDeg}° {spec.grainlineAngleDeg === 45 ? '(BIAS)' : '(WARP)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted block">YIELD / PIECE</span>
              <span className="text-sm font-semibold">{spec.yardageMeters} m</span>
            </div>
          </div>

          {/* Interactive Millimeter Grading Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted">
                Pattern Grading Matrix (Millimeters)
              </span>
              <div className="flex gap-1" role="group" aria-label="Select pattern grading size">
                {(['XS', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSelectSize(sz)}
                    aria-pressed={activeSize === sz}
                    className={`px-2 py-0.5 text-[11px] border transition-colors cursor-pointer rounded ${
                      activeSize === sz
                        ? 'border-oxblood bg-oxblood text-paper font-bold'
                        : 'border-stitch bg-paper text-ink hover:border-oxblood'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center bg-paper p-2.5 border border-stitch rounded-lg">
              <div>
                <span className="text-[10px] text-muted block">CHEST</span>
                <span className="font-semibold">{activeDims.chest} mm</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">SHOULDER</span>
                <span className="font-semibold">{activeDims.shoulder} mm</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">LENGTH</span>
                <span className="font-semibold">{activeDims.length} mm</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block">SLEEVE</span>
                <span className="font-semibold">{activeDims.sleeve} mm</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WovenCareLabel;
