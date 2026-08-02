import { Link, useParams } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import { useAuthStore, type OrderStatus } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatPrice } from "../../lib/format";
import { getProductById } from "../../store/productsStore";

const STEPS: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.currentUser());
  const currency = useCartStore((s) => s.currency);
  const addToCart = useCartStore((s) => s.addToCart);
  const showToast = useUIStore((s) => s.showToast);

  const order = user?.orders.find((o) => o.id === id);

  if (!user) return null;

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 font-display text-2xl text-ink-dim">Order not found.</p>
        <Link to="/account/orders" className="text-xs uppercase tracking-widest text-indigo-glow hover:text-ink">
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
      <Link to="/account/orders" className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-ink-dim hover:text-ink">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Order Detail</span>
          <h1 className="font-mono text-3xl font-bold text-ink md:text-4xl">{order.id}</h1>
          <p className="mt-2 text-xs text-ink-dim">
            Placed {new Date(order.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <button onClick={reorder} className="border border-line px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-indigo-glow hover:text-indigo-glow">
          Reorder
        </button>
      </div>

      <div className="mt-10 flex items-center gap-3">
        {STEPS.map((step, i) => (
          <div key={step} className="flex flex-1 items-center gap-3">
            <div className="flex flex-shrink-0 flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs transition-colors ${
                  i < stepIndex ? "border-indigo-glow bg-indigo-glow text-void" : i === stepIndex ? "border-ink bg-ink text-void" : "border-line text-ink-dim"
                }`}
              >
                {i < stepIndex ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-[9px] uppercase tracking-widest text-ink-dim">{step}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < stepIndex ? "bg-indigo-glow" : "bg-line"}`} />}
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
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
        </div>

        <div className="lg:col-span-5">
          <h2 className="mb-5 font-display text-xl font-bold text-ink">Shipping To</h2>
          <div className="border border-line p-5 text-sm">
            <p className="text-ink">{order.shippingName}</p>
            <p className="mt-1 text-ink-dim">{order.shippingAddress}</p>
          </div>

          <h2 className="mb-5 mt-8 font-display text-xl font-bold text-ink">Total</h2>
          <div className="border border-line p-5 text-sm">
            <div className="flex justify-between text-ink-dim">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(order.total, currency)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 font-semibold text-ink">
              <span>Total</span>
              <span className="font-mono">{formatPrice(order.total, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
