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

  const rawItems: any[] = cartStore.items || cartStore.cart || [];
  const removeItem = cartStore.removeItem || cartStore.removeFromCart;
  const updateQuantity = cartStore.updateQuantity;

  const getNormalizedPrice = (price: any): number => {
    if (typeof price === 'number') {
      return price > 1000 ? Math.round(price * 0.0104) : price;
    }
    const parsed = parseFloat(String(price).replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed > 1000 ? Math.round(parsed * 0.0104) : parsed;
  };

  const subtotal = rawItems.reduce(
    (sum, item) => sum + getNormalizedPrice(item.price) * (item.quantity || item.qty || 1),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
      />

      {/* Packing Slip Drawer */}
      <aside className="relative z-10 w-full max-w-md bg-[var(--bg-canvas)] text-[var(--ink-primary)] h-full flex flex-col justify-between hairline-l shadow-2xl">
        {/* Top Requisition Header */}
        <div className="p-6 hairline-b flex items-center justify-between">
          <div>
            <span className="font-ledger text-[10px] uppercase tracking-widest text-[var(--ink-muted)] block">
              REQUISITION SLIP // MILAN WORKSHOP
            </span>
            <h2 className="font-grotesk font-extrabold text-xl uppercase tracking-tight">
              Client Bag ({String(rawItems.length).padStart(2, '0')})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="font-ledger text-xs uppercase px-3 py-1.5 hairline-box hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
          >
            [ ESC ]
          </button>
        </div>

        {/* Line Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {rawItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center font-ledger text-xs text-[var(--ink-muted)] space-y-4">
              <span>[ YOUR ARCHIVE REQUISITION SLIP IS EMPTY ]</span>
              <Link
                to="/shop"
                onClick={closeCart}
                className="px-5 py-3 bg-[var(--ink-primary)] text-[var(--bg-canvas)] uppercase tracking-widest"
              >
                BROWSE SPECIMENS →
              </Link>
            </div>
          ) : (
            rawItems.map((item, idx) => {
              const itemKey = `${item.id}-${item.selectedSize || item.size || idx}`;
              const size = item.selectedSize || item.size || 'OS';
              const color = item.selectedColor || item.color || 'RAW';
              const unitPrice = getNormalizedPrice(item.price);
              const qty = item.quantity || item.qty || 1;

              return (
                <div
                  key={itemKey}
                  className="grid grid-cols-12 gap-4 pb-5 perforated-b items-start"
                >
                  <div className="col-span-3 aspect-[3/4] bg-[var(--bg-sub)] hairline-box overflow-hidden">
                    <img
                      src={item?.images?.[0] || item?.image}
                      alt={item?.name || item?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="col-span-9 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-grotesk font-bold text-sm uppercase">
                          {item?.name || item?.title}
                        </h3>
                        <span className="font-ledger text-xs font-semibold">
                          ${(unitPrice * qty).toFixed(2)}
                        </span>
                      </div>
                      <div className="font-ledger text-[11px] text-[var(--ink-secondary)] mt-1">
                        SIZE: [{size}] // LOT: {String(color).toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="inline-flex items-center hairline-box font-ledger text-xs">
                        <button
                          onClick={() => {
                            if (updateQuantity) {
                              updateQuantity(item.id, Math.max(1, qty - 1), size, color);
                            } else if (cartStore.updateQty) {
                              cartStore.updateQty(item.id, -1);
                            }
                          }}
                          className="px-2.5 py-1 hover:bg-[var(--bg-sub)]"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 hairline-l hairline-r">
                          {qty}
                        </span>
                        <button
                          onClick={() => {
                            if (updateQuantity) {
                              updateQuantity(item.id, qty + 1, size, color);
                            } else if (cartStore.updateQty) {
                              cartStore.updateQty(item.id, 1);
                            }
                          }}
                          className="px-2.5 py-1 hover:bg-[var(--bg-sub)]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (removeItem) removeItem(item.id, size, color);
                          else if (cartStore.removeFromCart) cartStore.removeFromCart(item.id);
                        }}
                        className="font-ledger text-[11px] uppercase text-[var(--ink-muted)] hover:text-[var(--accent-stamp)] underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Invoice Ledger */}
        {rawItems.length > 0 && (
          <div className="p-6 bg-[var(--bg-sub)] hairline-t space-y-4">
            <div className="space-y-1.5 font-ledger text-xs">
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>COURIER DISPATCH</span>
                <span>COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 perforated-b pb-2">
                <span>TOTAL VALUATION</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="w-full py-4 bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] transition-colors font-ledger text-xs uppercase tracking-widest flex items-center justify-center gap-3 font-medium"
            >
              <span>PROCEED TO DISPATCH LEDGER</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
