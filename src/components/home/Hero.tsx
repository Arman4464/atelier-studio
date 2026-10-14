import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SPECIMENS = [
  {
    id: 'SPEC-01',
    code: 'AT-HV-084',
    title: 'Anodized Membrane Parka',
    subtitle: 'High-density micro-ripstop laminated with thermal-regulating aluminum vapor coating.',
    material: '280 GSM Metalized Ripstop Nylon (Fukui, JP)',
    finish: 'Cryo-Dye Carbon Mist / Hydro-Sealed',
    price: '$580',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
    chamber: 'CHAMBER 01 // CRYO-VAC',
    status: 'BATCH 01 — ACTIVE',
  },
  {
    id: 'SPEC-02',
    code: 'AT-HV-092',
    title: 'Twisted-Seam Selvedge Car Coat',
    subtitle: 'Unlined structural wool tailored on a 3D bias curve to eliminate tension along sleeve lines.',
    material: '520 GSM Virgin Selvedge Wool (Biella, IT)',
    finish: 'Cold-Vat Mineral Black / Horn Hardware',
    price: '$690',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85',
    chamber: 'CHAMBER 02 // PATTERN CUT',
    status: 'BATCH 02 — LIMITED',
  },
  {
    id: 'SPEC-03',
    code: 'AT-HV-105',
    title: 'Engineered Kinetic Cargo Trouser',
    subtitle: 'Articulated knee darts derived from French locomotive workwear with magnetic gussets.',
    material: '440 GSM Dry Japanese Cotton Drill',
    finish: 'High-Torque Enzyme Wash',
    price: '$360',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85',
    chamber: 'CHAMBER 03 // SPEC-TEST',
    status: 'BATCH 03 — ACTIVE',
  },
];

export const Hero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSpecimen = SPECIMENS[activeIdx];

  return (
    <section className="hairline-b relative overflow-hidden bg-[var(--bg-canvas)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-100px)]">
        {/* Left Column: Bold Industrial Typography & Manifestos */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 hairline-r">
          {/* Top Live Terminal Stamp */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 hairline-b">
            <div className="flex items-center gap-3">
              <span className="volt-pill">
                FLAGSHIP DISPATCH
              </span>
              <span className="font-ledger text-xs font-semibold uppercase text-[var(--ink-secondary)]">
                SERIES AW/26 — CONCEPT STUDY
              </span>
            </div>
            <span className="font-ledger text-xs font-bold text-[var(--accent-electric)]">
              [ {activeSpecimen.code} ]
            </span>
          </div>

          {/* Headline Section */}
          <div className="my-8 lg:my-auto py-2">
            <div className="flex items-center gap-2 mb-4 font-ledger text-xs font-bold text-[var(--accent-electric)] tracking-widest uppercase">
              <span>// 001</span>
              <span>KINETIC MATERIAL DISSECTION</span>
            </div>

            <h1 className="font-grotesk font-black text-5xl sm:text-7xl xl:text-[5.6rem] leading-[0.9] tracking-[-0.04em] uppercase text-[var(--ink-primary)]">
              STRUCTURAL <br />
              <span className="text-[var(--accent-electric)] tracking-tight">KINETICS</span> <br />
              & UTILITY.
            </h1>

            <p className="mt-8 max-w-xl text-base sm:text-lg text-[var(--ink-secondary)] leading-relaxed font-normal">
              Rejecting disposable fashion trends. We engineer hyper-functional architectural garments cut from heavyweight Italian wools, Japanese memory textiles, and high-tensile technical twills.
            </p>

            {/* Brutalist Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="brutal-btn px-8 py-4 text-xs font-bold tracking-wider"
              >
                <span>EXPLORE ARCHIVE SPECIMENS →</span>
              </Link>
              <Link
                to="/journal"
                className="inline-flex items-center gap-2 px-6 py-4 hairline-box font-ledger text-xs font-bold uppercase tracking-widest text-[var(--ink-primary)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-sub)] transition-colors"
              >
                <span>TEXTILE RESEARCH LAB</span>
                <span className="text-[var(--accent-electric)]">[04]</span>
              </Link>
            </div>
          </div>

          {/* Bottom Interactive Specimen Selector */}
          <div className="pt-8 hairline-t">
            <div className="flex items-center justify-between mb-3 font-ledger text-[11px] uppercase">
              <span className="text-[var(--ink-muted)] font-semibold">
                ACTIVE LAB CHAMBER:
              </span>
              <span className="text-[var(--ink-primary)] font-bold">
                {activeSpecimen.chamber}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SPECIMENS.map((spec, index) => {
                const isSelected = index === activeIdx;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setActiveIdx(index)}
                    className={`text-left p-3.5 transition-all text-[var(--ink-primary)] ${
                      isSelected
                        ? 'brutal-card bg-[var(--bg-elevated)]'
                        : 'hairline-box bg-[var(--bg-sub)]/50 hover:bg-[var(--bg-sub)]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-ledger text-[10px] mb-1">
                      <span className="font-bold text-[var(--accent-electric)]">{spec.id}</span>
                      <span className="font-semibold text-[var(--ink-primary)]">{spec.price}</span>
                    </div>
                    <div className="font-grotesk font-black text-xs truncate">
                      {spec.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: High-Voltage Specimen Frame */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[var(--bg-sub)] relative">
          {/* Top Specimen Header */}
          <div className="px-6 py-3.5 hairline-b flex items-center justify-between font-ledger text-[11px] font-bold text-[var(--ink-primary)]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-signal)]" />
              FIG. 0{activeIdx + 1} // FULL SCALE SCAN
            </span>
            <span className="text-[var(--accent-electric)]">{activeSpecimen.status}</span>
          </div>

          {/* Specimen Visual Presentation with Offset Shadow & Modern Framing */}
          <div className="relative flex-1 min-h-[460px] p-6 sm:p-10 flex items-center justify-center">
            {/* Architectural Coordinates Crosshairs */}
            <div className="absolute top-4 left-4 font-ledger text-[9px] text-[var(--ink-muted)]">
              X: 45.464 // Y: 09.190
            </div>
            <div className="absolute top-4 right-4 font-ledger text-[9px] text-[var(--ink-muted)]">
              CALIBRATION: 99.8%
            </div>
            <div className="absolute bottom-4 left-4 font-ledger text-[9px] text-[var(--ink-muted)]">
              REF: SPEC-AW26
            </div>
            <div className="absolute bottom-4 right-4 font-ledger text-[9px] text-[var(--ink-muted)]">
              ATELIER CONCEPT
            </div>

            <div className="relative w-full h-full max-h-[580px] overflow-hidden brutal-card group">
              <img
                key={activeSpecimen.image}
                src={activeSpecimen.image}
                alt={activeSpecimen.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Floating Specification Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[var(--bg-canvas)]/95 backdrop-blur-md p-4 hairline-box border-[var(--border-strong)]">
                <div className="flex items-baseline justify-between gap-2 pb-2 hairline-b">
                  <span className="font-grotesk font-black text-sm uppercase text-[var(--ink-primary)]">
                    {activeSpecimen.title}
                  </span>
                  <span className="font-ledger text-sm font-bold text-[var(--accent-electric)]">
                    {activeSpecimen.price}
                  </span>
                </div>
                <div className="mt-2 space-y-1 font-ledger text-[11px] text-[var(--ink-secondary)]">
                  <div><strong className="text-[var(--ink-primary)]">TEXTILE:</strong> {activeSpecimen.material}</div>
                  <div><strong className="text-[var(--ink-primary)]">FINISH:</strong> {activeSpecimen.finish}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Provenance Strip */}
          <div className="px-6 py-3.5 hairline-t font-ledger text-[11px] flex items-center justify-between text-[var(--ink-secondary)] bg-[var(--bg-canvas)]">
            <span className="font-semibold text-[var(--ink-primary)]">HAND-FINISHED IN MILAN & KYOTO</span>
            <Link
              to="/shop"
              className="font-bold text-[var(--accent-electric)] hover:underline flex items-center gap-1"
            >
              <span>ORDER PIECE</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
