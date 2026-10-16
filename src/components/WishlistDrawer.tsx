import React from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';
import { useProductsStore } from '../store/productsStore';

export const WishlistDrawer: React.FC = () => {
  const uiStore = useUIStore() as any;
  const cartStore = useCartStore() as any;
  const productsStore = useProductsStore() as any;

  const isOpen = Boolean(uiStore.isWishlistOpen ?? uiStore.wishlistOpen);
  const closeWishlist = () => {
    if (uiStore.closeWishlist) uiStore.closeWishlist();
    else if (uiStore.setWishlistOpen) uiStore.setWishlistOpen(false);
  };

  const rawWishlist: any[] =
    productsStore.wishlist ||
    cartStore.wishlist ||
    uiStore.wishlist ||
    [];

  const allProducts: any[] = productsStore.products || [];
  const savedProducts = rawWishlist
    .map((entry) =>
      typeof entry === 'object'
        ? entry
        : allProducts.find((p) => String(p.id) === String(entry))
    )
    .filter(Boolean);

  const formatPrice = (price: any) => {
    if (typeof price === 'number') {
      return price > 1000 ? `$${Math.round(price * 0.0104)}` : `$${price}`;
    }
    return price || '$380';
  };

  const handleMoveToBag = (product: any) => {
    const defaultSize = product.sizes?.[1] || product.sizes?.[0] || 'M';
    if (cartStore.addItem) {
      cartStore.addItem({
        ...product,
        id: product.id,
        selectedSize: defaultSize,
        size: defaultSize,
        quantity: 1,
      });
    } else if (cartStore.addToCart) {
      cartStore.addToCart(product, 1, defaultSize);
    }
    closeWishlist();
    if (uiStore.openCart) uiStore.openCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(true);
  };

  const handleRemove = (id: any) => {
    if (cartStore.toggleWishlist) cartStore.toggleWishlist(id);
    else if (productsStore.toggleWishlist) productsStore.toggleWishlist(id);
    else if (cartStore.removeFromWishlist) cartStore.removeFromWishlist(id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-3 sm:p-5">
      <div
        onClick={closeWishlist}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <aside className="relative z-10 w-full max-w-md glass-modal rounded-[32px] h-full flex flex-col justify-between overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border-subtle)]">
          <div>
            <h2 className="font-editorial italic text-3xl leading-none">Saved Wardrobe</h2>
            <span className="text-xs text-[var(--ink-muted)] mt-1 block">
              {savedProducts.length} {savedProducts.length === 1 ? 'piece' : 'pieces'} bookmarked
            </span>
          </div>
          <button
            onClick={closeWishlist}
            className="w-9 h-9 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs hover:scale-105 transition-transform"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 space-y-4 no-scrollbar">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <p className="font-editorial italic text-2xl text-[var(--ink-secondary)]">
                Your saved wardrobe is empty
              </p>
              <Link
                to="/shop"
                onClick={closeWishlist}
                className="btn-prism px-6 py-3 text-xs uppercase tracking-widest inline-block"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            savedProducts.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex gap-4 p-3.5 rounded-2xl glass-pill transition-all duration-200 hover:scale-[1.01]"
              >
                <Link
                  to={`/product/${item.slug || item.id}`}
                  onClick={closeWishlist}
                  className="w-20 h-24 rounded-xl overflow-hidden bg-[var(--bg-sub)] shrink-0"
                >
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between gap-2">
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        onClick={closeWishlist}
                        className="text-sm font-medium hover:opacity-75 transition-opacity leading-snug"
                      >
                        {item.name || item.title}
                      </Link>
                      <span className="text-sm font-semibold shrink-0">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--ink-muted)] block mt-0.5">
                      {item.category || 'Wardrobe Silhouette'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <button
                      onClick={() => handleMoveToBag(item)}
                      className="px-3.5 py-1.5 rounded-full btn-prism text-[11px] font-medium tracking-normal"
                    >
                      + Move to Bag
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-xs text-[var(--ink-muted)] hover:text-rose-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

export default WishlistDrawer;
