// src/components/home/Manifesto.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Manifesto: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(52);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-6 max-w-[1440px] mx-auto">
      <div className="surface-card p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left 5 Cols: Editorial Story & Telemetry Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[var(--accent-signal)] font-bold block">
            // INTERACTIVE MATERIAL DISSECTION
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight uppercase leading-[0.96]">
            From Raw Loom <br />
            <span className="font-editorial italic font-normal lowercase text-4xl sm:text-6xl text-[var(--accent-signal)]">
              to sculptural form.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--ink-secondary)] leading-relaxed">
            Drag the optical comparator across the specimen plate to inspect how our unbleached 540 GSM Biella virgin wool transforms into weather-sealed architectural silhouettes.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-sub)]">
              <div className="font-mono-tech font-bold text-lg sm:text-xl">540 GSM</div>
              <div className="font-mono-tech text-[10px] uppercase text-[var(--ink-muted)] mt-0.5">
                Loom Density
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[var(--bg-sub)]">
              <div className="font-mono-tech font-bold text-lg sm:text-xl">100%</div>
              <div className="font-mono-tech text-[10px] uppercase text-[var(--ink-muted)] mt-0.5">
                Traceable Mills
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[var(--bg-sub)]">
              <div className="font-mono-tech font-bold text-lg sm:text-xl">0.4 mm</div>
              <div className="font-mono-tech text-[10px] uppercase text-[var(--ink-muted)] mt-0.5">
                Seam Tolerance
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/journal"
              className="btn-primary px-7 py-3.5 text-xs uppercase tracking-widest"
            >
              Read Textile Monographs →
            </Link>
          </div>
        </div>

        {/* Right 7 Cols: Interactive Drag Before/After Comparator */}
        <div className="lg:col-span-7">
          <div
            data-cursor="DRAG"
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
              }
            }}
            onClick={(e) => handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
              }
            }}
            className="relative aspect-[16/11] rounded-[22px] overflow-hidden select-none cursor-ew-resize shadow-xl bg-[#121215]"
          >
            {/* Layer 1 (Right / Base): Finished Architectural Silhouette */}
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85"
              alt="Finished Silhouette"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white font-mono-tech text-[10px] uppercase font-bold">
              STAGE 02 // FINISHED SILHOUETTE
            </span>

            {/* Layer 2 (Left / Clipped): Raw Loomstate Textile Study */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
                alt="Raw Loomstate Textile"
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--accent-signal)] text-white font-mono-tech text-[10px] uppercase font-bold">
                STAGE 01 // RAW LOOMSTATE MUSLIN
              </span>
            </div>

            {/* Interactive Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.8)] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[var(--accent-signal)] text-white shadow-xl flex items-center justify-center font-mono-tech text-xs font-bold border-2 border-white">
                ↔
              </div>
            </div>

            {/* Bottom Range Slider for Accessibility */}
            <input
              type="range"
              min={5}
              max={95}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Compare raw textile and finished garment"
              className="absolute bottom-4 inset-x-8 opacity-0 cursor-ew-resize h-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
