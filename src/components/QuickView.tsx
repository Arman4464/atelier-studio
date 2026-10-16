// src/components/QuickView.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';

export const QuickView: React.FC = () => {
  const {
    quickViewProduct: product,
    closeQuickView,
    addToCart,
    openCart,
    toggleWishlist,
    isWishlisted,
  } = useAtelierBridge();

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Obsidian');
  const [activeImg, setActiveImg] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[1] || product.sizes?.[0] || 'M');
      setSelectedColor(product.colors?.[0]?.name || 'Obsidian');
      setActiveImg(0);
    }
  }, [product]);

  if (!product) return null;

  const saved = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    closeQuickView();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-4xl surface-modal rounded-[28px] overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
        {/* Left 6 Cols: Interactive Image Stage */}
        <div className="md:col-span-6 bg-[var(--bg-sub)] p-4 flex flex-col justify-between">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--bg-card)]">
            <img
              src={product.images[activeImg] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full surface-glass font-mono-tech text-[10px] uppercase font-bold">
              {product.category}
            </span>
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {product.images.slice(0, 4).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === idx
                      ? 'border-[var(--accent-signal)]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right 6 Cols: Controls */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono-tech text-xs text-[var(--accent-signal)] font-bold uppercase">
                QUICK INSPECTION
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    saved ? 'bg-[var(--accent-signal)] text-white' : 'bg-[var(--bg-sub)]'
                  }`}
                >
                  ♥
                </button>
                <button
                  onClick={closeQuickView}
                  className="w-8 h-8 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight">
                {product.name}
              </h2>
              <span className="font-mono-tech text-xl font-bold">${product.price}</span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            <div>
              <span className="font-mono-tech text-[11px] uppercase text-[var(--ink-muted)] block mb-2">
                Shade: <strong className="text-[var(--ink-primary)]">{selectedColor}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c: any) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border ${
                      selectedColor === c.name
                        ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] border-transparent'
                        : 'bg-[var(--bg-sub)] border-[var(--border-subtle)]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Matrix */}
            <div>
              <span className="font-mono-tech text-[11px] uppercase text-[var(--ink-muted)] block mb-2">
                Size: <strong className="text-[var(--ink-primary)]">{selectedSize}</strong>
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {product.sizes.map((sz: string) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 rounded-xl font-mono-tech text-xs font-bold transition-all ${
                      selectedSize === sz
                        ? 'bg-[var(--accent-signal)] text-white shadow-sm'
                        : 'bg-[var(--bg-sub)] hover:bg-[var(--border-subtle)]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] space-y-2.5">
            <button
              onClick={handleAdd}
              className="w-full py-4 btn-signal text-xs uppercase tracking-widest"
            >
              Add to Bag · ${product.price}
            </button>
            <Link
              to={`/product/${product.slug}`}
              onClick={closeQuickView}
              className="block w-full py-3 rounded-full bg-[var(--bg-sub)] text-center text-xs font-semibold hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
            >
              View Full Product Studio →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
