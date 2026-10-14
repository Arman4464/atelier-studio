import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

export const AccountOrders: React.FC = () => {
  const user = useAuthStore((s) => s.currentUser());
  const currency = useCartStore((s) => s.currency);

  if (!user) return null;

  return (
    <div>
      <span className="mb-2 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
        Private Client
      </span>
      <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
        Order History
      </h1>

      {user.orders.length === 0 ? (
        <div className="mt-8 glass-card rounded-[28px] p-12 text-center">
          <p className="mb-4 text-sm text-[var(--ink-secondary)]">You haven't placed an order yet.</p>
          <Link to="/shop" className="btn-prism inline-flex px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider">
            Explore Collection &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {user.orders.map((order) => (
            <Link
              key={order.id}
              to={`/account/orders/${order.id}`}
              className="glass-card block rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-[var(--ink-primary)]">{order.id}</p>
                  <p className="mt-1 text-xs font-mono text-[var(--ink-muted)]">
                    Placed {new Date(order.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 flex-shrink-0 rounded-2xl border-2 border-white dark:border-zinc-900 object-cover shadow-xs"
                    />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-[var(--ink-secondary)]">
                    {order.items.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <span className="flex-shrink-0 font-mono text-sm font-semibold text-[var(--ink-primary)]">
                  {formatPrice(order.total, currency)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountOrders;
