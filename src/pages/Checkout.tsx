// src/pages/Checkout.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CheckoutProps {
  onComplete?: (shipping: any, orderNumber: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = (props) => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useAtelierBridge();

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderRef = `AT-${Math.floor(100000 + Math.random() * 900000)}`;
    sessionStorage.setItem(
      'last_atelier_order',
      JSON.stringify({
        orderRef,
        total: cartSubtotal,
        consignee: `${form.firstName} ${form.lastName}`.trim() || 'Atelier Client',
        address: `${form.address}, ${form.city}`,
        date: new Date().toLocaleDateString(),
      })
    );
    props?.onComplete?.(form, orderRef);
    clearCart?.();
    navigate('/confirmation');
  };

  return (
    <main className="min-h-screen py-10 px-3 sm:px-6 max-w-[1440px] mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl uppercase">
          Express Checkout
        </h1>
        <Link to="/shop" className="font-mono-tech text-xs underline">
          ← Continue Shopping
        </Link>
      </div>

      <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 surface-card p-6 sm:p-10 space-y-6">
          <h2 className="font-display font-bold text-lg uppercase">
            01 // Delivery Destination
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-studio sm:col-span-2"
            />
            <input
              required
              type="text"
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="input-studio"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="input-studio"
            />
            <input
              required
              type="text"
              placeholder="Street address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-studio sm:col-span-2"
            />
            <input
              required
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input-studio"
            />
            <input
              required
              type="text"
              placeholder="Postal code"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              className="input-studio"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 btn-signal text-xs uppercase tracking-widest"
          >
            Authorize Order · ${cartSubtotal.toFixed(2)} →
          </button>
        </div>

        <div className="lg:col-span-5 surface-card p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-lg uppercase">
            Order Summary ({cartItems.length})
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {cartItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-[var(--border-subtle)]">
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="font-mono-tech text-xs text-[var(--ink-muted)]">
                    Qty {item.quantity} · Size {item.size}
                  </div>
                </div>
                <span className="font-mono-tech font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-3 flex justify-between font-mono-tech text-lg font-bold">
            <span>Total</span>
            <span className="text-[var(--accent-signal)]">${cartSubtotal.toFixed(2)}</span>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Checkout;
