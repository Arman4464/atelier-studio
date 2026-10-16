import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useThemeStore } from '../store/themeStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const [isCompact, setIsCompact] = useState(false);

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

  const toggleTheme = () => {
    if (themeStore.toggleTheme) {
      themeStore.toggleTheme();
    } else {
      document.documentElement.classList.toggle('dark');
    }
  };

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dockLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collection', path: '/shop' },
    { label: 'Editorial', path: '/journal' },
    { label: 'Account', path: '/account' },
  ];

  return (
    <>
      {/* TOP FLOATING CORNERS (Pointer-events-none wrapper so middle of screen stays 100% open) */}
      <header className="fixed top-0 inset-x-0 z-40 pointer-events-none px-5 sm:px-8 pt-5 flex items-center justify-between">
        {/* Top-Left Floating Brand Capsule */}
        <Link
          to="/"
          className="pointer-events-auto glass-pill px-5 py-2.5 rounded-full flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          <span className="font-editorial italic text-2xl tracking-tight font-semibold leading-none">
            Atelier
          </span>
          <span
            className={`text-[10px] uppercase tracking-[0.25em] text-[var(--ink-secondary)] transition-all duration-300 overflow-hidden ${
              isCompact ? 'max-w-0 opacity-0' : 'max-w-[90px] opacity-100'
            }`}
          >
            Studio
          </span>
        </Link>

        {/* Top-Right Floating Utility Capsule */}
        <div className="pointer-events-auto glass-pill p-1.5 rounded-full flex items-center gap-1">
          <button
            onClick={openSearch}
            className="px-3.5 py-2 rounded-full text-xs font-medium hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors flex items-center gap-1.5"
            title="Search Archive"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
            </svg>
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            onClick={openWishlist}
            className="hidden md:inline-flex px-3.5 py-2 rounded-full text-xs font-medium hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
          >
            Saved
          </button>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs hover:bg-[var(--bg-sub)] transition-colors"
            title="Switch Atmosphere"
          >
            ◐
          </button>

          <button
            onClick={openCart}
            className="px-4 py-2 rounded-full text-xs font-semibold btn-prism flex items-center gap-2"
          >
            <span>Bag</span>
            <span className="w-5 h-5 rounded-full bg-[var(--bg-canvas)] dark:bg-[#08090E] text-[var(--ink-primary)] dark:text-white text-[10px] flex items-center justify-center font-bold">
              {totalCount}
            </span>
          </button>
        </div>
      </header>

      {/* BOTTOM-CENTER FLOATING SPATIAL DOCK */}
      <nav
        aria-label="Primary Spatial Navigation"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-island p-1.5 rounded-full flex items-center gap-1 shadow-2xl"
      >
        {dockLinks.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-purple-600 text-white dark:bg-purple-500/90 dark:text-white shadow-md shadow-purple-500/30 scale-[1.02] font-semibold'
                  : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Header;
