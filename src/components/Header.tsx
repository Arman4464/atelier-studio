// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const {
    cartCount,
    wishlistCount,
    openCart,
    openSearch,
    openWishlist,
    openMobileNav,
    toggleTheme,
  } = useAtelierBridge();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Index', path: '/' },
    { label: 'Collection', path: '/shop' },
    { label: 'Outerwear', path: '/shop?category=Outerwear' },
    { label: 'Editorial', path: '/journal' },
    { label: 'Portal', path: '/account' },
  ];

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3 pb-2 pointer-events-none">
      <div
        className={`max-w-[1440px] mx-auto pointer-events-auto surface-glass rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? 'shadow-xl py-2' : ''
        }`}
      >
        {/* Left: Brand Lockup */}
        <Link to="/" className="shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Center: Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[var(--bg-sub)]/80 p-1 rounded-full border border-[var(--border-subtle)]">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname + location.search === item.path ||
                  (item.path === '/shop' && location.pathname === '/shop' && !location.search);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] shadow-sm'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Interactive Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={openSearch}
            className="px-3.5 py-2 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors text-xs font-medium flex items-center gap-2"
            title="Search Collection (⌘K)"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline-block font-mono-tech text-[10px] opacity-60">⌘K</kbd>
          </button>

          <button
            onClick={openWishlist}
            className="relative px-3.5 py-2 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors text-xs font-medium flex items-center gap-1.5"
            title="Saved Pieces"
          >
            <span>♥</span>
            <span className="hidden md:inline">Saved</span>
            {wishlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[var(--accent-signal)] text-white font-mono-tech text-[10px] flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors flex items-center justify-center text-xs"
            title="Switch Daylight / Nocturnal Mode"
          >
            ◐
          </button>

          <button
            onClick={openCart}
            className="btn-primary px-4 py-2 text-xs flex items-center gap-2"
          >
            <span>Bag</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[var(--accent-signal)] text-white font-mono-tech text-[10px] font-bold leading-none">
              {cartCount}
            </span>
          </button>

          <button
            onClick={openMobileNav}
            className="lg:hidden w-9 h-9 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs font-bold"
            aria-label="Open Menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
