import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <main className="min-h-[75vh] flex items-center justify-center p-6 bg-[var(--bg-canvas)]">
      <div className="max-w-lg w-full hairline-box p-8 sm:p-12 bg-[var(--bg-elevated)] font-ledger text-xs space-y-6">
        <div className="flex justify-between items-center pb-4 perforated-b">
          <span className="text-[var(--accent-stamp)] font-bold">[ ERROR CODE // 404 ]</span>
          <span>ARCHIVE LEDGER</span>
        </div>
        <h1 className="font-grotesk font-extrabold text-3xl sm:text-4xl uppercase">
          Specimen Missing From Rack
        </h1>
        <p className="text-[var(--ink-secondary)] leading-relaxed">
          The pattern plate or archive coordinate you requested has either been retired from production or moved to private vault storage.
        </p>
        <Link
          to="/shop"
          className="inline-block w-full text-center py-4 bg-[var(--ink-primary)] text-[var(--bg-canvas)] uppercase tracking-widest hover:bg-[var(--accent-stamp)] transition-colors font-medium"
        >
          RETURN TO COMPLETE CATALOG →
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
