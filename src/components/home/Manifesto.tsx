import React from 'react';

export const Manifesto: React.FC = () => {
  return (
    <section className="hairline-b py-16 lg:py-24 px-4 sm:px-8 bg-[var(--bg-sub)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Editorial Statement */}
        <div className="lg:col-span-7 space-y-6">
          <div className="font-ledger text-xs uppercase tracking-[0.2em] text-[var(--accent-stamp)]">
            // MANIFESTO & MATERIAL DOCTRINE
          </div>
          <h2 className="font-grotesk font-extrabold text-3xl sm:text-5xl leading-[1.02] tracking-[-0.03em] uppercase">
            Against disposable garments. <br />
            <span className="font-editorial italic font-normal lowercase text-4xl sm:text-6xl">
              Built like industrial architecture.
            </span>
          </h2>
          <p className="text-[var(--ink-secondary)] text-base sm:text-lg leading-relaxed max-w-2xl">
            Every silhouette begins as an unbleached muslin toile on our Milan pattern table. We leave selvedge edges intact, use natural corozo nut and horn hardware, and document the exact mill and weave weight on a physical label stitched into the lining.
          </p>
        </div>

        {/* Right Physical Tyvek Care Label */}
        <div className="lg:col-span-5">
          <div className="bg-[var(--bg-elevated)] p-6 sm:p-8 hairline-box shadow-sm relative font-ledger text-xs">
            {/* Top Stitch Marks */}
            <div className="perforated-b pb-4 mb-4 flex items-center justify-between">
              <span className="font-bold tracking-widest">ATELIER STUDIO // MILANO</span>
              <span className="px-2 py-0.5 bg-[var(--ink-primary)] text-[var(--bg-canvas)]">
                LOT N° 2026-A
              </span>
            </div>

            <div className="space-y-3 text-[11px] leading-relaxed">
              <div className="grid grid-cols-3 py-1.5 hairline-b">
                <span className="text-[var(--ink-muted)]">COMPOSITION:</span>
                <span className="col-span-2 font-medium">
                  100% LONG-STAPLE ORGANIC COTTON / VIRGIN WOOL
                </span>
              </div>
              <div className="grid grid-cols-3 py-1.5 hairline-b">
                <span className="text-[var(--ink-muted)]">WEAVE ORIGIN:</span>
                <span className="col-span-2 font-medium">
                  OKAYAMA LOOMSTATE & BIELLA ARCHIVE MILLS
                </span>
              </div>
              <div className="grid grid-cols-3 py-1.5 hairline-b">
                <span className="text-[var(--ink-muted)]">CONSTRUCTION:</span>
                <span className="col-span-2 font-medium">
                  SINGLE-NEEDLE LOCKSTITCH // FRENCH SEAMS
                </span>
              </div>
              <div className="grid grid-cols-3 py-1.5 hairline-b">
                <span className="text-[var(--ink-muted)]">CARE SPEC:</span>
                <span className="col-span-2 font-medium">
                  COLD HAND WASH. DRY FLAT IN SHADE. DO NOT TUMBLE.
                </span>
              </div>
            </div>

            {/* Care Symbols & Inspector Stamp */}
            <div className="mt-6 pt-4 perforated-b flex items-center justify-between text-[var(--ink-secondary)]">
              <div className="flex items-center gap-4 text-base tracking-widest">
                <span title="30C Wash">[ 30° ]</span>
                <span title="Do Not Bleach">[ ✕△ ]</span>
                <span title="Dry Flat">[ ⊟ ]</span>
                <span title="Low Iron">[  iron ]</span>
              </div>
              <div className="border border-[var(--accent-stamp)] text-[var(--accent-stamp)] px-2 py-0.5 text-[10px] uppercase rotate-[-3deg] font-bold">
                INSPECTED BY N° 14
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
