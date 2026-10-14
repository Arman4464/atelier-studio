import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SCENES = [
  {
    id: '01',
    season: 'Autumn / Winter Collection',
    title: 'Sculpted Drape',
    subtitle: 'Fluid double-faced cashmere and architectural wool silhouettes.',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2000&q=90',
    hotspots: [
      {
        x: '48%',
        y: '38%',
        name: 'Double-Faced Wool Trench',
        price: '$680',
        slug: 'oversized-wool-coat',
      },
      {
        x: '54%',
        y: '68%',
        name: 'Pleated Wide-Leg Trouser',
        price: '$340',
        slug: 'tailored-trousers',
      },
    ],
  },
  {
    id: '02',
    season: 'Monolith Capsule',
    title: 'Weightless Volume',
    subtitle: 'Technical memory silk and tailored storm outerwear in muted onyx.',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90',
    hotspots: [
      {
        x: '46%',
        y: '44%',
        name: 'Memory Taffeta Parka',
        price: '$520',
        slug: 'field-parka',
      },
    ],
  },
  {
    id: '03',
    season: 'Resort Silhouette',
    title: 'Pure Proportion',
    subtitle: 'Unbleached organic silk-linen blends designed for effortless movement.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=90',
    hotspots: [
      {
        x: '52%',
        y: '42%',
        name: 'Relaxed Linen Knit Set',
        price: '$410',
        slug: 'linen-set',
      },
    ],
  },
];

export const Hero: React.FC = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);
  const scene = SCENES[activeScene];

  return (
    <section className="p-2.5 sm:p-4 lg:p-5">
      <div className="relative h-[91vh] min-h-[640px] w-full rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl bg-[#0D0D10]">
        {/* Full-Bleed Background Cinema Plate */}
        <img
          key={scene.image}
          src={scene.image}
          alt={scene.title}
          className="w-full h-full object-cover object-center scale-[1.02] transition-all duration-1000 ease-out"
        />

        {/* Soft Multi-Layer Vignette for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25" />

        {/* Interactive Garment Hotspots Pinned on the Model */}
        <div className="hidden md:block">
          {scene.hotspots.map((spot, idx) => {
            const isOpen = activeHotspot === idx;
            return (
              <div
                key={spot.name}
                style={{ left: spot.x, top: spot.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onMouseEnter={() => setActiveHotspot(idx)}
                  onClick={() => setActiveHotspot(isOpen ? null : idx)}
                  className="relative w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/70 flex items-center justify-center group transition-transform hover:scale-110"
                  aria-label={`Inspect ${spot.name}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white relative" />
                </button>

                {/* Floating Glass Hotspot Card */}
                {isOpen && (
                  <Link
                    to="/shop"
                    className="absolute left-11 top-1/2 -translate-y-1/2 w-60 p-3.5 rounded-2xl bg-white/85 dark:bg-black/80 backdrop-blur-xl border border-white/40 text-[#0B0B0E] dark:text-white shadow-2xl flex items-center justify-between gap-3 transition-all"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-widest opacity-60 block">
                        Featured Piece
                      </span>
                      <span className="text-xs font-semibold block mt-0.5">
                        {spot.name}
                      </span>
                      <span className="text-xs font-medium opacity-80 mt-0.5 block">
                        {spot.price}
                      </span>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xs shrink-0">
                      →
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom-Left Editorial Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8 z-10">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] uppercase tracking-[0.2em] mb-4">
              {scene.season}
            </span>
            <h1 className="font-editorial italic text-5xl sm:text-7xl lg:text-[5.75rem] leading-[0.94] tracking-tight font-normal">
              {scene.title}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/80 max-w-md font-light leading-relaxed">
              {scene.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="px-7 py-3.5 rounded-full bg-white text-[#0B0B0E] text-xs font-semibold tracking-wider uppercase hover:scale-[1.03] transition-transform inline-flex items-center gap-3"
              >
                <span>Explore Collection</span>
                <span>→</span>
              </Link>
              <Link
                to="/journal"
                className="px-6 py-3.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium tracking-wider uppercase hover:bg-white/25 transition-colors"
              >
                Lookbook Film
              </Link>
            </div>
          </div>

          {/* Bottom-Right Floating Scene Scrubber */}
          <div className="flex items-center gap-2 bg-black/35 backdrop-blur-xl border border-white/15 p-1.5 rounded-full self-start lg:self-end">
            {SCENES.map((s, idx) => {
              const active = idx === activeScene;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveScene(idx);
                    setActiveHotspot(0);
                  }}
                  className={`px-4 py-2 rounded-full text-xs transition-all ${
                    active
                      ? 'bg-white text-[#0B0B0E] font-semibold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {s.id} — {s.title.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
