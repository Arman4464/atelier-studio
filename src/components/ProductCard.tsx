import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';

interface ProductCardProps {
  product: any;
  index?: number;
  featured?: boolean;
  aspect?: string;
  tone?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  featured = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [justAddedSize, setJustAddedSize] = useState<string | null>(null);

  const cartStore = useCartStore() as any;
  const uiStore = useUIStore() as any;

  // Defensive field extraction to match your src/data/products.ts schema
  const id = product?.id || product?.slug || `item-${index}`;
  const slug = product?.slug || product?.id || id;
  const title = product?.name || product?.title || 'Archival Garment';
  const category = product?.category || 'Outerwear';
  const price =
    typeof product?.price === 'number'
      ? product.price > 1000
        ? `$${Math.round(product.price * 0.0104)}`
        : `$${product.price}`
      : product?.price || '$380';
  const primaryImage =
    product?.images?.[0] ||
    product?.image ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80';
  const secondaryImage = product?.images?.[1] || primaryImage;
  const sizes: string[] = product?.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const isNew = product?.isNew || product?.badge === 'New' || product?.tags?.includes('New');

  const handleQuickSizeAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartStore.addItem) {
      cartStore.addItem({
        ...product,
        id: product.id,
        selectedSize: size,
        size,
        selectedColor: product?.colors?.[0]?.name || product?.colors?.[0] || 'Raw Carbon',
        color: product?.colors?.[0]?.name || product?.colors?.[0] || 'Raw Carbon',
        quantity: 1,
      });
    } else if (cartStore.addToCart) {
      cartStore.addToCart(product, 1, size);
    }

    setJustAddedSize(size);
    setTimeout(() => setJustAddedSize(null), 1200);

    if (uiStore.openCart) uiStore.openCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(true);
  };

  return (
    <article
      className="group relative flex flex-col justify-between bg-[var(--bg-canvas)] transition-colors h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Specimen Index Header */}
      <div className="px-4 py-2.5 hairline-b flex items-center justify-between font-ledger text-[11px] text-[var(--ink-muted)]">
        <span>N° {String(index + 1).padStart(3, '0')}</span>
        <span className="uppercase tracking-wider">{category}</span>
        {isNew ? (
          <span className="text-[var(--accent-stamp)] font-medium">[ NEW ARCHIVE ]</span>
        ) : (
          <span>AW//26</span>
        )}
      </div>

      {/* Main Garment Frame */}
      <Link
        to={`/product/${slug}`}
        className={`relative block overflow-hidden bg-[var(--bg-sub)] ${
          featured ? 'aspect-[4/5] sm:aspect-[16/11]' : 'aspect-[3/4]'
        }`}
      >
        <img
          src={hovered ? secondaryImage : primaryImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Subtle technical overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[var(--bg-canvas)]/95 backdrop-blur-md hairline-t p-3 z-10">
          <div className="flex items-center justify-between mb-1.5 font-ledger text-[10px] uppercase text-[var(--ink-secondary)]">
            <span>
              {justAddedSize ? `STAMPED SIZE [${justAddedSize}] TO BAG` : 'QUICK STAMP SIZE:'}
            </span>
            <span>380 GSM</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {sizes.slice(0, 5).map((sz) => (
              <button
                key={sz}
                onClick={(e) => handleQuickSizeAdd(e, sz)}
                className="py-1.5 font-ledger text-[11px] uppercase hairline-box hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </Link>

      {/* Bottom Woven Garment Ledger */}
      <div className="p-4 flex items-baseline justify-between gap-4 hairline-t mt-auto">
        <div>
          <Link
            to={`/product/${slug}`}
            className="font-grotesk font-bold text-sm sm:text-base tracking-tight group-hover:text-[var(--accent-stamp)] transition-colors"
          >
            {title}
          </Link>
          <p className="font-ledger text-[11px] text-[var(--ink-muted)] mt-0.5">
            {product?.colors?.length ? `${product.colors.length} DYE LOTS` : 'SINGLE BATCH LOT'}
          </p>
        </div>

        <span className="font-ledger text-sm font-medium shrink-0">{price}</span>
      </div>
    </article>
  );
};

export default ProductCard;
