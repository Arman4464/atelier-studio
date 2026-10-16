// src/components/CartDrawer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
  } = useAtelierBridge();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500;
  const progress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-3 sm:p-4">
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />

      <aside className="relative z-10 w-full max-w-md surface-modal rounded-[28px] h-full flex flex-col justify-between p-6 overflow-hidden">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <h2 className="font-display font-extrabold text-xl uppercase">
                Your Bag ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Free Express Shipping Progress Bar */}
          <div className="mt-4 p-3 rounded-2xl bg-[var(--bg-sub)]">
            <div className="flex justify-between font-mono-tech text-[11px] mb-1.5">
              <span>
                {cartSubtotal >= freeShippingThreshold
                  ? '✓ Complimentary Express Courier Unlocked'
                  : `Add $${(freeShippingThreshold - cartSubtotal).toFixed(0)} for Free Express Courier`}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
              <div
                className="h-full bg-[var(--accent-signal)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-sm text-[var(--ink-secondary)]">Your bag is empty</p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="btn-primary px-6 py-3 text-xs uppercase tracking-wider"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={`${item.id}-${item.size}-${idx}`}
                className="flex gap-4 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between gap-2">
                      <h3 className="font-display font-bold text-sm">{item.name}</h3>
                      <span className="font-mono-tech text-xs font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="font-mono-tech text-[11px] text-[var(--ink-muted)] mt-0.5">
                      {item.color} · Size {item.size}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center rounded-full bg-[var(--bg-sub)] px-2 py-0.5 font-mono-tech text-xs">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity - 1, item.size, item.color)
                        }
                        className="px-2"
                      >
                        −
                      </button>
                      <span className="px-2 font-bold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity + 1, item.size, item.color)
                        }
                        className="px-2"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
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

        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-mono-tech text-xs uppercase text-[var(--ink-muted)]">
                Subtotal
              </span>
              <span className="font-mono-tech text-xl font-bold">
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full py-4 btn-signal text-center text-xs uppercase tracking-widest"
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
