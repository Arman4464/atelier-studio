import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuthStore, type OrderStatus } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

const STATUSES: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export default function AdminOrderDetail() {
  const { customerId, id } = useParams();
  const currency = useCartStore((s) => s.currency);
  const customer = useAuthStore((s) => (customerId ? s.getCustomer(customerId) : undefined));
  const updateOrderStatus = useAuthStore((s) => s.updateOrderStatus);
  const showToast = useUIStore((s) => s.showToast);

  const order = customer?.orders.find((o) => o.id === id);

  if (!customer || !order) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 font-display text-2xl text-ink-dim">Order not found.</p>
        <Link to="/admin/orders" className="text-xs uppercase tracking-widest text-indigo-glow hover:text-ink">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/orders" className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-ink-dim hover:text-ink">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Order Detail</span>
          <h1 className="font-mono text-2xl font-bold text-ink md:text-3xl">{order.id}</h1>
          <p className="mt-2 text-xs text-ink-dim">
            Placed {new Date(order.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <select
            value={order.status}
            onChange={(e) => {
              updateOrderStatus(customer.id, order.id, e.target.value as OrderStatus);
              showToast(`Order marked as ${e.target.value}`);
            }}
            className="border border-line bg-void-2 px-3 py-2 text-xs text-ink focus:outline-none focus:border-indigo-glow"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-void">Mark as {s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-5 font-display text-xl font-bold text-ink">Items</h2>
          <div className="divide-y divide-line border border-line">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <img src={item.image} alt={item.name} className="h-20 w-16 flex-shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink-dim">Qty {item.qty}</p>
                </div>
                <span className="font-mono text-sm text-ink">{formatPrice(item.price * item.qty, currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border border-line p-5">
            <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink">
              <span>Total</span>
              <span className="font-mono">{formatPrice(order.total, currency)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <h2 className="mb-5 font-display text-xl font-bold text-ink">Customer</h2>
          <Link to={`/admin/customers/${customer.id}`} className="block border border-line p-5 text-sm transition-colors hover:border-indigo-glow">
            <p className="text-ink">{customer.name}</p>
            <p className="mt-1 text-ink-dim">{customer.email}</p>
            {customer.phone && <p className="text-ink-dim">{customer.phone}</p>}
          </Link>

          <h2 className="mb-5 mt-8 font-display text-xl font-bold text-ink">Shipping To</h2>
          <div className="border border-line p-5 text-sm">
            <p className="text-ink">{order.shippingName}</p>
            <p className="mt-1 text-ink-dim">{order.shippingAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
