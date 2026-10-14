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

  // Support wishlist stored in productsStore, cartStore, or uiStore
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
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={closeWishlist}
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      <aside className="relative z-10 w-full max-w-md bg-[var(--bg-canvas)] text-[var(--ink-primary)] h-full flex flex-col justify-between hairline-l shadow-2xl font-ledger text-xs">
        <div className="p-6 hairline-b flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[var(--ink-muted)] block">
              PRIVATE CLIENTELE PULL-SHEET
            </span>
            <h2 className="font-grotesk font-extrabold text-xl uppercase mt-0.5">
              Saved Specimens ({String(savedProducts.length).padStart(2, '0')})
            </h2>
          </div>
          <button
            onClick={closeWishlist}
            className="px-3 py-1.5 hairline-box hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)]"
          >
            [ ESC ]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[var(--ink-muted)] space-y-4">
              <span>[ NO SPECIMENS CURRENTLY TAGGED ON YOUR RACK ]</span>
              <Link
                to="/shop"
                onClick={closeWishlist}
                className="px-5 py-3 bg-[var(--ink-primary)] text-[var(--bg-canvas)] uppercase tracking-widest"
              >
                EXPLORE ARCHIVE →
              </Link>
            </div>
          ) : (
            savedProducts.map((item, idx) => (
              <div key={item.id || idx} className="grid grid-cols-12 gap-4 pb-5 perforated-b">
                <Link
                  to={`/product/${item.slug || item.id}`}
                  onClick={closeWishlist}
                  className="col-span-3 aspect-[3/4] bg-[var(--bg-sub)] hairline-box overflow-hidden"
                >
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="col-span-9 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between gap-2">
                      <span className="font-grotesk font-bold text-sm uppercase">
                        {item.name || item.title}
                      </span>
                      <span className="font-bold">{formatPrice(item.price)}</span>
                    </div>
                    <span className="text-[10px] text-[var(--ink-muted)] uppercase block mt-0.5">
                      {item.category || 'ARCHIVE LOT'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <button
                      onClick={() => handleMoveToBag(item)}
                      className="px-3 py-1.5 bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] uppercase text-[10px] tracking-wider font-medium"
                    >
                      + STAMP TO BAG
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-[10px] text-[var(--ink-muted)] hover:text-[var(--accent-stamp)] underline uppercase"
                    >
                      RELEASE
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
