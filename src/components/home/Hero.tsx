// src/components/home/Hero.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtelierBridge } from '../../lib/storeBridge';

export const Hero: React.FC = () => {
  const { products, addToCart, openCart, openQuickView } = useAtelierBridge();
  const [activeLookIdx, setActiveLookIdx] = useState(0);
  const [bundleAdded, setBundleAdded] = useState(false);

  // Build 3 interactive runway looks backed by real store products
  const p0 = products[0] || {
    id: 'look-1',
    name: 'Architectural Wool Overcoat',
    category: 'Outerwear',
    price: 680,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85',
  };
  const p1 = products[1] || {
    id: 'look-2',
    name: 'Technical Storm Parka',
    category: 'Outerwear',
    price: 540,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85',
  };
  const p2 = products[2] || {
    id: 'look-3',
    name: 'Pleated Wide-Leg Trouser',
    category: 'Trousers',
    price: 360,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85',
  };

  const RUNWAY_LOOKS = [
    {
      code: 'LOOK 01 // MILAN',
      season: 'AUTUMN — WINTER ARCHIVE',
      headline: 'Sculptural Tailoring',
      subhead: 'Heavy-gauge Italian virgin wool engineered with cantilevered shoulders and fluid drape.',
      heroImage: p0.image,
      featuredProduct: p0,
      companionProduct: p2,
      hotspot: { x: '48%', y: '42%' },
    },
    {
      code: 'LOOK 02 // KYOTO',
      season: 'TECHNICAL CAPSULE',
      headline: 'Kinetic Weather Armor',
      subhead: 'Three-layer Japanese memory taffeta that holds sculptural creases and repels downpours.',
      heroImage: p1.image,
      featuredProduct: p1,
      companionProduct: p0,
      hotspot: { x: '52%', y: '46%' },
    },
    {
      code: 'LOOK 03 // PARIS',
      season: 'ESSENTIAL WARDROBE',
      headline: 'Fluid Proportions',
      subhead: 'Bias-cut organic silk and structured wide-leg silhouettes designed for effortless motion.',
      heroImage: p2.image,
      featuredProduct: p2,
      companionProduct: p1,
      hotspot: { x: '50%', y: '55%' },
    },
  ];

  const activeLook = RUNWAY_LOOKS[activeLookIdx];

  const handleAddCompleteLook = () => {
    addToCart(activeLook.featuredProduct, 'M', 'Obsidian', 1);
    addToCart(activeLook.companionProduct, 'M', 'Obsidian', 1);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 1200);
    openCart();
  };

  return (
    <section className="px-3 sm:px-6 pt-2 pb-12 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left 7 Columns: Kinetic Editorial Stage & Interactive Look Controls */}
        <div className="lg:col-span-7 surface-card p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Top Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-signal)] animate-ping" />
              <span className="font-mono-tech text-xs uppercase tracking-wider font-semibold">
                {activeLook.code}
              </span>
            </div>
            <span className="font-mono-tech text-xs text-[var(--ink-muted)]">
              {activeLook.season}
            </span>
          </div>

          {/* Main Editorial Statement */}
          <div className="my-8 lg:my-auto py-4">
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-[4.6rem] tracking-[-0.04em] leading-[0.95] uppercase">
              {activeLook.headline.split(' ')[0]}{' '}
              <span className="font-editorial italic font-normal lowercase text-5xl sm:text-7xl xl:text-[5.4rem] text-[var(--accent-signal)] block sm:inline">
                {activeLook.headline.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[var(--ink-secondary)] max-w-xl leading-relaxed">
              {activeLook.subhead}
            </p>

            {/* Interactive "Shop This Look" Mini-Bundle Pod */}
            <div className="mt-8 p-4 rounded-2xl bg-[var(--bg-sub)]/75 border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeLook.featuredProduct.image}
                  alt={activeLook.featuredProduct.name}
                  className="w-14 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <span className="font-mono-tech text-[10px] uppercase text-[var(--accent-signal)] font-semibold block">
                    Featured Runway Piece
                  </span>
                  <h2 className="font-bold text-sm">{activeLook.featuredProduct.name}</h2>
                  <span className="font-mono-tech text-xs text-[var(--ink-secondary)]">
                    ${activeLook.featuredProduct.price} · Paired with {activeLook.companionProduct.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => openQuickView(activeLook.featuredProduct)}
                  className="px-3.5 py-2.5 rounded-full bg-[var(--bg-card)] text-xs font-semibold hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
                >
                  Inspect
                </button>
                <button
                  onClick={handleAddCompleteLook}
                  className="flex-1 sm:flex-initial btn-signal px-5 py-2.5 text-xs whitespace-nowrap"
                >
                  {bundleAdded ? '✓ Look Added' : '+ Add Complete Look'}
                </button>
              </div>
            </div>

            {/* Primary Navigation CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="btn-primary px-7 py-4 text-xs uppercase tracking-widest inline-flex items-center gap-3"
              >
                <span>Explore Full Collection</span>
                <span>→</span>
              </Link>
              <Link
                to="/journal"
                className="px-6 py-4 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--border-subtle)] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Editorial Film
              </Link>
            </div>
          </div>

          {/* Bottom Runway Look Switcher Tabs */}
          <div className="pt-6 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2.5">
            {RUNWAY_LOOKS.map((look, idx) => {
              const active = idx === activeLookIdx;
              return (
                <button
                  key={look.code}
                  onClick={() => setActiveLookIdx(idx)}
                  className={`p-3 rounded-2xl text-left transition-all border ${
                    active
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] border-transparent shadow-md'
                      : 'bg-[var(--bg-sub)]/60 hover:bg-[var(--bg-sub)] border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="font-mono-tech text-[10px] opacity-70">0{idx + 1}</div>
                  <div className="font-display font-bold text-xs sm:text-sm truncate mt-0.5">
                    {look.headline}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Interactive Hotspot Showcase Frame */}
        <div className="lg:col-span-5 relative rounded-[24px] overflow-hidden min-h-[520px] bg-[#141417] group shadow-xl">
          <img
            key={activeLook.heroImage}
            src={activeLook.heroImage}
            alt={activeLook.headline}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

          {/* Interactive Pulsing Garment Hotspot */}
          <div
            style={{ left: activeLook.hotspot.x, top: activeLook.hotspot.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <button
              onClick={() => openQuickView(activeLook.featuredProduct)}
              className="relative w-10 h-10 rounded-full bg-[var(--accent-signal)] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              title="Click to Quick-Shop Piece"
            >
              <span className="w-full h-full rounded-full bg-[var(--accent-signal)] animate-ping absolute opacity-60" />
              <span className="font-mono-tech text-xs font-bold relative">+</span>
            </button>
          </div>

          {/* Bottom Floating Glass Tag inside Image */}
          <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/15 text-white flex items-center justify-between gap-4">
            <div>
              <span className="font-mono-tech text-[10px] uppercase text-[#FF331F] font-bold block">
                TAP HOTSPOT TO INSPECT
              </span>
              <span className="font-display font-bold text-base">
                {activeLook.featuredProduct.name}
              </span>
            </div>
            <button
              onClick={() => {
                addToCart(activeLook.featuredProduct, 'M', 'Obsidian', 1);
                openCart();
              }}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-[#FF331F] hover:text-white transition-colors shrink-0"
            >
              Quick Add · ${activeLook.featuredProduct.price}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
