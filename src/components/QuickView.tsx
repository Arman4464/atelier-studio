import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';

interface QuickViewProps {
  product?: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export const QuickView: React.FC<QuickViewProps> = (props) => {
  const uiStore = useUIStore() as any;
  const cartStore = useCartStore() as any;

  const product =
    props.product ?? uiStore.quickViewProduct ?? uiStore.selectedProduct ?? null;
  const isOpen =
    props.isOpen ?? Boolean(uiStore.isQuickViewOpen ?? uiStore.quickViewOpen ?? product);

  const closeQuickView = () => {
    if (props.onClose) props.onClose();
    if (uiStore.closeQuickView) uiStore.closeQuickView();
    else if (uiStore.setQuickViewProduct) uiStore.setQuickViewProduct(null);
    else if (uiStore.setQuickViewOpen) uiStore.setQuickViewOpen(false);
  };

  const sizes: string[] = product?.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const colors: any[] = product?.colors || [{ name: 'Obsidian', hex: '#141416' }];

  const [selectedSize, setSelectedSize] = useState<string>(sizes[1] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(
    typeof colors[0] === 'string' ? colors[0] : colors[0]?.name || 'Obsidian'
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[1] || product.sizes?.[0] || 'M');
      const firstCol = product.colors?.[0];
      setSelectedColor(typeof firstCol === 'string' ? firstCol : firstCol?.name || 'Obsidian');
      setActiveImageIdx(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const images: string[] = product.images?.length
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'];
  const title = product.name || product.title || 'Sculptural Silhouette';
  const price =
    typeof product.price === 'number'
      ? product.price > 1000
        ? `$${Math.round(product.price * 0.0104)}`
        : `$${product.price.toFixed(2)}`
      : product.price || '$380';
  const slug = product.slug || product.id;

  const handleStampToBag = () => {
    if (cartStore.addItem) {
      cartStore.addItem({
        ...product,
        id: product.id,
        selectedSize,
        size: selectedSize,
        selectedColor,
        color: selectedColor,
        quantity: 1,
      });
    } else if (cartStore.addToCart) {
      cartStore.addToCart(product, 1, selectedSize, selectedColor);
    }
    closeQuickView();
    if (uiStore.openCart) uiStore.openCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/45 backdrop-blur-md transition-opacity"
      />

      <div className="relative z-10 w-full max-w-4xl glass-modal rounded-[32px] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
        {/* Left 6 Columns: Photo Gallery */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white/20 dark:bg-black/20">
          <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-[var(--bg-sub)] shadow-inner">
            <img
              src={images[activeImageIdx]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIdx === i ? 'border-[var(--ink-primary)] shadow-sm' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right 6 Columns: Details & Purchasing */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border-subtle)]">
              <span className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                {product.category || 'Atelier Collection'}
              </span>
              <button
                onClick={closeQuickView}
                className="w-8 h-8 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs hover:scale-105 transition-transform"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h2 className="font-editorial italic text-3xl sm:text-4xl leading-tight">
                {title}
              </h2>
              <span className="text-xl font-semibold">{price}</span>
            </div>

            <p className="mt-3 text-sm text-[var(--ink-secondary)] leading-relaxed font-light">
              {product.description ||
                'Fluid architectural silhouette tailored from unbleached natural fibers with hand-finished interior seams.'}
            </p>

            {/* Colors */}
            <div className="mt-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--ink-muted)]">Color</span>
                <span className="font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c, i) => {
                  const name = typeof c === 'string' ? c : c.name || `Tone ${i + 1}`;
                  const hex = typeof c === 'object' && c.hex ? c.hex : '#18181B';
                  const active = selectedColor === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedColor(name)}
                      className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all ${
                        active
                          ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-medium shadow-sm'
                          : 'bg-[var(--bg-sub)] text-[var(--ink-secondary)]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hex }} />
                      <span>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--ink-muted)]">Select Size</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {sizes.map((sz) => {
                  const active = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] shadow-md scale-[1.02]'
                          : 'bg-[var(--bg-sub)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--glass-border-subtle)] space-y-3">
            <button
              onClick={handleStampToBag}
              className="btn-prism w-full py-4 text-center text-xs uppercase tracking-[0.18em]"
            >
              Add to Bag — {price}
            </button>
            <Link
              to={`/product/${slug}`}
              onClick={closeQuickView}
              className="block text-center text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] underline underline-offset-4"
            >
              View Full Product Dossier →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
