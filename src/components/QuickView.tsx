import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "../lib/format";
import Rating from "./Rating";

export default function QuickView() {
  const product = useUIStore((s) => s.quickViewProduct);
  const setQuickViewProduct = useUIStore((s) => s.setQuickViewProduct);
  const showToast = useUIStore((s) => s.showToast);
  const addToCart = useCartStore((s) => s.addToCart);
  const currency = useCartStore((s) => s.currency);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="absolute inset-0 bg-scrim/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="glass relative z-10 grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto sm:grid-cols-2"
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-scrim/80 text-on-scrim hover:bg-scrim"
            >
              <X size={16} />
            </button>
            <div className="aspect-[3/4] bg-void-3 sm:aspect-auto">
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col p-7 md:p-9">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">{product.category}</span>
              <h3 className="mt-2 font-display text-3xl font-bold text-ink">{product.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <Rating value={product.rating} />
                <span className="text-[10px] text-ink-dim">({product.reviewCount})</span>
              </div>
              <p className="mt-4 font-mono text-xl text-ink">{formatPrice(product.price, currency)}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-dim">{product.description}</p>
              <div className="mt-auto flex flex-col gap-3 pt-6">
                <button
                  onClick={() => {
                    addToCart(product);
                    showToast(`${product.name} added to your bag`);
                    setQuickViewProduct(null);
                  }}
                  className="bg-ink py-4 text-[11px] font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow"
                >
                  Add To Bag — {formatPrice(product.price, currency)}
                </button>
                <button
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                    setQuickViewProduct(null);
                  }}
                  className="border border-line py-4 text-[11px] font-semibold uppercase tracking-widest text-ink transition-colors hover:border-indigo-glow"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
