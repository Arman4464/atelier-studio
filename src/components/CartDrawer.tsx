import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';

export const CartDrawer: React.FC = () => {
  const cartStore = useCartStore() as any;
  const uiStore = useUIStore() as any;

  const isOpen = Boolean(uiStore.isCartOpen ?? uiStore.cartOpen);
  const closeCart = () => {
    if (uiStore.closeCart) uiStore.closeCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(false);
  };

  const items: any[] = cartStore.items || cartStore.cart || [];
  const removeItem = cartStore.removeItem || cartStore.removeFromCart;
  const updateQuantity = cartStore.updateQuantity;

  const subtotal = items.reduce((sum, item) => {
    const rawPrice = Number(item.price) || 0;
    const price = rawPrice > 1000 ? Math.round(rawPrice * 0.0104) : rawPrice;
    return sum + price * (item.quantity || item.qty || 1);
  }, 0);

  const FREE_SHIPPING_THRESHOLD = 250;
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-3 sm:p-5">
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Detached Floating Glass Pod */}
      <aside className="relative z-10 w-full max-w-md glass-modal rounded-[32px] h-full flex flex-col justify-between overflow-hidden p-6 sm:p-8">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border-subtle)]">
            <div>
              <h2 className="font-editorial italic text-3xl leading-none">Your Bag</h2>
              <span className="text-xs text-[var(--ink-muted)] mt-1 block">
                {items.length} {items.length === 1 ? 'piece' : 'pieces'} selected
              </span>
            </div>
            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs hover:scale-105 transition-transform"
            >
              ✕
            </button>
          </div>

          {/* Liquid Gradient Free-Shipping Progress Bar */}
          <div className="py-3 px-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-[var(--glass-border-subtle)] space-y-1.5 my-4">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--ink-secondary)]">
                {remaining === 0 ? (
                  <span className="text-emerald-500 font-semibold">✓ Free Express Delivery Unlocked</span>
                ) : (
                  <>Add <strong className="text-[var(--ink-primary)]">${remaining.toFixed(2)}</strong> for free delivery</>
                )}
              </span>
              <span className="font-semibold text-[var(--ink-primary)]">{progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--glass-border-subtle)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <p className="font-editorial italic text-2xl text-[var(--ink-secondary)]">
                Your wardrobe bag is empty
              </p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="btn-prism px-6 py-3 text-xs uppercase tracking-widest inline-block"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            items.map((item, idx) => {
              const size = item.selectedSize || item.size || 'M';
              const color = item.selectedColor || item.color || 'Default';
              const rawPrice = Number(item.price) || 0;
              const price = rawPrice > 1000 ? Math.round(rawPrice * 0.0104) : rawPrice;
              const qty = item.quantity || item.qty || 1;

              return (
                <div
                  key={`${item.id}-${size}-${idx}`}
                  className="flex gap-4 p-3.5 rounded-2xl glass-card border border-[var(--glass-border-subtle)]"
                >
                  <img
                    src={item?.images?.[0] || item?.image}
                    alt={item?.name || item?.title}
                    className="w-20 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-2">
                        <h3 className="text-sm font-medium leading-snug">{item?.name || item?.title}</h3>
                        <span className="text-sm font-semibold shrink-0">
                          ${(price * qty).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                        {color} · Size {size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center rounded-full bg-[var(--bg-sub)] px-2.5 py-1 text-xs border border-[var(--glass-border-subtle)]">
                        <button
                          onClick={() =>
                            updateQuantity?.(item.id, Math.max(1, qty - 1), size, color)
                          }
                          className="px-1.5 hover:text-[var(--ink-primary)]"
                        >
                          −
                        </button>
                        <span className="px-2 font-medium">{qty}</span>
                        <button
                          onClick={() =>
                            updateQuantity?.(item.id, qty + 1, size, color)
                          }
                          className="px-1.5 hover:text-[var(--ink-primary)]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem?.(item.id, size, color)}
                        className="text-xs text-[var(--ink-muted)] hover:text-rose-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4 border-t border-[var(--glass-border-subtle)] space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                Subtotal
              </span>
              <span className="font-editorial italic text-3xl">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-prism block w-full py-4 text-center text-xs uppercase tracking-[0.18em]"
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
