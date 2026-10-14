import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-canvas)] text-[var(--ink-primary)] font-ledger text-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
        {/* Colophon Imprint */}
        <div className="md:col-span-5 p-8 sm:p-10 hairline-r space-y-4">
          <div className="font-grotesk font-extrabold text-2xl tracking-[-0.04em]">
            ATELIER<span className="font-editorial italic font-normal text-3xl ml-1">Studio</span>
          </div>
          <p className="text-[var(--ink-secondary)] leading-relaxed max-w-sm">
            Architectural garment studio & textile archive. Cut in small numbered batches using Japanese loomstate cotton and Italian virgin wool.
          </p>
          <div className="pt-2 text-[11px] text-[var(--ink-muted)]">
            VIA TORTONA 31, 20144 MILANO MI, ITALY
          </div>
        </div>

        {/* Index Column 1 */}
        <div className="md:col-span-3 p-8 sm:p-10 hairline-r space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-[var(--ink-muted)] mb-4">
            01 // DIRECTORY
          </div>
          <ul className="space-y-2.5 uppercase">
            <li><Link to="/shop" className="hover:text-[var(--accent-stamp)]">COMPLETE ARCHIVE</Link></li>
            <li><Link to="/journal" className="hover:text-[var(--accent-stamp)]">MONOGRAPHS</Link></li>
            <li><Link to="/account" className="hover:text-[var(--accent-stamp)]">CLIENTELE DOSSIER</Link></li>
            <li><Link to="/admin" className="hover:text-[var(--accent-stamp)]">ATELIER TERMINAL [ADMIN]</Link></li>
          </ul>
        </div>

        {/* Index Column 2 */}
        <div className="md:col-span-4 p-8 sm:p-10 space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-[var(--ink-muted)] mb-4">
            02 // SPECIFICATION COLOPHON
          </div>
          <div className="space-y-2 text-[11px] text-[var(--ink-secondary)]">
            <div className="flex justify-between py-1 hairline-b">
              <span>TYPOGRAPHY:</span>
              <span>INSTRUMENT SERIF / SYNE / JETBRAINS</span>
            </div>
            <div className="flex justify-between py-1 hairline-b">
              <span>SURFACE PALETTE:</span>
              <span>RAW MUSLIN #F3EFE6</span>
            </div>
            <div className="flex justify-between py-1 hairline-b">
              <span>EDITION STAMP:</span>
              <span>AW // 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[var(--ink-muted)]">
        <span>© {new Date().getFullYear()} ATELIER STUDIO ARCHIVE. ALL RIGHTS RESERVED.</span>
        <span>SERIAL N° 004991-C137</span>
      </div>
    </footer>
  );
};

export default Footer;
