import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

export default function AccountOrders() {
  const user = useAuthStore((s) => s.currentUser());
  const currency = useCartStore((s) => s.currency);

  if (!user) return null;

  return (
    <div>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Account</span>
      <h1 className="font-display text-4xl font-black uppercase text-ink md:text-5xl">Order History</h1>

      {user.orders.length === 0 ? (
        <div className="mt-10 border border-line p-10 text-center">
          <p className="mb-4 text-sm text-ink-dim">You haven't placed an order yet.</p>
          <Link to="/shop" className="text-xs font-semibold uppercase tracking-widest text-indigo-glow hover:text-ink">
            Start Shopping &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-1.5">
          {user.orders.map((order) => (
            <Link key={order.id} to={`/account/orders/${order.id}`} className="block border border-line p-6 transition-colors hover:border-indigo-glow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm text-ink">{order.id}</p>
                  <p className="mt-1 text-xs text-ink-dim">
                    Placed {new Date(order.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img key={i} src={item.image} alt={item.name} className="h-14 w-14 flex-shrink-0 border-2 border-void object-cover" />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-ink-dim">
                    {order.items.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <span className="flex-shrink-0 font-mono text-sm text-ink">{formatPrice(order.total, currency)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
