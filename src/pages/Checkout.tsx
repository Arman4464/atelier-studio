import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

interface CheckoutProps {
  onComplete?: (shipping: ShippingInfo, orderNumber: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const cartStore = useCartStore() as any;
  const items: any[] = cartStore.items || cartStore.cart || [];
  const clearCart = cartStore.clearCart;

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'ITALY',
    courier: 'DHL_EXPRESS',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const getNormalizedPrice = (price: any): number => {
    if (typeof price === 'number') {
      return price > 1000 ? Math.round(price * 0.0104) : price;
    }
    const parsed = parseFloat(String(price).replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 380 : parsed > 1000 ? Math.round(parsed * 0.0104) : parsed;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + getNormalizedPrice(item.price) * (item.quantity || item.qty || 1),
    0
  );
  const shipping = form.courier === 'DHL_EXPRESS' ? 0 : 25;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderRef = `AT-${Math.floor(100000 + Math.random() * 900000)}`;
    const shippingData: ShippingInfo = {
      name: `${form.firstName} ${form.lastName}`.trim() || 'Valued Client',
      email: form.email,
      address: form.address,
      city: form.city,
      zip: form.postalCode,
      country: form.country,
    };

    if (onComplete) {
      onComplete(shippingData, orderRef);
    }
    if (clearCart) clearCart();
    navigate('/confirmation', { state: { orderRef, shippingData, total } });
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-36 px-5 flex items-center justify-center">
        <div className="glass-island rounded-[36px] p-10 sm:p-14 text-center max-w-md space-y-5">
          <h1 className="font-editorial italic text-4xl">Your Bag is Empty</h1>
          <p className="text-sm text-[var(--ink-secondary)] font-light">
            You currently have no pieces selected for checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-7 py-3.5 rounded-full bg-[var(--ink-primary)] text-[var(--bg-canvas)] text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Explore Collection →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-36 px-4 sm:px-8 max-w-[1440px] mx-auto">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-2">
          Secure Atelier Checkout
        </span>
        <h1 className="font-editorial italic text-4xl sm:text-6xl font-normal">
          Client Order Dossier
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 7 Columns: Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          {/* Shipping Information Island */}
          <div className="glass-island rounded-[32px] p-7 sm:p-10 space-y-6">
            <h2 className="font-editorial italic text-2xl sm:text-3xl">
              1. Delivery Coordinates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="client@atelier.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                  First Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                  Last Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                  Delivery Address *
                </label>
                <input
                  required
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                  City *
                </label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                  Postal Code *
                </label>
                <input
                  required
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Island */}
          <div className="glass-island rounded-[32px] p-7 sm:p-10 space-y-6">
            <h2 className="font-editorial italic text-2xl sm:text-3xl">
              2. Payment Credentials
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                  Name on Card *
                </label>
                <input
                  required
                  type="text"
                  value={form.cardName}
                  onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                  placeholder="Full Cardholder Name"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                  Card Number *
                </label>
                <input
                  required
                  type="text"
                  value={form.cardNumber}
                  onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                  placeholder="•••• •••• •••• ••••"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                    Expiry *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--ink-secondary)] mb-1.5">
                    CVC *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.cvc}
                    onChange={(e) => setForm({ ...form, cvc: e.target.value })}
                    placeholder="•••"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-sub)] text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[var(--ink-primary)] text-[var(--bg-canvas)] text-xs font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity shadow-xl"
          >
            Authorize Payment — ${total.toFixed(2)}
          </button>
        </form>

        {/* Right 5 Columns: Floating Summary Island */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="glass-island rounded-[32px] p-7 sm:p-10 space-y-6">
            <h2 className="font-editorial italic text-2xl sm:text-3xl">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar divide-y divide-[var(--glass-border)]">
              {items.map((item, idx) => {
                const price = getNormalizedPrice(item.price);
                const qty = item.quantity || item.qty || 1;
                return (
                  <div key={idx} className="pt-3 flex gap-4 items-center">
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.name || item.title}
                      className="w-16 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.name || item.title}</h4>
                      <p className="text-xs text-[var(--ink-muted)]">
                        Size {item.selectedSize || item.size || 'M'} · Qty {qty}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">${(price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[var(--glass-border)] space-y-2 text-xs">
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>Subtotal</span>
                <span className="font-medium text-[var(--ink-primary)]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>Carbon-Neutral Express Delivery</span>
                <span className="font-medium text-emerald-600">Complimentary</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-3 border-t border-[var(--glass-border)]">
                <span>Total</span>
                <span className="font-editorial italic text-2xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
