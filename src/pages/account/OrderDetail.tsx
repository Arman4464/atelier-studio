import React from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import { useAuthStore, type OrderStatus } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatPrice } from "../../lib/format";
import { getProductById } from "../../store/productsStore";

const STEPS: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const user = useAuthStore((s) => s.currentUser());
  const currency = useCartStore((s) => s.currency);
  const addToCart = useCartStore((s) => s.addToCart);
  const showToast = useUIStore((s) => s.showToast);

  const order = user?.orders.find((o) => o.id === id);

  if (!user) return null;

  if (!order) {
    return (
      <div className="py-12 text-center glass-card rounded-[28px] p-8">
        <p className="mb-4 font-display text-2xl text-[var(--ink-secondary)]">Order not found.</p>
        <Link to="/account/orders" className="glass-pill px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)]">
          Back to Orders
        </Link>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(order.status);

  const reorder = () => {
    let added = 0;
    order.items.forEach((item) => {
      const product = getProductById(item.productId);
      if (product) {
        addToCart(product, item.qty);
        added++;
      }
    });
    if (added > 0) {
      useUIStore.getState().setCartOpen(true);
      showToast("Added items from this order to your bag");
    } else {
      showToast("Those items are no longer available");
    }
  };

  return (
    <div>
      <Link
        to="/account/orders"
        className="glass-pill mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
      >
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Order Dossier
          </span>
          <h1 className="font-mono text-3xl font-light tracking-tight text-[var(--ink-primary)] md:text-4xl">{order.id}</h1>
          <p className="mt-1 text-xs font-mono text-[var(--ink-muted)]">
            Placed {new Date(order.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={reorder}
          className="btn-prism px-6 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider"
        >
          Reorder Pieces
        </button>
      </div>

      <div className="mt-10 glass-card rounded-[24px] p-6">
        <div className="flex items-center gap-3">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center gap-3">
              <div className="flex flex-shrink-0 flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl font-mono text-xs transition-all duration-300 shadow-xs ${
                    i < stepIndex
                      ? "bg-purple-600 text-white shadow-purple-500/20"
                      : i === stepIndex
                      ? "bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 font-semibold"
                      : "border border-black/10 dark:border-white/10 text-[var(--ink-muted)]"
                  }`}
                >
                  {i < stepIndex ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 rounded-full ${i < stepIndex ? "bg-purple-600" : "bg-black/5 dark:bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-4 font-display text-xl font-light text-[var(--ink-primary)]">Acquired Items</h2>
          <div className="glass-card rounded-[28px] overflow-hidden divide-y divide-black/5 dark:divide-white/10">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <img src={item.image} alt={item.name} className="h-20 w-16 flex-shrink-0 rounded-2xl object-cover shadow-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--ink-primary)]">{item.name}</p>
                  <p className="text-xs font-mono text-[var(--ink-muted)]">Qty {item.qty}</p>
                </div>
                <span className="font-mono text-sm font-medium text-[var(--ink-primary)]">
                  {formatPrice(item.price * item.qty, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="mb-4 font-display text-xl font-light text-[var(--ink-primary)]">Delivery Address</h2>
            <div className="glass-card rounded-[24px] p-5 text-sm">
              <p className="font-semibold text-[var(--ink-primary)]">{order.shippingName}</p>
              <p className="mt-1 text-xs text-[var(--ink-secondary)] leading-relaxed">{order.shippingAddress}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-display text-xl font-light text-[var(--ink-primary)]">Summary</h2>
            <div className="glass-card rounded-[24px] p-5 text-sm space-y-2">
              <div className="flex justify-between text-xs text-[var(--ink-secondary)]">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(order.total, currency)}</span>
              </div>
              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-between font-semibold text-[var(--ink-primary)]">
                <span>Total</span>
                <span className="font-mono text-base">{formatPrice(order.total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
