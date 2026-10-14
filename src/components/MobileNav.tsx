import React from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useThemeStore } from '../store/themeStore';

export const MobileNav: React.FC = () => {
  const uiStore = useUIStore() as any;
  const themeStore = useThemeStore() as any;

  const isOpen = Boolean(uiStore.isMobileNavOpen ?? uiStore.mobileNavOpen);
  const closeNav = () => {
    if (uiStore.closeMobileNav) uiStore.closeMobileNav();
    else if (uiStore.setMobileNavOpen) uiStore.setMobileNavOpen(false);
  };

  const toggleTheme = () => {
    if (themeStore.toggleTheme) themeStore.toggleTheme();
    else document.documentElement.classList.toggle('dark');
  };

  if (!isOpen) return null;

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Collection', to: '/shop' },
    { label: 'Tailored Outerwear', to: '/shop?cat=Outerwear' },
    { label: 'Editorial Monographs', to: '/journal' },
    { label: 'Clientele Account', to: '/account' },
    { label: 'Studio Portal', to: '/admin' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex p-4 sm:p-6">
      <div onClick={closeNav} className="fixed inset-0 bg-black/45 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-sm glass-modal rounded-[32px] h-full flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
        <div className="flex items-center justify-between pb-5 border-b border-[var(--glass-border-subtle)]">
          <Link to="/" onClick={closeNav} className="font-editorial italic text-2xl">
            Atelier Studio
          </Link>
          <button
            onClick={closeNav}
            className="w-9 h-9 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs hover:scale-105 transition-transform"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-8 space-y-4 overflow-y-auto no-scrollbar">
          {links.map((item, idx) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={closeNav}
              className="block font-editorial italic text-3xl sm:text-4xl text-[var(--ink-primary)] hover:opacity-70 transition-opacity"
            >
              <span className="text-xs uppercase tracking-widest font-sans not-italic text-[var(--ink-muted)] block mb-1">
                0{idx + 1}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-5 border-t border-[var(--glass-border-subtle)] flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full glass-pill text-xs font-medium flex items-center gap-2"
          >
            <span>Atmosphere</span>
            <span>◐</span>
          </button>

          <Link
            to="/shop"
            onClick={closeNav}
            className="btn-prism px-5 py-2 text-xs"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
