import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ARCHIVE_PLATES = [
  {
    id: 'PLATE — I',
    code: 'AS-AW26-014',
    title: 'Raw Selvedge Wool Overcoat',
    subtitle: 'Unlined structural tailoring with exposed horn buttons & bias-cut raglan sleeves.',
    fabric: '540 GSM Double-Faced Virgin Wool (Biella, IT)',
    dye: 'Cold-Vat Iron Oxide Charcoal',
    price: '$680',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85',
    coords: 'CUTTING TABLE 02 // PATTERN B',
  },
  {
    id: 'PLATE — II',
    code: 'AS-AW26-029',
    title: 'Crinkled Nylon Field Parka',
    subtitle: 'Garment-dyed Japanese memory taffeta that holds sculptural creases where touched.',
    fabric: '210 GSM High-Density Memory Nylon (Fukui, JP)',
    dye: 'Piece-Dyed Peat & Burnt Umber',
    price: '$520',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
    coords: 'DYE BATH 07 // IMMERSION 4H',
  },
  {
    id: 'PLATE — III',
    code: 'AS-AW26-041',
    title: 'Twisted-Seam Heavy Canvas Trouser',
    subtitle: 'Engineered 3D curved leg architecture derived from 1940s French railway workwear.',
    fabric: '460 GSM Unbleached Organic Cotton Duck',
    dye: 'Natural Calico / Raw Enzyme Wash',
    price: '$340',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85',
    coords: 'ARCHIVE RACK 11 // SPECIMEN C',
  },
];

export const Hero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activePlate = ARCHIVE_PLATES[activeIdx];

  return (
    <section className="hairline-b relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-105px)]">
        {/* Left Column: Editorial Typography & Pattern Notes */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 hairline-r">
          {/* Top Metadata Stamp */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 hairline-b">
            <div className="font-ledger text-xs uppercase tracking-wider flex items-center gap-3">
              <span className="px-2 py-0.5 bg-[var(--accent-stamp)] text-[#FAF7F2] font-medium">
                LOOKBOOK 04
              </span>
              <span className="text-[var(--ink-secondary)]">
                ARCHIVAL MONOGRAPH — 2026
              </span>
            </div>
            <span className="font-ledger text-xs text-[var(--ink-muted)]">
              [ {activePlate.code} ]
            </span>
          </div>

          {/* Main Asymmetric Headline */}
          <div className="my-10 lg:my-auto py-4">
            <p className="font-ledger text-xs uppercase tracking-[0.2em] text-[var(--ink-secondary)] mb-4">
              // ARCHITECTURAL GARMENTS FOR EVERYDAY UTILITY
            </p>
            <h1 className="font-grotesk font-extrabold text-5xl sm:text-7xl xl:text-[5.4rem] leading-[0.92] tracking-[-0.04em] uppercase">
              Form Follows <br />
              <span className="font-editorial italic font-normal lowercase text-6xl sm:text-8xl xl:text-[6.4rem] text-[var(--accent-stamp)] pr-3">
                raw
              </span>
              Material.
            </h1>

            <p className="mt-8 max-w-xl text-base sm:text-lg text-[var(--ink-secondary)] leading-relaxed font-normal">
              We reject seasonal trends and synthetic perfection. Every piece is cut from heavy-gauge Japanese and Italian textiles, numbered by batch, and engineered to patina with its wearer.
            </p>

            {/* Primary & Secondary Action Ledger */}
            <div className="mt-10 flex flex-wrap items-stretch gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-6 bg-[var(--ink-primary)] text-[var(--bg-canvas)] px-7 py-4 font-ledger text-xs uppercase tracking-widest hover:bg-[var(--accent-stamp)] transition-colors"
              >
                <span>ENTER THE ARCHIVE</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/journal"
                className="inline-flex items-center gap-3 px-6 py-4 hairline-box font-ledger text-xs uppercase tracking-widest hover:bg-[var(--bg-sub)] transition-colors"
              >
                <span>READ PATTERN NOTES</span>
                <span className="text-[var(--ink-muted)]">[04]</span>
              </Link>
            </div>
          </div>

          {/* Bottom Interactive Contact Sheet Switcher */}
          <div className="pt-8 hairline-t">
            <div className="flex items-center justify-between mb-3">
              <span className="font-ledger text-[11px] uppercase text-[var(--ink-muted)]">
                SELECT CONTACT SHEET PLATE:
              </span>
              <span className="font-ledger text-[11px] text-[var(--ink-secondary)]">
                {activePlate.coords}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {ARCHIVE_PLATES.map((plate, index) => {
                const selected = index === activeIdx;
                return (
                  <button
                    key={plate.id}
                    onClick={() => setActiveIdx(index)}
                    className={`text-left p-3 transition-all hairline-box ${
                      selected
                        ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                        : 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-sub)]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-ledger text-[10px] opacity-75 mb-1">
                      <span>{plate.id}</span>
                      <span>{plate.price}</span>
                    </div>
                    <div className="font-grotesk font-bold text-xs truncate">
                      {plate.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Specimen Frame & Garment Dissection */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[var(--bg-sub)] relative">
          {/* Top Specimen Bar */}
          <div className="px-6 py-3 hairline-b flex items-center justify-between font-ledger text-[11px] text-[var(--ink-secondary)]">
            <span>FIG. 0{activeIdx + 1} — FULL SILHOUETTE</span>
            <span>SCALE 1:12</span>
          </div>

          {/* Image Frame with Crop Marks */}
          <div className="relative flex-1 min-h-[460px] p-6 sm:p-10 flex items-center justify-center overflow-hidden">
            {/* Corner Crop Marks */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[var(--ink-primary)]" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[var(--ink-primary)]" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[var(--ink-primary)]" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[var(--ink-primary)]" />

            <div className="relative w-full h-full max-h-[580px] overflow-hidden hairline-box bg-[var(--bg-canvas)] group">
              <img
                key={activePlate.image}
                src={activePlate.image}
                alt={activePlate.title}
                className="w-full h-full object-cover object-center grayscale-[20%] contrast-[1.06] group-hover:scale-105 transition-transform duration-700"
              />
              {/* Woven Spec Tag Pinned to Bottom-Left of Photo */}
              <div className="absolute bottom-4 left-4 right-4 bg-[var(--bg-canvas)]/95 backdrop-blur-sm p-4 hairline-box">
                <div className="flex items-baseline justify-between gap-2 pb-2 perforated-b">
                  <span className="font-grotesk font-bold text-sm uppercase">
                    {activePlate.title}
                  </span>
                  <span className="font-ledger text-sm font-semibold text-[var(--accent-stamp)]">
                    {activePlate.price}
                  </span>
                </div>
                <div className="mt-2 space-y-1 font-ledger text-[11px] text-[var(--ink-secondary)]">
                  <div>TEXTILE: {activePlate.fabric}</div>
                  <div>TREATMENT: {activePlate.dye}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Provenance Strip */}
          <div className="px-6 py-3 hairline-t font-ledger text-[11px] flex items-center justify-between text-[var(--ink-secondary)]">
            <span>HAND-FINISHED IN MILAN & KYOTO</span>
            <Link to="/shop" className="underline hover:text-[var(--accent-stamp)]">
              INSPECT PIECE ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
