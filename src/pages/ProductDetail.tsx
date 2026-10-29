// src/pages/ProductDetail.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';
import { ProductCard } from '../components/ProductCard';
import { WovenCareLabel } from '../components/WovenCareLabel';

export const ProductDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    openCart,
    openSizeGuide,
    toggleWishlist,
    isWishlisted,
  } = useAtelierBridge();

  const target = slug || id;
  const product = useMemo(() => {
    return (
      products.find(
        (p) => String(p.slug) === String(target) || String(p.id) === String(target)
      ) || products[0]
    );
  }, [products, target]);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.[0]?.name || 'Obsidian'
  );
  const [quantity, setQuantity] = useState(1);

  // Interactive Fit Predictor State
  const [showFitFinder, setShowFitFinder] = useState(false);
  const [heightCm, setHeightCm] = useState(176);
  const [weightKg, setWeightKg] = useState(68);

  if (!product) return null;

  const recommendedSize = useMemo(() => {
    const score = heightCm * 0.4 + weightKg * 0.8;
    if (score < 115) return 'XS';
    if (score < 123) return 'S';
    if (score < 132) return 'M';
    if (score < 142) return 'L';
    return 'XL';
  }, [heightCm, weightKg]);

  const saved = isWishlisted(product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    openCart();
  };

  return (
    <main className="min-h-screen py-8 px-3 sm:px-6 max-w-[1440px] mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 rounded-full surface-glass text-xs font-semibold hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Interactive Image Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="surface-card p-3">
            <div className="aspect-[4/5] rounded-[18px] overflow-hidden bg-[var(--bg-sub)] relative">
              <img
                src={product.images[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full surface-glass font-mono-tech text-xs">
                ANGLE 0{activeImage + 1} / 0{product.images.length}
              </span>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx
                      ? 'border-[var(--accent-signal)] scale-[1.02]'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Purchase & Fit Predictor Pod */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 surface-card p-6 sm:p-9 space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-xs uppercase text-[var(--accent-signal)] font-bold">
              {product.category}
            </span>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                saved ? 'bg-[var(--accent-signal)] text-white' : 'bg-[var(--bg-sub)]'
              }`}
            >
              {saved ? '♥ Saved' : '♡ Save'}
            </button>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight">
              {product.name}
            </h1>
            <span className="font-mono-tech text-2xl font-bold">${product.price}</span>
          </div>

          <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
            {product.description}
          </p>

          {/* Shade Selector */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span>Shade: {selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c: any) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-2 border ${
                    selectedColor === c.name
                      ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] border-transparent'
                      : 'bg-[var(--bg-sub)] border-[var(--border-subtle)]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/40"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector + Interactive Fit Predictor */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold">Select Size</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFitFinder(!showFitFinder)}
                  className="font-mono-tech text-[11px] text-[var(--accent-signal)] underline font-semibold"
                >
                  {showFitFinder ? 'Hide Fit Predictor' : '⚡ Smart Fit Predictor'}
                </button>
                <button
                  onClick={openSizeGuide}
                  className="text-[var(--ink-secondary)] underline"
                >
                  Measurements
                </button>
              </div>
            </div>

            {showFitFinder && (
              <div className="p-4 rounded-2xl bg-[var(--bg-sub)] mb-3 space-y-3">
                <div className="flex justify-between text-xs">
                  <span>Height: <strong>{heightCm} cm</strong></span>
                  <input
                    type="range"
                    min={150}
                    max={205}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-36 accent-[#FF331F]"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span>Weight: <strong>{weightKg} kg</strong></span>
                  <input
                    type="range"
                    min={45}
                    max={115}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-36 accent-[#FF331F]"
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <span>Recommended Atelier Fit: <strong>Size {recommendedSize}</strong></span>
                  <button
                    onClick={() => setSelectedSize(recommendedSize)}
                    className="px-3 py-1 rounded-full bg-[var(--accent-signal)] text-white font-mono-tech text-[10px] font-bold"
                  >
                    Apply {recommendedSize}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz: string) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 rounded-xl font-mono-tech text-xs font-bold transition-all ${
                    selectedSize === sz
                      ? 'bg-[var(--accent-signal)] text-white shadow-md scale-[1.02]'
                      : 'bg-[var(--bg-sub)] hover:bg-[var(--border-subtle)]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Bag */}
          <div className="flex items-stretch gap-3 pt-2">
            <div className="flex items-center bg-[var(--bg-sub)] rounded-full px-3 font-mono-tech text-xs font-bold">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-2 py-3">
                −
              </button>
              <span className="px-3">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-2 py-3">
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 btn-primary py-4 text-xs uppercase tracking-widest"
            >
              Add to Bag — ${(product.price * quantity).toFixed(2)}
            </button>
          </div>

          {/* Interactive Jacquard Woven Care Label & Pattern Ledger */}
          <div className="pt-6 border-t border-[var(--border-subtle)]">
            <WovenCareLabel
              productId={product.id}
              productName={product.name}
              category={product.category}
              selectedSize={selectedSize as any}
            />
          </div>
        </div>
      </div>

      {/* Companion Pieces */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase mb-8">
            Complete the Silhouette
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((item, idx) => (
              <ProductCard key={item.id || idx} product={item} index={idx} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetail;
