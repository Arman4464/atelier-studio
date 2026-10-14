import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useThemeStore, THEMES, THEME_LIST, type StudioTheme } from '../store/themeStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const [timeStr, setTimeStr] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);

  // Store hooks with defensive adapters
  const cartStore = useCartStore() as any;
  const uiStore = useUIStore() as any;
  const themeStore = useThemeStore() as any;

  const currentTheme: StudioTheme = (themeStore.theme in THEMES ? themeStore.theme : 'klein') as StudioTheme;

  const items = cartStore.items || cartStore.cart || [];
  const totalCount =
    typeof cartStore.cartCount === 'function'
      ? cartStore.cartCount()
      : items.reduce((acc: number, item: any) => acc + (item.quantity || item.qty || 1), 0);

  const openCart = () => {
    if (uiStore.openCart) uiStore.openCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(true);
    else if (uiStore.toggleCart) uiStore.toggleCart();
  };

  const openSearch = () => {
    if (uiStore.openSearch) uiStore.openSearch();
    else if (uiStore.setSearchOpen) uiStore.setSearchOpen(true);
  };

  const openWishlist = () => {
    if (uiStore.openWishlist) uiStore.openWishlist();
    else if (uiStore.setWishlistOpen) uiStore.setWishlistOpen(true);
  };

  const openMobileNav = () => {
    if (uiStore.openMobileNav) uiStore.openMobileNav();
    else if (uiStore.setMobileNavOpen) uiStore.setMobileNavOpen(true);
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { index: '01', label: 'ARCHIVE / SHOP', path: '/shop' },
    { index: '02', label: 'SILHOUETTES', path: '/shop?cat=Outerwear' },
    { index: '03', label: 'LAB JOURNAL', path: '/journal' },
    { index: '04', label: 'CLIENTELE', path: '/account' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled ? 'bg-[var(--bg-canvas)]/95 backdrop-blur-md' : 'bg-[var(--bg-canvas)]'
      } hairline-b`}
    >
      {/* Top Kinetic System Bar with 4 Live Palette Buttons */}
      <div className="grid grid-cols-12 hairline-b text-[11px] font-ledger uppercase tracking-wider text-[var(--ink-secondary)]">
        <div className="col-span-12 lg:col-span-4 px-4 py-1.5 hairline-r flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent-signal)] animate-pulse" />
            <span className="font-semibold text-[var(--ink-primary)]">SYS-RUN // FLAGSHIP 04</span>
          </div>
          <span className="text-[10px] text-[var(--ink-muted)]">MILAN · TOKYO · NYC</span>
        </div>

        {/* 4 Live Palette Swatches */}
        <div className="col-span-12 sm:col-span-8 lg:col-span-5 px-3 py-1 hairline-r flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-[var(--ink-muted)] font-semibold shrink-0 mr-1">
            PALETTE:
          </span>
          {THEME_LIST.map((key) => {
            const conf = THEMES[key];
            const isActive = currentTheme === key;
            return (
              <button
                key={key}
                onClick={() => themeStore.setTheme(key)}
                className={`px-2 py-0.5 text-[10px] shrink-0 font-medium tracking-normal transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-bold shadow-xs'
                    : 'bg-[var(--bg-sub)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
                title={`Switch to ${conf.name}`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: conf.dotColor }}
                />
                <span>{conf.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Clock & Status */}
        <div className="hidden sm:flex col-span-4 lg:col-span-3 px-4 py-1.5 items-center justify-between text-[11px]">
          <span className="text-[var(--ink-muted)]">SYS CLOCK</span>
          <span className="font-medium text-[var(--ink-primary)]">{timeStr}</span>
        </div>
      </div>

      {/* Main Architectural Navigation Grid */}
      <div className="grid grid-cols-12 items-stretch min-h-[64px]">
        {/* Brand Title */}
        <div className="col-span-6 lg:col-span-3 px-5 py-3 flex items-center justify-between hairline-r">
          <Link to="/" className="group flex flex-col">
            <span className="font-grotesk font-black text-2xl tracking-[-0.04em] leading-none text-[var(--ink-primary)]">
              ATELIER<span className="text-[var(--accent-electric)]">.</span>
            </span>
            <span className="font-ledger text-[9px] tracking-[0.2em] text-[var(--ink-muted)] mt-1 font-semibold uppercase">
              CONCEPT FLAGSHIP LAB
            </span>
          </Link>
          <span className="hidden sm:inline-block font-ledger text-[10px] px-2 py-0.5 bg-[var(--bg-sub)] text-[var(--ink-secondary)] font-bold">
            {THEMES[currentTheme]?.tag || 'T-01'}
          </span>
        </div>

        {/* Numbered Index Navigation */}
        <nav className="hidden lg:grid lg:col-span-6 grid-cols-4 hairline-r">
          {navItems.map((item, idx) => {
            const isActive =
              location.pathname === item.path ||
              (item.path.includes('?') && location.pathname + location.search === item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-4 flex flex-col justify-between py-2.5 transition-colors relative group ${
                  idx < 3 ? 'hairline-r' : ''
                } ${
                  isActive
                    ? 'bg-[var(--bg-sub)] text-[var(--ink-primary)]'
                    : 'hover:bg-[var(--bg-sub)]/60'
                }`}
              >
                <div className="flex items-center justify-between font-ledger text-[10px] text-[var(--ink-muted)]">
                  <span>/{item.index}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-electric)] font-bold">
                    ↗
                  </span>
                </div>
                <span className="font-ledger text-xs font-semibold tracking-tight text-[var(--ink-primary)]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Search, Wishlist, Bag, Mobile Nav) */}
        <div className="col-span-6 lg:col-span-3 flex items-stretch justify-end">
          <button
            onClick={openSearch}
            className="px-3 sm:px-4 hairline-r font-ledger text-xs uppercase hover:bg-[var(--bg-sub)] transition-colors flex items-center gap-1.5 text-[var(--ink-primary)]"
            title="Search Archive (Cmd+K)"
          >
            <span className="text-[var(--ink-muted)]">[</span>
            <span className="font-semibold">INDEX</span>
            <span className="hidden sm:inline text-[10px] text-[var(--ink-muted)]">⌘K</span>
            <span className="text-[var(--ink-muted)]">]</span>
          </button>

          <button
            onClick={openWishlist}
            className="hidden sm:flex px-4 hairline-r font-ledger text-xs uppercase hover:bg-[var(--bg-sub)] transition-colors items-center font-medium text-[var(--ink-primary)]"
          >
            SAVED
          </button>

          <button
            onClick={openCart}
            className="px-4 sm:px-5 font-ledger text-xs uppercase bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-electric)] hover:text-white transition-colors flex items-center gap-2 font-bold"
          >
            <span>BAG</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-[var(--accent-signal)] text-[#060A17] font-black">
              {String(totalCount).padStart(2, '0')}
            </span>
          </button>

          <button
            onClick={openMobileNav}
            className="lg:hidden px-4 hairline-l font-ledger text-xs uppercase hover:bg-[var(--bg-sub)] text-[var(--ink-primary)] font-bold"
          >
            MENU
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
