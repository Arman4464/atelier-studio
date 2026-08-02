import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check, UserCircle2 } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { formatPrice } from "../lib/format";
import FormField from "../components/FormField";

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

const STEPS = ["Shipping", "Payment", "Review"];

export default function Checkout({
  onComplete,
}: {
  onComplete: (shipping: ShippingInfo, orderNumber: string) => void;
}) {
  const navigate = useNavigate();
  const cart = useCartStore((s) => s.cart);
  const currency = useCartStore((s) => s.currency);
  const cartTotal = useCartStore((s) => s.cartTotal());
  const cartGrandTotal = useCartStore((s) => s.cartGrandTotal());
  const discountAmount = useCartStore((s) => s.discountAmount());
  const appliedDiscount = useCartStore((s) => s.appliedDiscount);
  const shippingCost = useCartStore((s) => s.shippingCost());
  const clearCart = useCartStore((s) => s.clearCart);
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold);

  const user = useAuthStore((s) => s.currentUser());
  const addOrder = useAuthStore((s) => s.addOrder);

  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "India",
  });
  const [payment, setPayment] = useState({ number: "", expiry: "", cvc: "" });

  // Prefill from the logged-in user's default address / email once, on arrival.
  useEffect(() => {
    if (!user) return;
    const defaultAddress = user.addresses.find((a) => a.isDefault) ?? user.addresses[0];
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      setShipping({
        name: defaultAddress.name,
        email: user.email,
        address: defaultAddress.street,
        city: defaultAddress.city,
        zip: defaultAddress.zip,
        country: defaultAddress.country,
      });
    } else {
      setShipping((s) => ({ ...s, name: user.name, email: user.email }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const applyAddress = (id: string) => {
    const address = user?.addresses.find((a) => a.id === id);
    if (!address) return;
    setSelectedAddressId(id);
    setShipping({
      name: address.name,
      email: user?.email ?? shipping.email,
      address: address.street,
      city: address.city,
      zip: address.zip,
      country: address.country,
    });
  };

  const placeOrder = () => {
    let orderNumber: string;
    if (user && cart.length > 0) {
      const order = addOrder({
        items: cart.map((item) => ({ productId: item.id, name: item.name, image: item.images[0], price: item.price, qty: item.qty })),
        total: cartGrandTotal,
        shippingName: shipping.name,
        shippingAddress: `${shipping.address}, ${shipping.city} ${shipping.zip}, ${shipping.country}`,
      });
      orderNumber = order.id;
    } else {
      orderNumber = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    onComplete(shipping, orderNumber);
    clearCart();
    navigate("/confirmation");
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="py-32 text-center">
        <p className="mb-6 font-display text-3xl text-ink-dim">Your bag is empty.</p>
        <button onClick={() => navigate("/shop")} className="text-xs uppercase tracking-widest text-indigo-glow hover:text-ink">
          Browse Collection
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="mx-auto max-w-[1200px] px-5 py-14 md:px-10">
      <div className="mx-auto mb-14 flex max-w-lg items-center gap-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-3">
            <div className="flex flex-shrink-0 flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs transition-colors ${
                  step > i + 1 ? "border-indigo-glow bg-indigo-glow text-void" : step === i + 1 ? "border-ink bg-ink text-void" : "border-line text-ink-dim"
                }`}
              >
                {step > i + 1 ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-[9px] uppercase tracking-widest text-ink-dim">{label}</span>
            </div>
            {i < 2 && <div className={`h-px flex-1 ${step > i + 1 ? "bg-indigo-glow" : "bg-line"}`} />}
          </div>
        ))}
      </div>

      {!user && step === 1 && (
        <div className="mx-auto mb-10 flex max-w-2xl flex-wrap items-center justify-between gap-3 border border-line bg-void-2 px-6 py-4">
          <div className="flex items-center gap-3">
            <UserCircle2 size={18} className="flex-shrink-0 text-indigo-glow" />
            <p className="text-xs text-ink-dim">Have an account? Log in to check out faster with saved details.</p>
          </div>
          <Link to="/login?redirect=/checkout" className="flex-shrink-0 text-xs font-semibold uppercase tracking-widest text-indigo-glow hover:text-ink">
            Log In
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <h2 className="mb-2 font-display text-3xl font-bold text-ink sm:col-span-2">Shipping Address</h2>

              {user && user.addresses.length > 0 && (
                <div className="flex flex-wrap gap-3 sm:col-span-2">
                  {user.addresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => applyAddress(address.id)}
                      className={`border px-4 py-2 text-left text-xs transition-colors ${
                        selectedAddressId === address.id ? "border-indigo-glow bg-indigo-glow/10 text-ink" : "border-line text-ink-dim hover:border-ink"
                      }`}
                    >
                      <span className="font-semibold uppercase tracking-widest">{address.label}</span>
                      <span className="block text-[11px] text-ink-dim">{address.street}, {address.city}</span>
                    </button>
                  ))}
                  <Link to="/account/addresses" className="border border-dashed border-line px-4 py-2 text-xs text-ink-dim hover:border-ink hover:text-ink">
                    + Manage Addresses
                  </Link>
                </div>
              )}

              <FormField label="Full Name" span2 value={shipping.name} onChange={(v) => setShipping({ ...shipping, name: v })} required autoComplete="name" />
              <FormField label="Email" span2 type="email" value={shipping.email} onChange={(v) => setShipping({ ...shipping, email: v })} required autoComplete="email" />
              <FormField label="Street Address" span2 value={shipping.address} onChange={(v) => setShipping({ ...shipping, address: v })} required autoComplete="street-address" />
              <FormField label="City" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} required autoComplete="address-level2" />
              <FormField label="Postal Code" value={shipping.zip} onChange={(v) => setShipping({ ...shipping, zip: v })} required autoComplete="postal-code" />
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-[10px] uppercase tracking-widest text-ink-dim">Country</span>
                <select
                  value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  className="border border-line bg-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:border-indigo-glow"
                >
                  {["India", "Portugal", "France", "United Kingdom", "United States", "Japan", "Other"].map((c) => (
                    <option key={c} value={c} className="bg-void">{c}</option>
                  ))}
                </select>
              </label>
              <button type="submit" className="mt-4 bg-ink py-5 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow sm:col-span-2">
                Continue to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <h2 className="mb-2 font-display text-3xl font-bold text-ink sm:col-span-2">Payment Details</h2>

              {user && user.paymentMethods.length > 0 && (
                <div className="flex flex-wrap gap-3 sm:col-span-2">
                  {user.paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPayment({ number: `•••• •••• •••• ${pm.last4}`, expiry: pm.expiry, cvc: "" })}
                      className="border border-line px-4 py-2 text-left text-xs text-ink-dim transition-colors hover:border-ink"
                    >
                      <span className="font-mono">{pm.brand} &bull;&bull;&bull;&bull; {pm.last4}</span>
                    </button>
                  ))}
                </div>
              )}

              <FormField
                label="Card Number"
                span2
                mono
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={payment.number}
                onChange={(v) => setPayment({ ...payment, number: v })}
                required
              />
              <FormField label="Expiry" mono placeholder="MM / YY" value={payment.expiry} onChange={(v) => setPayment({ ...payment, expiry: v })} required />
              <FormField label="CVC" mono placeholder="123" maxLength={4} value={payment.cvc} onChange={(v) => setPayment({ ...payment, cvc: v })} required />
              <p className="flex items-center gap-2 text-[11px] text-ink-dim sm:col-span-2">
                This is a demo checkout — no card data is transmitted or stored.
              </p>
              <div className="mt-2 flex gap-4 sm:col-span-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-line py-5 text-xs font-semibold uppercase tracking-widest text-ink hover:border-indigo-glow">
                  Back
                </button>
                <button type="submit" className="flex-[2] bg-ink py-5 text-xs font-semibold uppercase tracking-widest text-void hover:bg-indigo-glow">
                  Review Order
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-8 font-display text-3xl font-bold text-ink">Review &amp; Place Order</h2>
              <div className="space-y-6 text-sm">
                <div className="flex items-start justify-between border border-line p-5">
                  <div>
                    <span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-dim">Shipping To</span>
                    <span className="text-ink">{shipping.name}</span>
                    <br />
                    <span className="text-ink-dim">{shipping.address}, {shipping.city} {shipping.zip}, {shipping.country}</span>
                  </div>
                  <button onClick={() => setStep(1)} className="flex-shrink-0 text-xs text-indigo-glow hover:text-ink">Edit</button>
                </div>
                <div className="flex items-center justify-between border border-line p-5">
                  <div>
                    <span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-dim">Payment</span>
                    <span className="font-mono text-ink">
                      {payment.number.includes("•") ? payment.number : `•••• •••• •••• ${payment.number.slice(-4) || "0000"}`}
                    </span>
                  </div>
                  <button onClick={() => setStep(2)} className="flex-shrink-0 text-xs text-indigo-glow hover:text-ink">Edit</button>
                </div>
                {user && (
                  <p className="text-xs text-ink-dim">This order will be saved to your account order history.</p>
                )}
                <button onClick={placeOrder} className="w-full bg-ink py-5 text-xs font-semibold uppercase tracking-widest text-void hover:bg-indigo-glow">
                  Place Order — {formatPrice(cartGrandTotal, currency)}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="border border-line bg-void-2 p-7 lg:sticky lg:top-32">
            <h3 className="mb-6 font-display text-xl text-ink">Order Summary</h3>
            <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.images[0]} className="h-16 w-12 flex-shrink-0 bg-void object-cover" alt={item.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-ink">{item.name}</p>
                    <p className="text-[11px] text-ink-dim">Qty {item.qty}</p>
                  </div>
                  <span className="font-mono text-xs text-ink">{formatPrice(item.price * item.qty, currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 border-t border-line pt-6 text-xs">
              <div className="flex justify-between text-ink-dim"><span>Subtotal</span><span className="font-mono">{formatPrice(cartTotal, currency)}</span></div>
              <div className="flex justify-between text-ink-dim"><span>Shipping</span><span className="font-mono">{cartTotal >= freeShippingThreshold ? "Free" : formatPrice(shippingCost, currency)}</span></div>
              {appliedDiscount && <div className="flex justify-between text-indigo-glow"><span>Promo ({appliedDiscount.code})</span><span className="font-mono">-{formatPrice(discountAmount, currency)}</span></div>}
              <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink"><span>Total</span><span className="font-mono">{formatPrice(cartGrandTotal, currency)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
