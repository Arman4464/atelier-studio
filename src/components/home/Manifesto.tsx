import React from 'react';
import { Link } from 'react-router-dom';

export const Manifesto: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 px-5 sm:px-10 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large Left Visual Bento Card */}
        <div className="lg:col-span-7 relative rounded-[28px] overflow-hidden min-h-[460px] flex items-end p-8 sm:p-12 bg-[#141417] text-white">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
            alt="Atelier Craft"
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative z-10 max-w-lg">
            <span className="text-[11px] uppercase tracking-[0.25em] text-white/70 block mb-2">
              Material Philosophy
            </span>
            <h3 className="font-editorial italic text-4xl sm:text-5xl font-normal leading-[1.05]">
              Designed to move like liquid architecture.
            </h3>
          </div>
        </div>

        {/* Right Stacked Bento Column */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="flex-1 glass-card p-8 sm:p-10 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              01 — Textile Provenance
            </span>
            <p className="text-lg sm:text-xl font-normal leading-relaxed text-[var(--ink-primary)] my-6">
              We partner exclusively with family-owned mills in Biella and Kyoto—selecting organic virgin wools, raw silk habotai, and brushed cashmere that soften with every year of wear.
            </p>
            <Link
              to="/journal"
              className="text-xs font-semibold uppercase tracking-widest underline underline-offset-8 self-start text-purple-600 dark:text-purple-400 hover:text-[var(--ink-primary)] transition-colors"
            >
              Read the Journal →
            </Link>
          </div>

          <div className="glass-modal rounded-[28px] p-8 sm:p-10 flex items-center justify-between gap-6 relative overflow-hidden">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)] block">
                Complimentary Service
              </span>
              <h4 className="font-editorial italic text-2xl sm:text-3xl mt-1 text-[var(--ink-primary)]">
                Bespoke Hemming & Global Express Delivery
              </h4>
            </div>
            <Link
              to="/shop"
              className="w-12 h-12 rounded-full btn-prism flex items-center justify-center shrink-0 text-sm hover:scale-105 transition-transform"
            >
              ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
