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
    courier: 'DHL_EXPRESS_ARCHIVE',
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
  const shipping = form.courier === 'DHL_EXPRESS_ARCHIVE' ? 0 : 25;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderRef = `AS-${Math.floor(100000 + Math.random() * 900000)}`;
    const shippingData: ShippingInfo = {
      name: `${form.firstName} ${form.lastName}`.trim() || 'ARCHIVE CLIENT',
      email: form.email,
      address: form.address,
      city: form.city,
      zip: form.postalCode,
      country: form.country,
    };

    sessionStorage.setItem(
      'last_atelier_order',
      JSON.stringify({
        orderRef,
        items,
        total,
        consignee: shippingData.name,
        address: `${shippingData.address}, ${shippingData.city} ${shippingData.zip}`,
        date: new Date().toISOString().slice(0, 10),
      })
    );

    if (onComplete) {
      onComplete(shippingData, orderRef);
    }

    if (clearCart) clearCart();
    navigate('/confirmation');
  };

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)]">
      <div className="px-6 sm:px-10 py-8 hairline-b flex items-end justify-between">
        <div>
          <span className="font-ledger text-xs uppercase text-[var(--accent-stamp)]">
            // FORM N° 09 — LOGISTICS & SETTLEMENT
          </span>
          <h1 className="font-grotesk font-extrabold text-3xl sm:text-5xl uppercase tracking-tight mt-1">
            Dispatch <span className="font-editorial italic font-normal lowercase">Requisition</span>
          </h1>
        </div>
        <Link to="/shop" className="font-ledger text-xs uppercase underline">
          ← MODIFY SPECIMENS
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left 7 Columns: Consignee & Settlement Ledger */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 hairline-r space-y-12">
          {/* Section 01: Consignee Details */}
          <section className="space-y-6">
            <div className="pb-3 hairline-b flex items-center justify-between font-ledger text-xs uppercase">
              <span className="font-bold">01 // CONSIGNEE IDENTIFICATION</span>
              <span className="text-[var(--ink-muted)]">REQUIRED FIELDS [*]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  DISPATCH DOSSIER EMAIL *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="client@domain.com"
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none focus:border-[var(--ink-primary)]"
                />
              </div>

              <div>
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  GIVEN NAME *
                </label>
                <input
                  required
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  SURNAME *
                </label>
                <input
                  required
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  STREET DESTINATION & ARCHITECTURAL UNIT *
                </label>
                <input
                  required
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  MUNICIPALITY / CITY *
                </label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  POSTAL INDEX *
                </label>
                <input
                  required
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section 02: Courier Protocol */}
          <section className="space-y-4">
            <div className="pb-3 hairline-b font-ledger text-xs uppercase font-bold">
              02 // COURIER PROTOCOL
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-ledger text-xs">
              <button
                type="button"
                onClick={() => setForm({ ...form, courier: 'DHL_EXPRESS_ARCHIVE' })}
                className={`p-4 text-left hairline-box transition-colors ${
                  form.courier === 'DHL_EXPRESS_ARCHIVE'
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                    : 'bg-[var(--bg-elevated)]'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>AIR WAYBILL // STANDARD</span>
                  <span>COMPLIMENTARY</span>
                </div>
                <p className="text-[11px] opacity-75 mt-1">
                  GARMENT BAG + SEALED ARCHIVE BOX (3–5 DAYS)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, courier: 'PRIORITY_COURIER' })}
                className={`p-4 text-left hairline-box transition-colors ${
                  form.courier === 'PRIORITY_COURIER'
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                    : 'bg-[var(--bg-elevated)]'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>DIRECT ATELIER COURIER</span>
                  <span>+$25.00</span>
                </div>
                <p className="text-[11px] opacity-75 mt-1">
                  INSURED NEXT-DAY PRIORITY DISPATCH
                </p>
              </button>
            </div>
          </section>

          {/* Section 03: Financial Settlement */}
          <section className="space-y-4">
            <div className="pb-3 hairline-b font-ledger text-xs uppercase font-bold">
              03 // FINANCIAL SETTLEMENT
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  INSTRUMENT NUMBER (CARD) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="4532 •••• •••• ••••"
                  value={form.cardNumber}
                  onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  EXPIRATION (MM/YY) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="08/29"
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-ledger text-[11px] uppercase text-[var(--ink-secondary)] mb-1.5">
                  SECURITY CODE (CVC) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="884"
                  value={form.cvc}
                  onChange={(e) => setForm({ ...form, cvc: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs focus:outline-none"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="w-full py-5 bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] transition-colors font-ledger text-xs uppercase tracking-[0.2em] font-bold"
          >
            AUTHORIZE & STAMP DISPATCH REQUISITION — ${total.toFixed(2)} →
          </button>
        </div>

        {/* Right 5 Columns: Perforated Packing Manifest */}
        <div className="lg:col-span-5 bg-[var(--bg-sub)] p-6 sm:p-10 lg:p-12">
          <div className="bg-[var(--bg-elevated)] p-6 sm:p-8 hairline-box font-ledger text-xs space-y-6">
            <div className="pb-4 perforated-b flex justify-between items-center">
              <span className="font-bold uppercase">PACKING MANIFEST</span>
              <span className="text-[var(--ink-muted)]">LOT AW//26</span>
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between gap-4 pb-3 hairline-b">
                  <div>
                    <div className="font-grotesk font-bold uppercase">
                      {item.name || item.title}
                    </div>
                    <div className="text-[11px] text-[var(--ink-muted)]">
                      QTY: {item.quantity || item.qty || 1} // SIZE: [{item.selectedSize || item.size || 'M'}]
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(getNormalizedPrice(item.price) * (item.quantity || item.qty || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 perforated-b pb-4">
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>SUBTOTAL VALUATION</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--ink-secondary)]">
                <span>COURIER LOGISTICS</span>
                <span>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-bold">
              <span>TOTAL SETTLEMENT</span>
              <span className="text-[var(--accent-stamp)]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Checkout;
