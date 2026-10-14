import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';

export const QuickView: React.FC = () => {
  const product = useUIStore((s) => s.quickViewProduct);
  const setQuickViewProduct = useUIStore((s) => s.setQuickViewProduct);
  const openCart = useUIStore((s) => s.setCartOpen);
  const cartStore = useCartStore() as any;
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>('M');

  if (!product) return null;

  const p = product as any;
  const title = p.name || p.title || 'Archival Garment';
  const price =
    typeof p.price === 'number'
      ? p.price > 1000
        ? `$${Math.round(p.price * 0.0104)}`
        : `$${p.price}`
      : p.price || '$380';
  const sizes: string[] = p.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const image =
    p.images?.[0] ||
    p.image ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80';

  const handleAdd = () => {
    if (cartStore.addItem) {
      cartStore.addItem({
        ...product,
        selectedSize,
        size: selectedSize,
        quantity: 1,
      });
    } else if (cartStore.addToCart) {
      cartStore.addToCart(product, 1, selectedSize);
    }
    setQuickViewProduct(null);
    if (openCart) openCart(true);
  };

  const handleFullInspect = () => {
    const slug = p.slug || product.id;
    setQuickViewProduct(null);
    navigate(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-3xl bg-[var(--bg-canvas)] text-[var(--ink-primary)] hairline-box shadow-2xl grid grid-cols-1 sm:grid-cols-12 overflow-hidden font-ledger text-xs"
        >
          {/* Left Plate Image */}
          <div className="sm:col-span-5 bg-[var(--bg-sub)] aspect-[3/4] sm:aspect-auto hairline-r relative overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-[var(--bg-canvas)]/90 px-2 py-0.5 hairline-box text-[10px]">
              SPECIMEN REF: AS-{String(product.id || '01')}
            </div>
          </div>

          {/* Right Specimen Dossier */}
          <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="pb-3 perforated-b flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
                <span className="uppercase">{product.category || 'OUTERWEAR'}</span>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="px-2 py-0.5 hairline-box hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
                >
                  [ ESC ]
                </button>
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-grotesk font-extrabold text-2xl uppercase tracking-tight">
                  {title}
                </h3>
                <span className="font-ledger text-lg font-bold text-[var(--accent-stamp)]">
                  {price}
                </span>
              </div>

              <p className="mt-3 text-sm text-[var(--ink-secondary)] leading-relaxed">
                {product.description ||
                  'Architectural small-batch construction. Cut from Japanese loomstate cotton and unlined Italian wool.'}
              </p>

              {/* Size Matrix */}
              <div className="mt-6 pt-4 hairline-t">
                <div className="text-[11px] uppercase text-[var(--ink-muted)] mb-2">
                  STAMP PROPORTION (SIZE):
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 hairline-box uppercase transition-colors ${
                        selectedSize === sz
                          ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-bold'
                          : 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-sub)]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 hairline-t space-y-2.5">
              <button
                onClick={handleAdd}
                className="w-full py-4 bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] transition-colors uppercase tracking-widest font-medium text-center"
              >
                STAMP [{selectedSize}] TO BAG →
              </button>
              <button
                onClick={handleFullInspect}
                className="w-full py-3 hairline-box hover:bg-[var(--bg-sub)] transition-colors uppercase tracking-widest text-center text-[11px] text-[var(--ink-secondary)]"
              >
                OPEN FULL DOSSIER SPECIFICATION ↗
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickView;
