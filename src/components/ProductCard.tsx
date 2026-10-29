// src/components/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtelierBridge, normalizeProduct } from '../lib/storeBridge';
import { soundEngine } from './SpatialEnvironment';

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
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  const [justAddedSize, setJustAddedSize] = useState<string | null>(null);

  if (!product) return null;

  const images = product.images;
  const saved = isWishlisted(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Scrub through angles
    if (images.length > 1) {
      const nextIdx = Math.min(images.length - 1, Math.floor(relX * images.length));
      if (nextIdx !== scrubIdx) {
        setScrubIdx(nextIdx);
        soundEngine.playTick(190, 0.012);
      }
    }

    // Calculate 3D perspective tilt
    const ry = (relX - 0.5) * 8;
    const rx = (0.5 - relY) * 8;
    setTilt({ rx, ry, gx: relX * 100, gy: relY * 100, active: true });
  };

  const handleMouseLeave = () => {
    setScrubIdx(0);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    soundEngine.playChime();
    addToCart(product, size, product.colors?.[0]?.name || 'Obsidian', 1);
    setJustAddedSize(size);
    setTimeout(() => setJustAddedSize(null), 1000);
    openCart();
  };

  const ratioClass =
    aspectClass || (featured ? 'aspect-[4/5] sm:aspect-[16/11]' : 'aspect-[3/4]');

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      }}
      className="group surface-card p-2.5 flex flex-col justify-between transition-transform duration-200 ease-out"
    >
      {/* Image Stage */}
      <div
        data-cursor="INSPECT"
        className={`relative overflow-hidden rounded-[18px] bg-[var(--bg-sub)] ${ratioClass}`}
      >
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={images[scrubIdx] || product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </Link>

        {/* Moving Specular Light Glare Overlay */}
        {tilt.active && (
          <div
            className="pointer-events-none absolute inset-0 opacity-30 transition-opacity"
            style={{
              background: `radial-gradient(320px circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.55), transparent 70%)`,
            }}
          />
        )}

        {/* Top Multi-Angle Progress Scrub Bar */}
        {images.length > 1 && (
          <div className="absolute top-2.5 inset-x-3 flex gap-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {images.map((_: any, i: number) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i === scrubIdx ? 'bg-[var(--accent-signal)]' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top-Left Tags */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-[var(--accent-signal)] text-white font-mono-tech text-[10px] font-bold uppercase shadow-sm">
              NEW
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full surface-glass font-mono-tech text-[10px] uppercase font-semibold">
            {product.category}
          </span>
        </div>

        {/* Top-Right Wishlist & Quick Loupe */}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              soundEngine.playChime();
              toggleWishlist(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-transform active:scale-125 ${
              saved
                ? 'bg-[var(--accent-signal)] text-white shadow-md'
                : 'surface-glass hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)]'
            }`}
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
        <div className="absolute inset-x-2.5 bottom-2.5 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <div className="surface-modal rounded-2xl p-2.5">
            <div className="flex items-center justify-between font-mono-tech text-[10px] uppercase mb-1.5 px-1">
              <span className="font-bold">
                {justAddedSize ? `✓ Added [${justAddedSize}]` : 'Instant Add Size'}
              </span>
              <span className="text-[var(--accent-signal)] font-bold">Ready to Ship</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {product.sizes.slice(0, 5).map((sz: string) => (
                <button
                  key={sz}
                  onClick={(e) => handleSizeClick(e, sz)}
                  className="py-1.5 rounded-xl font-mono-tech text-[11px] font-bold bg-[var(--bg-sub)] hover:bg-[var(--accent-signal)] hover:text-white transition-colors"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Meta */}
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
              />
            ))}
            <span className="font-mono-tech text-[10px] text-[var(--ink-muted)] ml-1">
              {product.fabric.split(' ')[0]}
            </span>
          </div>
        </div>

        <span className="font-mono-tech font-bold text-sm shrink-0">${product.price}</span>
      </div>
    </article>
  );
};

export default ProductCard;
