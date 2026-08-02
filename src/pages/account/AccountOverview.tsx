import { Link } from "react-router-dom";
import { Package, Heart, MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

export default function AccountOverview() {
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
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Account</span>
      <h1 className="font-display text-4xl font-black uppercase text-ink md:text-5xl">
        Welcome back, {user.name.split(" ")[0]}.
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-1.5 md:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="group border border-line p-6 transition-colors hover:border-indigo-glow">
            <s.icon size={18} className="mb-4 text-indigo-glow" />
            <div className={s.isText ? "font-display text-lg font-bold text-ink" : "font-display text-4xl font-black text-ink"}>{s.value}</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">Recent Orders</h2>
          <Link to="/account/orders" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-ink-dim hover:text-ink">
            View All <ArrowUpRight size={13} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="border border-line p-10 text-center">
            <p className="mb-4 text-sm text-ink-dim">You haven't placed an order yet.</p>
            <Link to="/shop" className="text-xs font-semibold uppercase tracking-widest text-indigo-glow hover:text-ink">
              Start Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line border border-line">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/account/orders/${order.id}`} className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-void-2">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image} alt={item.name} className="h-12 w-12 flex-shrink-0 border-2 border-void object-cover" />
                  ))}
                </div>
                <div className="min-w-[140px] flex-1">
                  <p className="font-mono text-xs text-ink">{order.id}</p>
                  <p className="text-[11px] text-ink-dim">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <OrderStatusBadge status={order.status} />
                <span className="ml-auto font-mono text-sm text-ink">{formatPrice(order.total, currency)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
