import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuthStore, type OrderStatus } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

const STATUSES: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export const AdminOrderDetail: React.FC = () => {
  const { customerId, id } = useParams();
  const currency = useCartStore((s) => s.currency);
  const customer = useAuthStore((s) => (customerId ? s.getCustomer(customerId) : undefined));
  const updateOrderStatus = useAuthStore((s) => s.updateOrderStatus);
  const showToast = useUIStore((s) => s.showToast);

  const order = customer?.orders.find((o) => o.id === id);

  if (!customer || !order) {
    return (
      <div className="py-12 text-center glass-card rounded-[28px] p-8">
        <p className="mb-4 font-display text-2xl text-[var(--ink-secondary)]">Waybill record not found.</p>
        <Link to="/admin/orders" className="glass-pill px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)]">
          Back to Order Log
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        to="/admin/orders"
        className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
      >
        <ArrowLeft size={14} /> Back to Order Log
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Fulfillment Dossier
          </span>
          <h1 className="font-mono text-3xl font-light tracking-tight text-[var(--ink-primary)] md:text-4xl">{order.id}</h1>
          <p className="mt-1 text-xs font-mono text-[var(--ink-muted)]">
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
            className="glass-pill px-4 py-2 text-xs font-mono font-semibold text-[var(--ink-primary)]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-void dark:bg-zinc-900">Mark as {s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display text-xl font-light text-[var(--ink-primary)]">Manifest Items</h2>
          <div className="glass-card rounded-[28px] overflow-hidden divide-y divide-black/5 dark:divide-white/10">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <img src={item.image} alt={item.name} className="h-20 w-16 flex-shrink-0 rounded-2xl object-cover shadow-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--ink-primary)]">{item.name}</p>
                  <p className="text-xs font-mono text-[var(--ink-muted)]">Qty {item.qty}</p>
                </div>
                <span className="font-mono text-sm font-medium text-[var(--ink-primary)]">{formatPrice(item.price * item.qty, currency)}</span>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-[24px] p-5">
            <div className="flex justify-between font-semibold text-[var(--ink-primary)]">
              <span>Total Settlement</span>
              <span className="font-mono text-base">{formatPrice(order.total, currency)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="mb-4 font-display text-xl font-light text-[var(--ink-primary)]">Client Profile</h2>
            <Link to={`/admin/customers/${customer.id}`} className="glass-card block rounded-[24px] p-5 transition-all hover:shadow-lg group">
              <p className="font-semibold text-[var(--ink-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {customer.name}
              </p>
              <p className="mt-1 text-xs font-mono text-[var(--ink-muted)]">{customer.email}</p>
              {customer.phone && <p className="text-xs font-mono text-[var(--ink-muted)]">{customer.phone}</p>}
            </Link>
          </div>

          <div>
            <h2 className="mb-4 font-display text-xl font-light text-[var(--ink-primary)]">Dispatch Address</h2>
            <div className="glass-card rounded-[24px] p-5 text-sm">
              <p className="font-semibold text-[var(--ink-primary)]">{order.shippingName}</p>
              <p className="mt-1 text-xs text-[var(--ink-secondary)] leading-relaxed">{order.shippingAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
