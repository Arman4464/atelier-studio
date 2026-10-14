import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Analytics', to: '/admin/analytics' },
  { label: 'Discounts', to: '/admin/discounts' },
  { label: 'Settings', to: '/admin/settings' },
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="ambient-canvas min-h-screen p-4 sm:p-6 pb-28">
      {/* Top Floating Glass Admin Bar */}
      <header className="glass-pill rounded-full px-6 py-3.5 mb-6 flex items-center justify-between max-w-[1500px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full aura-badge text-[11px] font-semibold uppercase tracking-wider">
            Atelier OS
          </span>
          <span className="font-editorial italic text-2xl">Studio Command</span>
        </div>
        <Link
          to="/"
          className="px-4 py-2 rounded-full bg-[var(--ink-primary)] text-[var(--bg-canvas)] text-xs font-medium hover:opacity-90 transition-opacity"
        >
          View Live Storefront ↗
        </Link>
      </header>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-2 glass-card p-3 lg:sticky lg:top-6">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'btn-prism'
                      : 'text-[var(--ink-secondary)] hover:bg-white/40 dark:hover:bg-white/5'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-10 glass-card p-6 sm:p-10 min-h-[75vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
