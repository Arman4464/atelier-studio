import React from "react";
import { Link } from "react-router-dom";
import { Package, Heart, MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

export const AccountOverview: React.FC = () => {
  const user = useAuthStore((s) => s.currentUser());
  const wishlistCount = useCartStore((s) => s.wishlist.length);
  const currency = useCartStore((s) => s.currency);

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const recentOrders = user.orders.slice(0, 3);

  const stats = [
    { label: "Orders", value: user.orders.length, icon: Package, to: "/account/orders" },
    { label: "Wishlist", value: wishlistCount, icon: Heart, to: "/account/wishlist" },
    { label: "Addresses", value: user.addresses.length, icon: MapPin, to: "/account/addresses" },
    { label: "Member Since", value: memberSince, icon: Calendar, to: "/account/settings", isText: true },
  ];

  return (
    <div>
      <span className="mb-2 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
        Private Client
      </span>
      <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
        Welcome back, {user.name.split(" ")[0]}.
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="glass-card group rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 group-hover:scale-105 transition-transform">
              <s.icon size={17} />
            </div>
            <div className={s.isText ? "font-display text-base font-medium text-[var(--ink-primary)]" : "font-display text-3xl font-light text-[var(--ink-primary)]"}>
              {s.value}
            </div>
            <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-light text-[var(--ink-primary)]">Recent Acquisitions</h2>
          <Link
            to="/account/orders"
            className="glass-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] flex items-center gap-1.5"
          >
            View All <ArrowUpRight size={13} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="glass-card rounded-[26px] p-10 text-center">
            <p className="mb-4 text-sm text-[var(--ink-secondary)]">You haven't placed an order yet.</p>
            <Link to="/shop" className="btn-prism inline-flex px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider">
              Explore Collection &rarr;
            </Link>
          </div>
        ) : (
          <div className="glass-card rounded-[28px] overflow-hidden divide-y divide-black/5 dark:divide-white/10">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-white/40 dark:hover:bg-white/5"
              >
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 flex-shrink-0 rounded-xl border-2 border-white dark:border-zinc-900 object-cover shadow-xs"
                    />
                  ))}
                </div>
                <div className="min-w-[140px] flex-1">
                  <p className="font-mono text-xs font-medium text-[var(--ink-primary)]">{order.id}</p>
                  <p className="text-[11px] font-mono text-[var(--ink-muted)]">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <OrderStatusBadge status={order.status} />
                <span className="ml-auto font-mono text-sm font-medium text-[var(--ink-primary)]">
                  {formatPrice(order.total, currency)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOverview;
