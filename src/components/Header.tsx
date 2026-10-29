// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';
import { Logo } from './Logo';
import { soundEngine } from './SpatialEnvironment';

type Atmosphere = 'alabaster' | 'obsidian' | 'verdigris';

const ATMOSPHERES: { id: Atmosphere; label: string; color: string }[] = [
  { id: 'alabaster', label: 'Stone', color: '#F6F5F0' },
  { id: 'obsidian', label: 'Obsidian', color: '#09090C' },
  { id: 'verdigris', label: 'Emerald', color: '#0F231C' },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [atmo, setAtmo] = useState<Atmosphere>('alabaster');
  const [soundOn, setSoundOn] = useState<boolean>(soundEngine.enabled);

  const {
    cartCount,
    wishlistCount,
    openCart,
    openSearch,
    openWishlist,
    openMobileNav,
  } = useAtelierBridge();

  useEffect(() => {
    const saved = (localStorage.getItem('atelier_atmo') as Atmosphere) || 'alabaster';
    applyAtmosphere(saved);
  }, []);

  const applyAtmosphere = (next: Atmosphere) => {
    setAtmo(next);
    document.documentElement.setAttribute('data-atmosphere', next);
    document.documentElement.classList.toggle('dark', next !== 'alabaster');
    localStorage.setItem('atelier_atmo', next);
    soundEngine.playTick(320, 0.04);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Index', path: '/' },
    { label: 'Collection', path: '/shop' },
    { label: 'Outerwear', path: '/shop?category=Outerwear' },
    { label: 'Journal', path: '/journal' },
    { label: 'Portal', path: '/account' },
  ];

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3 pb-2 pointer-events-none">
      <div
        className={`max-w-[1440px] mx-auto pointer-events-auto surface-glass rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 transition-all duration-300 ${
          scrolled ? 'shadow-2xl py-2' : ''
        }`}
      >
        {/* Left: Emblem + Live Sound Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="shrink-0">
            <Logo size="sm" />
          </Link>

          <button
            onClick={() => setSoundOn(soundEngine.toggle())}
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-sub)] font-mono-tech text-[10px] uppercase text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors"
            title="Toggle Tactile Sound Synthesizer"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                soundOn ? 'bg-[var(--accent-signal)] animate-pulse' : 'bg-[var(--ink-muted)]'
              }`}
            />
            <span>{soundOn ? 'SFX ON' : 'MUTED'}</span>
          </button>
        </div>

        {/* Center: Spatial Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[var(--bg-sub)]/85 p-1 rounded-full border border-[var(--border-subtle)]">
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
                onMouseEnter={() => soundEngine.playTick(150, 0.015)}
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

        {/* Right: 3-Atmosphere Switcher + Search + Vault + Bag */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 3-Atmosphere Swatch Capsule */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--bg-sub)] p-1 rounded-full border border-[var(--border-subtle)]">
            {ATMOSPHERES.map((a) => (
              <button
                key={a.id}
                onClick={() => applyAtmosphere(a.id)}
                className={`px-2.5 py-1 rounded-full font-mono-tech text-[10px] flex items-center gap-1.5 transition-all ${
                  atmo === a.id
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-bold shadow-sm'
                    : 'text-[var(--ink-secondary)] opacity-75 hover:opacity-100'
                }`}
                title={`Switch to ${a.label} Atmosphere`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-current"
                  style={{ backgroundColor: a.color }}
                />
                <span className="hidden xl:inline">{a.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={openSearch}
            className="px-3.5 py-2 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors text-xs font-semibold flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
            </svg>
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            onClick={openWishlist}
            className="relative px-3.5 py-2 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors text-xs font-semibold flex items-center gap-1.5"
          >
            <span>♥</span>
            {wishlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[var(--accent-signal)] text-white font-mono-tech text-[10px] flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
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
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
