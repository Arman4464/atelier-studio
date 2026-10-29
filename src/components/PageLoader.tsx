// src/components/PageLoader.tsx
import React from 'react';

export const PageLoader: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[60vh] w-full flex flex-col items-center justify-center pattern-ledger-grid bg-paper text-ink p-8"
  >
    <div className="woven-salvage-edge bg-card border border-stitch px-8 py-6 text-center max-w-xs w-full rounded-2xl">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
        ATELIER STUDIO // CALIBRATING BLOCK
      </div>
      <div className="h-0.5 w-full bg-stitch overflow-hidden my-3 rounded-full">
        <div className="h-full w-1/2 bg-oxblood motion-safe:animate-pulse" />
      </div>
      <div className="font-mono text-xs text-ink">
        Aligning Grainline & Care Ledger…
      </div>
    </div>
  </div>
);

export default PageLoader;
