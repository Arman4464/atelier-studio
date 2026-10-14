import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ACCOUNT_LINKS = [
  { label: '01 / OVERVIEW', to: '/account', end: true },
  { label: '02 / WAYBILLS (ORDERS)', to: '/account/orders' },
  { label: '03 / DESTINATIONS', to: '/account/addresses' },
  { label: '04 / SAVED SPECIMENS', to: '/account/wishlist' },
  { label: '05 / SETTLEMENT METHODS', to: '/account/payment' },
  { label: '06 / DOSSIER SETTINGS', to: '/account/settings' },
];

export const AccountLayout: React.FC = () => {
  const authStore = useAuthStore() as any;
  const user =
    (typeof authStore.currentUser === 'function' ? authStore.currentUser() : authStore.user) || {
      name: 'Registered Client',
      email: 'client@atelier.studio',
    };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <div className="px-6 sm:px-10 py-8 hairline-b flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-ledger text-xs uppercase text-[var(--accent-stamp)]">
            // CLIENTELE DOSSIER
          </span>
          <h1 className="font-grotesk font-extrabold text-3xl sm:text-4xl uppercase mt-1">
            {user.name || 'Archive Member'}
          </h1>
        </div>
        <div className="font-ledger text-xs text-[var(--ink-secondary)]">
          ID: {user.email}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[70vh]">
        <aside className="lg:col-span-3 hairline-r bg-[var(--bg-sub)]">
          <nav className="flex lg:flex-col overflow-x-auto">
            {ACCOUNT_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-6 py-4 font-ledger text-xs uppercase whitespace-nowrap hairline-b transition-colors ${
                    isActive
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-bold'
                      : 'hover:bg-[var(--bg-canvas)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="lg:col-span-9 p-6 sm:p-10 lg:p-12">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AccountLayout;
