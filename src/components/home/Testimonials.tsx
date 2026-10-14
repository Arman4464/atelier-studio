import React from "react";
import { testimonials } from "../../data/content";
import Rating from "../Rating";

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 px-5 sm:px-10 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-3">
            Client Impressions
          </span>
          <h2 className="font-editorial italic text-4xl sm:text-6xl font-normal leading-tight">
            Worn &amp; Enduring
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Rating value={5} />
          <span className="text-xs text-[var(--ink-muted)]">
            4.9 rating across small-batch patrons
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="glass-card p-8 flex flex-col justify-between space-y-6 hover:translate-y-[-2px] transition-transform duration-300"
          >
            <div>
              <Rating value={t.rating} className="mb-4" />
              <p className="font-editorial italic text-2xl leading-snug text-[var(--ink-primary)]">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
            <div className="pt-5 border-t border-[var(--glass-border-subtle)] flex items-center justify-between">
              <div>
                <span className="block text-sm font-semibold">{t.author}</span>
                <span className="text-xs text-[var(--ink-muted)]">{t.location}</span>
              </div>
              {t.verified && (
                <span className="px-3 py-1 rounded-full aura-badge text-[10px] font-medium tracking-wide">
                  Verified Client
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
