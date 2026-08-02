import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useCartStore } from "../store/cartStore";
import { useProductsStore } from "../store/productsStore";
import { formatPrice } from "../lib/format";

export default function WishlistDrawer() {
  const open = useUIStore((s) => s.wishlistOpen);
  const setOpen = useUIStore((s) => s.setWishlistOpen);
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  const wishlist = useCartStore((s) => s.wishlist);
  const currency = useCartStore((s) => s.currency);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const addToCart = useCartStore((s) => s.addToCart);

  const items = useProductsStore((s) => s.products).filter((p) => wishlist.includes(p.id));

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
            <div className="flex items-center justify-between border-b border-line p-7">
              <h2 className="font-display text-3xl font-bold text-ink">Wishlist</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-dim hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {items.length === 0 && (
                <div className="py-12 text-center">
                  <p className="font-display text-2xl text-ink-dim">Nothing saved yet.</p>
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
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-line pb-6">
                  <img
                    src={item.images[0]}
                    className="h-24 w-20 flex-shrink-0 cursor-pointer bg-void-3 object-cover"
                    alt={item.name}
                    onClick={() => {
                      setOpen(false);
                      navigate(`/product/${item.id}`);
                    }}
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h3
                        className="cursor-pointer truncate font-display text-lg text-ink"
                        onClick={() => {
                          setOpen(false);
                          navigate(`/product/${item.id}`);
                        }}
                      >
                        {item.name}
                      </h3>
                      <span className="font-mono text-xs text-ink-dim">{formatPrice(item.price, currency)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          addToCart(item);
                          toggleWishlist(item.id);
                          showToast(`${item.name} moved to bag`);
                        }}
                        className="text-[10px] uppercase tracking-widest text-indigo-glow hover:text-ink"
                      >
                        Move to Bag
                      </button>
                      <button onClick={() => toggleWishlist(item.id)} className="text-[10px] uppercase tracking-widest text-flame hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
