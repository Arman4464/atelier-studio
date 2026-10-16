// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="px-3 sm:px-6 pb-12 pt-16 max-w-[1440px] mx-auto">
      <div className="surface-card p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-4">
          <Logo size="md" />
          <p className="text-sm text-[var(--ink-secondary)] max-w-sm leading-relaxed">
            Architectural garments and kinetic outerwear engineered from high-density Italian and Japanese textiles.
          </p>
          <div className="font-mono-tech text-xs text-[var(--ink-muted)]">
            MILAN · KYOTO · PARIS
          </div>
        </div>

        <div className="md:col-span-3 space-y-2.5 text-xs">
          <span className="font-mono-tech uppercase text-[var(--accent-signal)] font-bold block mb-3">
            01 // Navigation
          </span>
          <ul className="space-y-2 font-medium text-[var(--ink-secondary)]">
            <li><Link to="/shop" className="hover:text-[var(--ink-primary)]">Complete Archive</Link></li>
            <li><Link to="/shop?category=Outerwear" className="hover:text-[var(--ink-primary)]">Outerwear</Link></li>
            <li><Link to="/journal" className="hover:text-[var(--ink-primary)]">Editorial Journal</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4 space-y-2.5 text-xs">
          <span className="font-mono-tech uppercase text-[var(--accent-signal)] font-bold block mb-3">
            02 // Client Portal
          </span>
          <ul className="space-y-2 font-medium text-[var(--ink-secondary)]">
            <li><Link to="/account" className="hover:text-[var(--ink-primary)]">Account Overview</Link></li>
            <li><Link to="/account/orders" className="hover:text-[var(--ink-primary)]">Order Tracking</Link></li>
            <li><Link to="/admin" className="hover:text-[var(--ink-primary)]">Studio Command (Admin)</Link></li>
          </ul>
        </div>

        <div className="md:col-span-12 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs text-[var(--ink-muted)]">
          <span>© {new Date().getFullYear()} ATELIER STUDIO LAB.</span>
          <span>WORLDWIDE EXPRESS COURIER</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
