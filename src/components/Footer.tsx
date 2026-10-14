import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="px-4 sm:px-8 pb-28 pt-12 max-w-[1440px] mx-auto">
      <div className="glass-card p-8 sm:p-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-4">
          <span className="font-editorial italic text-4xl tracking-tight block">
            Atelier Studio
          </span>
          <p className="text-sm text-[var(--ink-secondary)] max-w-sm leading-relaxed font-light">
            Sculptural ready-to-wear crafted from organic Italian wool, Japanese habotai silk, and weightless cashmere.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full aura-badge text-[11px] font-medium">
              Milan · Kyoto · Paris
            </span>
          </div>
        </div>

        <div className="md:col-span-3 space-y-3 text-xs">
          <span className="uppercase tracking-[0.2em] text-[var(--ink-muted)] font-semibold block mb-3">
            Collection
          </span>
          <ul className="space-y-2.5 text-[var(--ink-secondary)]">
            <li><Link to="/shop" className="hover:text-[var(--ink-primary)]">All Ready-to-Wear</Link></li>
            <li><Link to="/shop?category=Outerwear" className="hover:text-[var(--ink-primary)]">Outerwear & Coats</Link></li>
            <li><Link to="/journal" className="hover:text-[var(--ink-primary)]">Editorial Journal</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4 space-y-3 text-xs">
          <span className="uppercase tracking-[0.2em] text-[var(--ink-muted)] font-semibold block mb-3">
            Client Services
          </span>
          <ul className="space-y-2.5 text-[var(--ink-secondary)]">
            <li><Link to="/account" className="hover:text-[var(--ink-primary)]">Client Portal & Orders</Link></li>
            <li><Link to="/account/wishlist" className="hover:text-[var(--ink-primary)]">Saved Wardrobe</Link></li>
            <li><Link to="/admin" className="hover:text-[var(--ink-primary)]">Atelier Studio OS (Admin)</Link></li>
          </ul>
        </div>

        <div className="md:col-span-12 pt-8 border-t border-[var(--glass-border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
          <span>© {new Date().getFullYear()} Atelier Studio. Crafted with spatial glass.</span>
          <span>Complimentary Worldwide Express Courier</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
