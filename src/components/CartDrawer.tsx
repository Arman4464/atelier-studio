import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useCartStore } from "../store/cartStore";
import { useSettingsStore } from "../store/settingsStore";
import { formatPrice } from "../lib/format";
import { useProductsStore } from "../store/productsStore";

export default function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const setOpen = useUIStore((s) => s.setCartOpen);
  const navigate = useNavigate();

  const cart = useCartStore((s) => s.cart);
  const currency = useCartStore((s) => s.currency);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const cartTotal = useCartStore((s) => s.cartTotal());
  const cartGrandTotal = useCartStore((s) => s.cartGrandTotal());
  const discountAmount = useCartStore((s) => s.discountAmount());
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);
  const appliedDiscount = useCartStore((s) => s.appliedDiscount);
  const promoError = useCartStore((s) => s.promoError);
  const addToCart = useCartStore((s) => s.addToCart);
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold);

  const products = useProductsStore((s) => s.products);
  const crossSell = products.find((p) => !cart.some((c) => c.id === p.id));
  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-scrim/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass absolute right-0 top-0 flex h-full w-full max-w-md flex-col"
          >
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-void-2/95 p-7 backdrop-blur">
                <h2 className="font-display text-3xl font-bold text-ink">Your Bag</h2>
                <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-dim hover:text-ink">
                  <X size={20} />
                </button>
              </div>

              <div className="border-b border-line bg-void-3 p-6">
                <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-ink">
                  <span>{cartTotal >= freeShippingThreshold ? "Free shipping unlocked" : `Add ${formatPrice(freeShippingThreshold - cartTotal, currency)} for free express shipping`}</span>
                  <span className="font-mono">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden bg-line">
                  <div className="h-full bg-indigo-glow transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="space-y-6 p-6">
                {cart.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="font-display text-2xl text-ink-dim">Your bag is empty.</p>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/shop");
                      }}
                      className="mt-4 text-xs uppercase tracking-widest text-indigo-glow hover:text-ink"
                    >
                      Browse Collection
                    </button>
                  </div>
                )}
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-line pb-6">
                    <img src={item.images[0]} className="h-24 w-20 flex-shrink-0 bg-void-3 object-cover" alt={item.name} />
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <h3 className="truncate font-display text-lg text-ink">{item.name}</h3>
                        <span className="flex-shrink-0 font-mono text-xs text-ink-dim">{formatPrice(item.price * item.qty, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-line font-mono text-xs text-ink">
                          <button onClick={() => updateQty(item.id, -1)} className="px-2.5 py-1 hover:bg-void-3" aria-label="Decrease quantity"><Minus size={11} /></button>
                          <span className="px-2">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="px-2.5 py-1 hover:bg-void-3" aria-label="Increase quantity"><Plus size={11} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase tracking-widest text-flame hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length > 0 && crossSell && (
                <div className="px-6 pb-6">
                  <span className="mb-3 block text-[10px] uppercase tracking-widest text-ink-dim">Often Added Together</span>
                  <div className="flex items-center gap-3 border border-line p-3">
                    <img src={crossSell.images[0]} className="h-14 w-12 flex-shrink-0 object-cover" alt={crossSell.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-ink">{crossSell.name}</p>
                      <p className="font-mono text-[11px] text-ink-dim">{formatPrice(crossSell.price, currency)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(crossSell)}
                      className="flex-shrink-0 border border-indigo-glow px-3 py-2 text-[10px] uppercase tracking-widest text-indigo-glow transition-colors hover:bg-indigo-glow hover:text-void"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {cart.length > 0 && (
                <div className="px-6 pb-6">
                  {appliedDiscount ? (
                    <div className="flex items-center justify-between border border-indigo-glow/40 bg-indigo-glow/10 px-3 py-2.5 text-xs text-ink">
                      <span className="font-mono">{appliedDiscount.code} applied</span>
                      <button onClick={removePromo} className="text-[10px] uppercase tracking-widest text-flame hover:underline">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code"
                        className="flex-1 border border-line bg-transparent px-3 py-2.5 text-xs uppercase text-ink focus:outline-none focus:border-indigo-glow"
                      />
                      <button onClick={applyPromo} className="border border-ink px-4 text-[10px] font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-void">
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && <p className="mt-2 text-[11px] text-flame">{promoError}</p>}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 border-t border-line bg-void-2 p-7">
              <div className="mb-5 space-y-1.5 text-xs">
                <div className="flex justify-between text-ink-dim"><span>Subtotal</span><span className="font-mono">{formatPrice(cartTotal, currency)}</span></div>
                {appliedDiscount && <div className="flex justify-between text-indigo-glow"><span>Promo ({appliedDiscount.code})</span><span className="font-mono">-{formatPrice(discountAmount, currency)}</span></div>}
                <div className="flex items-center justify-between border-t border-line pt-2">
                  <span className="text-xs uppercase tracking-widest text-ink-dim">Total</span>
                  <span className="font-mono text-xl font-medium text-ink">{formatPrice(cartGrandTotal, currency)}</span>
                </div>
              </div>
              <button
                disabled={!cart.length}
                onClick={() => {
                  setOpen(false);
                  navigate("/checkout");
                }}
                className="w-full bg-ink py-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-void transition-colors hover:bg-indigo-glow disabled:cursor-not-allowed disabled:opacity-40"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
