import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="pt-20 pb-28 px-5 sm:px-10 max-w-[1440px] mx-auto text-[var(--ink-primary)]">
      <div className="rounded-[36px] bg-[var(--bg-sub)] p-8 sm:p-14 lg:p-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand Colophon */}
          <div className="md:col-span-6 space-y-4">
            <span className="font-editorial italic text-4xl sm:text-5xl font-normal leading-none block">
              Atelier Studio
            </span>
            <p className="text-sm sm:text-base text-[var(--ink-secondary)] max-w-md font-light leading-relaxed">
              Spatial Glass & Editorial Fluidity. Dedicated to small-batch sculptural garments, virgin Italian wools, and organic Japanese textiles tailored for fluid everyday movement.
            </p>
            <div className="pt-4 text-xs text-[var(--ink-muted)]">
              Milan · Paris · Tokyo · New York
            </div>
          </div>

          {/* Navigation Directory */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] block">
              Collection
            </span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop" className="hover:opacity-70 transition-opacity">
                  All Silhouettes
                </Link>
              </li>
              <li>
                <Link to="/shop?cat=Outerwear" className="hover:opacity-70 transition-opacity">
                  Tailored Outerwear
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:opacity-70 transition-opacity">
                  Lookbook Journal
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:opacity-70 transition-opacity">
                  Client Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Philosophy & Services */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] block">
              Provenance
            </span>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
              Every garment is numbered and cut in limited quantities to eliminate excess production. Free carbon-neutral global express shipping on all orders.
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-block px-4 py-2 rounded-full glass-pill text-[11px] font-medium"
              >
                Studio Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Imprint */}
        <div className="mt-14 pt-8 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
          <span>© {new Date().getFullYear()} Atelier Studio. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/journal" className="hover:text-[var(--ink-primary)]">Privacy</Link>
            <Link to="/journal" className="hover:text-[var(--ink-primary)]">Terms</Link>
            <Link to="/journal" className="hover:text-[var(--ink-primary)]">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
