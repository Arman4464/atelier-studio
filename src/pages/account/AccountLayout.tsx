import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { label: 'Overview', to: '/account', end: true },
  { label: 'Orders & Tracking', to: '/account/orders' },
  { label: 'Saved Wardrobe', to: '/account/wishlist' },
  { label: 'Addresses', to: '/account/addresses' },
  { label: 'Payment Methods', to: '/account/payment' },
  { label: 'Profile Settings', to: '/account/settings' },
];

export const AccountLayout: React.FC = () => {
  const authStore = useAuthStore() as any;
  const user =
    (typeof authStore.currentUser === 'function' ? authStore.currentUser() : authStore.user) || {
      name: 'Atelier Member',
      email: 'member@atelier.studio',
    };

  return (
    <main className="min-h-screen pt-28 pb-36 px-4 sm:px-8 max-w-[1400px] mx-auto">
      {/* Floating Luminous Profile Banner */}
      <div className="glass-card p-7 sm:p-10 mb-8 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full aura-badge flex items-center justify-center font-editorial italic text-2xl font-semibold shadow-inner">
            {(user.name || 'A')[0]}
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)] block">
              Private Client Portal
            </span>
            <h1 className="font-editorial italic text-3xl sm:text-4xl mt-0.5">
              Welcome back, {user.name || 'Member'}
            </h1>
          </div>
        </div>
        <span className="px-4 py-1.5 rounded-full aura-badge text-xs font-medium">
          Complimentary Express Tier · {user.email}
        </span>
      </div>

      {/* Detached Glass Sidebar + Glass Content Island */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-3 glass-card p-3 lg:sticky lg:top-24">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'btn-prism shadow-md'
                      : 'text-[var(--ink-secondary)] hover:bg-white/40 dark:hover:bg-white/5 hover:text-[var(--ink-primary)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="lg:col-span-9 glass-card p-6 sm:p-10 min-h-[520px]">
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default AccountLayout;
