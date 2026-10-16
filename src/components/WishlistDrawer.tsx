// src/components/WishlistDrawer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    closeWishlist,
    wishlistProducts,
    toggleWishlist,
    addToCart,
    openCart,
  } = useAtelierBridge();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-3 sm:p-4">
      <div
        onClick={closeWishlist}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />

      <aside className="relative z-10 w-full max-w-md surface-modal rounded-[28px] h-full flex flex-col justify-between p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-tech text-[10px] uppercase text-[var(--accent-signal)] font-bold block">
              PRIVATE ARCHIVE
            </span>
            <h2 className="font-display font-extrabold text-xl uppercase">
              Saved Pieces ({wishlistProducts.length})
            </h2>
          </div>
          <button
            onClick={closeWishlist}
            className="w-8 h-8 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 space-y-4 no-scrollbar">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-sm text-[var(--ink-secondary)]">
                Tap the heart icon on any piece to save it here.
              </p>
              <Link
                to="/shop"
                onClick={closeWishlist}
                className="btn-primary px-6 py-3 text-xs uppercase tracking-wider"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            wishlistProducts.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
              >
                <Link
                  to={`/product/${item.slug}`}
                  onClick={closeWishlist}
                  className="w-20 h-24 rounded-xl overflow-hidden shrink-0"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm">{item.name}</h3>
                    <span className="font-mono-tech text-xs font-bold">${item.price}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      onClick={() => {
                        addToCart(item, 'M', 'Obsidian', 1);
                        closeWishlist();
                        openCart();
                      }}
                      className="btn-signal px-3.5 py-1.5 text-[11px]"
                    >
                      + Move to Bag
                    </button>
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="font-mono-tech text-[11px] text-[var(--ink-muted)] hover:text-[var(--accent-signal)]"
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
