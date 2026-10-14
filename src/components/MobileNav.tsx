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
    { idx: '01', label: 'COMPLETE ARCHIVE / SHOP', to: '/shop' },
    { idx: '02', label: 'OUTERWEAR SILHOUETTES', to: '/shop?cat=Outerwear' },
    { idx: '03', label: 'TEXTILE MONOGRAPHS', to: '/journal' },
    { idx: '04', label: 'CLIENTELE DOSSIER', to: '/account' },
    { idx: '05', label: 'ATELIER TERMINAL [ADMIN]', to: '/admin' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      <div onClick={closeNav} className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-sm bg-[var(--bg-canvas)] text-[var(--ink-primary)] h-full flex flex-col justify-between hairline-r font-ledger">
        <div className="p-5 hairline-b flex items-center justify-between">
          <span className="font-grotesk font-extrabold text-lg">
            ATELIER<span className="font-editorial italic font-normal text-xl ml-1">Studio</span>
          </span>
          <button onClick={closeNav} className="px-2.5 py-1 hairline-box text-xs">
            [ CLOSE ]
          </button>
        </div>

        <nav className="flex-1 divide-y divide-[var(--border-hairline)]">
          {links.map((item) => (
            <Link
              key={item.idx}
              to={item.to}
              onClick={closeNav}
              className="flex items-center justify-between p-6 hover:bg-[var(--bg-sub)] transition-colors"
            >
              <div>
                <span className="text-[10px] text-[var(--ink-muted)] block">/{item.idx}</span>
                <span className="font-grotesk font-bold text-base uppercase">{item.label}</span>
              </div>
              <span className="text-sm text-[var(--accent-stamp)]">↗</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 bg-[var(--bg-sub)] hairline-t text-xs space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full py-3 hairline-box bg-[var(--bg-canvas)] uppercase font-medium"
          >
            [ INVERT ATELIER LIGHTING ]
          </button>
          <div className="text-[10px] text-[var(--ink-muted)] flex justify-between">
            <span>MILAN // KYOTO</span>
            <span>EDITION AW//26</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
