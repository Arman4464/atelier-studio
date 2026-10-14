import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';

const ADMIN_LINKS = [
  { label: '01 / LEDGER OVERVIEW', to: '/admin', end: true },
  { label: '02 / GARMENT SPECIMENS', to: '/admin/products' },
  { label: '03 / WAYBILL DISPATCHES', to: '/admin/orders' },
  { label: '04 / CLIENTELE REGISTRY', to: '/admin/customers' },
  { label: '05 / VALUATION & ANALYTICS', to: '/admin/analytics' },
  { label: '06 / BATCH GRANTS (DISCOUNTS)', to: '/admin/discounts' },
  { label: '07 / STUDIO PARAMETERS', to: '/admin/settings' },
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--ink-primary)]">
      {/* Top Operations Bar */}
      <header className="px-6 py-4 hairline-b bg-[var(--ink-primary)] text-[var(--bg-canvas)] flex items-center justify-between font-ledger text-xs">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-[var(--accent-stamp)] text-white font-bold">
            TERMINAL
          </span>
          <span className="uppercase tracking-widest">
            ATELIER STUDIO // INVENTORY & DISPATCH OPERATIONS
          </span>
        </div>
        <Link to="/" className="underline uppercase">
          [ EXIT TO PUBLIC ARCHIVE ↗ ]
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-52px)]">
        <aside className="lg:col-span-3 xl:col-span-2 hairline-r bg-[var(--bg-sub)]">
          <nav className="flex lg:flex-col overflow-x-auto">
            {ADMIN_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-5 py-4 font-ledger text-[11px] uppercase whitespace-nowrap hairline-b transition-colors ${
                    isActive
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-bold'
                      : 'hover:bg-[var(--bg-canvas)] text-[var(--ink-secondary)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-9 xl:col-span-10 p-6 sm:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
