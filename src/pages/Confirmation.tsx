import { Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { ShippingInfo } from "./Checkout";
import { useAuthStore } from "../store/authStore";

export default function Confirmation({
  shipping,
  orderNumber,
}: {
  shipping: ShippingInfo | null;
  orderNumber: string;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  if (!orderNumber) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex min-h-[70vh] items-center justify-center py-24">
      <div className="mx-auto max-w-lg px-6 text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-glow text-void">
          <Check size={28} />
        </div>
        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Order Confirmed</span>
        <h1 className="mb-5 font-display text-4xl font-black uppercase text-ink md:text-5xl">
          Thank you, {shipping?.name?.split(" ")[0] || "friend"}.
        </h1>
        <p className="mb-2 text-sm leading-relaxed text-ink-dim">
          Order <span className="font-mono text-ink">{orderNumber}</span> is confirmed. A receipt has been sent to{" "}
          <span className="text-ink">{shipping?.email}</span>.
        </p>
        <p className="mb-10 text-sm leading-relaxed text-ink-dim">Expect it hand-packed and on its way within 2 working days.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/shop" className="inline-block bg-ink px-8 py-5 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow">
            Continue Shopping
          </Link>
          {isAuthenticated && (
            <Link to={`/account/orders/${orderNumber}`} className="inline-block border border-line px-8 py-5 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-indigo-glow hover:text-indigo-glow">
              View Order
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
