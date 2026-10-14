import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';

interface ProductCardProps {
  product: any;
  index?: number;
  featured?: boolean;
  aspectClass?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  featured = false,
  aspectClass,
}) => {
  const [hovered, setHovered] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const cartStore = useCartStore() as any;
  const uiStore = useUIStore() as any;

  const id = product?.id || product?.slug || `item-${index}`;
  const slug = product?.slug || product?.id || id;
  const title = product?.name || product?.title || 'Tailored Silhouette';
  const category = product?.category || 'Ready to Wear';
  const price =
    typeof product?.price === 'number'
      ? product.price > 1000
        ? `$${Math.round(product.price * 0.0104)}`
        : `$${product.price}`
      : product?.price || '$420';
  const primaryImage =
    product?.images?.[0] ||
    product?.image ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85';
  const secondaryImage = product?.images?.[1] || primaryImage;
  const sizes: string[] = product?.sizes || ['XS', 'S', 'M', 'L', 'XL'];

  const isWishlisted = cartStore.isWishlisted?.(product.id) || false;
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.toggleWishlist?.(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartStore.addItem) {
      cartStore.addItem({
        ...product,
        id: product.id,
        selectedSize: size,
        size,
        selectedColor: product?.colors?.[0]?.name || product?.colors?.[0] || 'Obsidian',
        color: product?.colors?.[0]?.name || product?.colors?.[0] || 'Obsidian',
        quantity: 1,
      });
    } else if (cartStore.addToCart) {
      cartStore.addToCart(product, 1, size);
    }

    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 900);
    if (uiStore.openCart) uiStore.openCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(true);
  };

  const ratio =
    aspectClass || (featured ? 'aspect-[4/5] sm:aspect-[16/11]' : 'aspect-[3/4]');

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sculptural Image Container */}
      <Link
        to={`/product/${slug}`}
        className={`relative block overflow-hidden rounded-[26px] bg-[var(--bg-sub)] ${ratio}`}
      >
        <img
          src={hovered ? secondaryImage : primaryImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center sculptural-img"
        />

        {/* Top-Left Pill Badge */}
        {(product?.isNew || product?.badge) && (
          <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full glass-pill text-[10px] font-medium tracking-wider uppercase">
            {product?.badge || 'New Season'}
          </span>
        )}

        {/* Top-Right Wishlist Pill */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full glass-pill flex items-center justify-center text-xs transition-transform hover:scale-110 z-10"
        >
          <span className={isWishlisted ? 'text-rose-500 scale-110' : 'text-[var(--ink-secondary)]'}>
            {isWishlisted ? '♥' : '♡'}
          </span>
        </button>

        {/* Floating Frosted Glass Quick-Size Capsule on Hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <div className="glass-modal rounded-2xl p-2.5">
            <div className="text-[10px] text-center font-medium text-[var(--ink-secondary)] mb-1.5">
              {addedSize ? `Added ${addedSize} to Bag ✓` : 'Quick Add Size'}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {sizes.slice(0, 5).map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => handleQuickAdd(e, sz)}
                  className="py-1.5 rounded-xl text-[11px] font-medium hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Minimalist Uncluttered Meta Below */}
      <div className="pt-3.5 px-1 flex items-start justify-between gap-4">
        <div>
          <Link
            to={`/product/${slug}`}
            className="text-sm font-medium tracking-tight text-[var(--ink-primary)] group-hover:opacity-70 transition-opacity block"
          >
            {title}
          </Link>
          <span className="text-xs text-[var(--ink-muted)] mt-0.5 block">
            {category}
          </span>
        </div>
        <span className="text-sm font-medium text-[var(--ink-primary)] shrink-0">
          {price}
        </span>
      </div>
    </article>
  );
};

export default ProductCard;
