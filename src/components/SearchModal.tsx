import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import { useProductsStore } from "../store/productsStore";
import { formatPrice } from "../lib/format";
import { useCartStore } from "../store/cartStore";

export default function SearchModal() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const currency = useCartStore((s) => s.currency);
  const products = useProductsStore((s) => s.products);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-5 pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-scrim/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass relative z-10 w-full max-w-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-4 border-b border-line pb-4">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or material..."
                className="w-full bg-transparent font-display text-2xl text-ink placeholder:text-ink-dim/60 focus:outline-none"
              />
              <button onClick={() => setOpen(false)} className="flex-shrink-0 text-xs uppercase tracking-widest text-ink-dim hover:text-ink">
                Close
              </button>
            </div>
            <div className="mt-6">
              <span className="mb-4 block text-[10px] uppercase tracking-widest text-ink-dim">
                {query ? `${results.length} Results` : "Popular Right Now"}
              </span>
              <div className="max-h-[60vh] space-y-1 overflow-y-auto">
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setOpen(false);
                      navigate(`/product/${item.id}`);
                    }}
                    className="flex cursor-pointer items-center gap-4 p-2 transition-colors hover:bg-void-3"
                  >
                    <img src={item.images[0]} className="h-16 w-12 flex-shrink-0 object-cover" alt={item.name} />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-display text-lg text-ink">{item.name}</h4>
                      <span className="text-xs text-ink-dim">{item.material}</span>
                    </div>
                    <span className="flex-shrink-0 font-mono text-xs text-ink-dim">{formatPrice(item.price, currency)}</span>
                  </div>
                ))}
                {query && results.length === 0 && (
                  <p className="py-8 text-center text-sm text-ink-dim">
                    Nothing matches &ldquo;{query}&rdquo;. Try a material like &ldquo;wool&rdquo; or &ldquo;brass&rdquo;.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
