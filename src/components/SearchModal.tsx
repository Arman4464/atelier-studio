import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useProductsStore } from '../store/productsStore';

export const SearchModal: React.FC = () => {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const productsStore = useProductsStore() as any;
  const products: any[] = productsStore.products || [];
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  const results = query
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.title?.toLowerCase().includes(query.toLowerCase()) ||
          p.material?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 5);

  const formatResultPrice = (price: any) => {
    if (typeof price === 'number') {
      return price > 1000 ? `$${Math.round(price * 0.0104)}` : `$${price}`;
    }
    return price || '$380';
  };

  const handleSelect = (product: any) => {
    const slug = product.slug || product.id;
    setOpen(false);
    navigate(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-16 sm:pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-2xl bg-[var(--bg-canvas)] text-[var(--ink-primary)] hairline-box shadow-2xl overflow-hidden font-ledger text-xs"
          >
            {/* Search Input Bar */}
            <div className="p-5 hairline-b flex items-center justify-between gap-4">
              <span className="text-[var(--accent-stamp)] font-bold text-sm">/INDEX</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH REPERTOIRE BY SPECIMEN OR WEAVE..."
                className="w-full bg-transparent font-grotesk font-bold text-base sm:text-lg uppercase placeholder:text-[var(--ink-muted)] placeholder:font-normal focus:outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="px-2.5 py-1 hairline-box hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors shrink-0"
              >
                [ ESC ]
              </button>
            </div>

            {/* Results Ledger */}
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--border-hairline)]">
              <div className="px-5 py-2.5 bg-[var(--bg-sub)] font-ledger text-[10px] uppercase text-[var(--ink-muted)] flex justify-between">
                <span>{query ? `RESULTS FOR "${query.toUpperCase()}"` : 'RECENT ARCHIVE ENTRIES'}</span>
                <span>{results.length} SPECIMENS</span>
              </div>

              {results.length === 0 ? (
                <div className="p-8 text-center text-[var(--ink-muted)]">
                  [ NO CORRESPONDING SPECIMEN IN ACTIVE LOT ]
                </div>
              ) : (
                results.map((product, idx) => (
                  <button
                    key={product.id || idx}
                    onClick={() => handleSelect(product)}
                    className="w-full grid grid-cols-12 items-center px-5 py-3.5 text-left hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors group"
                  >
                    <span className="col-span-2 text-[var(--ink-muted)] group-hover:text-inherit">
                      AS-{String(idx + 101)}
                    </span>
                    <span className="col-span-6 font-grotesk font-bold text-sm uppercase truncate">
                      {product.name || product.title}
                    </span>
                    <span className="col-span-2 text-[11px] uppercase opacity-75">
                      {product.category || 'ARCHIVE'}
                    </span>
                    <span className="col-span-2 text-right font-medium">
                      {formatResultPrice(product.price)}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Footer Navigation Tip */}
            <div className="px-5 py-2.5 hairline-t bg-[var(--bg-sub)] text-[10px] text-[var(--ink-muted)] flex justify-between">
              <span>SELECT ITEM TO INSPECT DOSSIER</span>
              <span>PRESS ESC TO DISMISS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
