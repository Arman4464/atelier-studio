// src/components/MobileNav.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';
import { Logo } from './Logo';

export const MobileNav: React.FC = () => {
  const {
    isMobileNavOpen,
    closeMobileNav,
    openSearch,
    openWishlist,
    wishlistCount,
    toggleTheme,
  } = useAtelierBridge();

  if (!isMobileNavOpen) return null;

  const links = [
    { label: 'Index / Home', path: '/' },
    { label: 'Complete Collection', path: '/shop' },
    { label: 'Outerwear Archive', path: '/shop?category=Outerwear' },
    { label: 'Editorial Journal', path: '/journal' },
    { label: 'Client Portal', path: '/account' },
    { label: 'Atelier OS (Admin)', path: '/admin' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex p-3">
      <div
        onClick={closeMobileNav}
        className="fixed inset-0 bg-black/55 backdrop-blur-sm"
      />

      <aside className="relative z-10 w-full max-w-sm surface-modal rounded-[28px] h-full flex flex-col justify-between p-6 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <Logo size="sm" />
          <button
            onClick={closeMobileNav}
            className="w-9 h-9 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <nav className="my-auto py-6 space-y-2">
          {links.map((item, idx) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileNav}
              className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-sub)]/60 hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <span className="font-mono-tech text-xs text-[var(--accent-signal)] font-bold">
                  0{idx + 1}
                </span>
                <span className="font-display font-bold text-base uppercase tracking-tight">
                  {item.label}
                </span>
              </div>
              <span className="font-mono-tech text-sm opacity-60 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          ))}
        </nav>

        <div className="pt-5 border-t border-[var(--border-subtle)] space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                closeMobileNav();
                openSearch();
              }}
              className="py-3 px-4 rounded-2xl bg-[var(--bg-sub)] font-mono-tech text-xs font-semibold uppercase"
            >
              Search
            </button>
            <button
              onClick={() => {
                closeMobileNav();
                openWishlist();
              }}
              className="py-3 px-4 rounded-2xl bg-[var(--bg-sub)] font-mono-tech text-xs font-semibold uppercase"
            >
              ♥ Saved ({wishlistCount})
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full py-3.5 rounded-full btn-primary text-xs uppercase tracking-wider"
          >
            ◐ Switch Atmosphere
          </button>
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;
