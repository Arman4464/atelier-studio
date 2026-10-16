// src/components/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtelierBridge, normalizeProduct } from '../lib/storeBridge';

interface ProductCardProps {
  product: any;
  index?: number;
  featured?: boolean;
  aspectClass?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product: rawProduct,
  index = 0,
  featured = false,
  aspectClass,
}) => {
  const {
    addToCart,
    openCart,
    openQuickView,
    toggleWishlist,
    isWishlisted,
  } = useAtelierBridge();

  const product = normalizeProduct(rawProduct, index);
  const [scrubIdx, setScrubIdx] = useState(0);
  const [justAddedSize, setJustAddedSize] = useState<string | null>(null);

  if (!product) return null;

  const images = product.images;
  const saved = isWishlisted(product.id);

  // Horizontal mouse scrubbing across image gallery
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (images.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const nextIdx = Math.min(images.length - 1, Math.floor(relX * images.length));
    setScrubIdx(nextIdx);
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, product.colors?.[0]?.name || 'Obsidian', 1);
    setJustAddedSize(size);
    setTimeout(() => setJustAddedSize(null), 1000);
    openCart();
  };

  const ratioClass =
    aspectClass || (featured ? 'aspect-[4/5] sm:aspect-[16/11]' : 'aspect-[3/4]');

  return (
    <article className="group surface-card p-2.5 flex flex-col justify-between">
      {/* Image Stage with Cursor Scrubbing */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setScrubIdx(0)}
        className={`relative overflow-hidden rounded-[18px] bg-[var(--bg-sub)] ${ratioClass}`}
      >
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={images[scrubIdx] || product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {/* Multi-Angle Scrubbing Indicator Bars at Top */}
        {images.length > 1 && (
          <div className="absolute top-2.5 inset-x-3 flex gap-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {images.map((_: string, i: number) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i === scrubIdx ? 'bg-[var(--accent-signal)]' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top-Left Category / New Pill */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-[var(--accent-signal)] text-white font-mono-tech text-[10px] font-bold uppercase">
              NEW
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full surface-glass font-mono-tech text-[10px] uppercase font-medium">
            {product.category}
          </span>
        </div>

        {/* Top-Right Wishlist Heart & Quick-Loupe Buttons */}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-transform active:scale-125 ${
              saved
                ? 'bg-[var(--accent-signal)] text-white shadow-md'
                : 'surface-glass hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)]'
            }`}
            title={saved ? 'Remove from Saved' : 'Save Piece'}
          >
            ♥
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(product);
            }}
            className="w-8 h-8 rounded-full surface-glass hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Quick View"
          >
            ⊕
          </button>
        </div>

        {/* Slide-Up Instant Size Matrix */}
        <div className="absolute inset-x-2.5 bottom-2.5 translate-y-[115%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <div className="surface-modal rounded-2xl p-2.5">
            <div className="flex items-center justify-between font-mono-tech text-[10px] uppercase mb-1.5 px-1">
              <span className="font-semibold">
                {justAddedSize ? `✓ Added [${justAddedSize}]` : 'Instant Add Size'}
              </span>
              <span className="text-[var(--ink-muted)]">In Stock</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {product.sizes.slice(0, 5).map((sz: string) => (
                <button
                  key={sz}
                  onClick={(e) => handleSizeClick(e, sz)}
                  className="py-1.5 rounded-xl font-mono-tech text-[11px] font-semibold bg-[var(--bg-sub)] hover:bg-[var(--accent-signal)] hover:text-white transition-colors"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Product Details */}
      <div className="pt-3.5 px-2 pb-1 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/product/${product.slug}`}
            className="font-display font-bold text-sm sm:text-base tracking-tight hover:text-[var(--accent-signal)] transition-colors block truncate"
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-1.5 mt-1">
            {product.colors.slice(0, 4).map((c: any, i: number) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-[var(--border-strong)]"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="font-mono-tech text-[10px] text-[var(--ink-muted)] ml-1">
              {product.colors.length} shades
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono-tech font-bold text-sm">${product.price}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
