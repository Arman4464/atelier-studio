import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useThemeStore } from '../store/themeStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const [timeStr, setTimeStr] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);

  // Store hooks (with defensive fallbacks in case property names vary)
  const cartStore = useCartStore() as any;
  const uiStore = useUIStore() as any;
  const themeStore = useThemeStore() as any;

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

  const toggleTheme = () => {
    if (themeStore.toggleTheme) themeStore.toggleTheme();
    else document.documentElement.classList.toggle('dark');
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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { index: '01', label: 'ARCHIVE / SHOP', path: '/shop' },
    { index: '02', label: 'SILHOUETTES', path: '/shop?cat=Outerwear' },
    { index: '03', label: 'JOURNAL', path: '/journal' },
    { index: '04', label: 'CLIENTELE', path: '/account' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled ? 'bg-[var(--bg-canvas)]/95 backdrop-blur-md' : 'bg-[var(--bg-canvas)]'
      } hairline-b`}
    >
      {/* Top Technical Specification Ledger */}
      <div className="hidden md:grid grid-cols-12 hairline-b text-[11px] font-ledger uppercase tracking-wider text-[var(--ink-secondary)]">
        <div className="col-span-4 px-5 py-1.5 hairline-r flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-stamp)] animate-pulse" />
          <span>EDITION N° 26 // AUTUMN—WINTER GARMENT STUDY</span>
        </div>
        <div className="col-span-4 px-5 py-1.5 hairline-r flex items-center justify-between">
          <span>LOC: 45.4642° N, 9.1900° E</span>
          <span>ATELIER CLOCK: {timeStr}</span>
        </div>
        <div className="col-span-4 px-5 py-1.5 flex items-center justify-between">
          <span>SMALL-BATCH PRODUCTION</span>
          <button
            onClick={toggleTheme}
            className="hover:text-[var(--ink-primary)] underline underline-offset-4"
          >
            [ INVERT LIGHT ]
          </button>
        </div>
      </div>

      {/* Main Architectural Navigation Grid */}
      <div className="grid grid-cols-12 items-stretch min-h-[68px]">
        {/* Brand Stamp */}
        <div className="col-span-6 lg:col-span-3 px-5 flex items-center justify-between hairline-r">
          <Link to="/" className="group flex flex-col">
            <span className="font-grotesk font-extrabold text-xl tracking-[-0.04em] leading-none">
              ATELIER<span className="font-editorial italic font-normal text-2xl ml-1">Studio</span>
            </span>
            <span className="font-ledger text-[9px] tracking-[0.22em] text-[var(--ink-muted)] mt-0.5">
              DEPT. OF TEXTILE RESEARCH
            </span>
          </Link>
          <span className="hidden sm:inline-block font-ledger text-[10px] px-1.5 py-0.5 border border-[var(--border-hairline)] text-[var(--ink-muted)]">
            REF.884
          </span>
        </div>

        {/* Numbered Index Navigation */}
        <nav className="hidden lg:grid lg:col-span-6 grid-cols-4 hairline-r">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path || (item.path.includes('?') && location.pathname + location.search === item.path);
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
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-stamp)]">
                    ↗
                  </span>
                </div>
                <span className="font-ledger text-xs font-medium tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Search, Saved, Bag) */}
        <div className="col-span-6 lg:col-span-3 flex items-stretch justify-end">
          <button
            onClick={openSearch}
            className="px-4 hairline-r font-ledger text-xs uppercase hover:bg-[var(--bg-sub)] transition-colors flex items-center gap-1.5"
            title="Search Archive"
          >
            <span className="text-[var(--ink-muted)]">[</span>
            <span>INDEX</span>
            <span className="hidden sm:inline text-[10px] text-[var(--ink-muted)]">⌘K</span>
            <span className="text-[var(--ink-muted)]">]</span>
          </button>

          <button
            onClick={openWishlist}
            className="hidden sm:flex px-4 hairline-r font-ledger text-xs uppercase hover:bg-[var(--bg-sub)] transition-colors items-center"
          >
            SAVED
          </button>

          <button
            onClick={openCart}
            className="px-5 font-ledger text-xs uppercase bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] transition-colors flex items-center gap-2 font-medium"
          >
            <span>BAG</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-canvas)] text-[var(--ink-primary)] font-bold">
              {String(totalCount).padStart(2, '0')}
            </span>
          </button>

          <button
            onClick={openMobileNav}
            className="lg:hidden px-4 hairline-l font-ledger text-xs uppercase hover:bg-[var(--bg-sub)]"
          >
            MENU
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
