import React, { useState } from "react";
import { Plus, Star, Trash2, CreditCard } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import FormField from "../../components/FormField";

function detectBrand(cardNumber: string): "Visa" | "Mastercard" | "Amex" {
  const digits = cardNumber.replace(/\D/g, "");
  if (/^4/.test(digits)) return "Visa";
  if (/^5/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return "Visa";
}

export const AccountPayment: React.FC = () => {
  const user = useAuthStore((s) => s.currentUser());
  const addPaymentMethod = useAuthStore((s) => s.addPaymentMethod);
  const removePaymentMethod = useAuthStore((s) => s.removePaymentMethod);
  const setDefaultPaymentMethod = useAuthStore((s) => s.setDefaultPaymentMethod);
  const showToast = useUIStore((s) => s.showToast);

  const [showForm, setShowForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cardNumber.replace(/\D/g, "");
    const next: Record<string, string> = {};
    if (digits.length < 12) next.cardNumber = "Enter a valid card number";
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry)) next.expiry = "Use MM / YY format";
    if (!name.trim()) next.name = "Enter the name on the card";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addPaymentMethod({
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      expiry: expiry.replace(/\s/g, ""),
      isDefault: false,
    });
    showToast("Card added");
    setShowForm(false);
    setCardNumber("");
    setExpiry("");
    setName("");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="mb-2 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Private Client
          </span>
          <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">Payment Methods</h1>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-prism flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider"
          >
            <Plus size={14} /> Add Card
          </button>
        )}
      </div>

      <p className="mt-3 max-w-lg text-xs leading-relaxed text-[var(--ink-secondary)]">
        Encrypted simulation layer — card data is processed locally. Only brand signature, last 4 digits, and expiry interval are registered.
      </p>

      {showForm && (
        <form onSubmit={onSubmit} className="mt-8 glass-card rounded-[28px] p-6 sm:p-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name on Card" span2 value={name} onChange={setName} required error={errors.name} />
          <FormField label="Card Number" span2 mono placeholder="0000 0000 0000 0000" maxLength={19} value={cardNumber} onChange={setCardNumber} required error={errors.cardNumber} />
          <FormField label="Expiry" mono placeholder="MM / YY" value={expiry} onChange={setExpiry} required error={errors.expiry} />
          <div className="flex gap-3 sm:col-span-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="glass-pill flex-1 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-prism flex-[2] py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider"
            >
              Add Card
            </button>
          </div>
        </form>
      )}

      {!showForm && user.paymentMethods.length === 0 && (
        <div className="mt-8 glass-card rounded-[28px] p-12 text-center">
          <p className="text-sm text-[var(--ink-secondary)]">No saved payment methods registered.</p>
        </div>
      )}

      {!showForm && user.paymentMethods.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {user.paymentMethods.map((pm) => (
            <div key={pm.id} className="glass-card rounded-[24px] p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <CreditCard size={18} />
                </div>
                {pm.isDefault && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300">
                    <Star size={11} className="fill-amber-500" /> Default
                  </span>
                )}
              </div>
              <p className="font-mono text-base font-semibold text-[var(--ink-primary)]">
                {pm.brand} •••• {pm.last4}
              </p>
              <p className="mt-1 text-xs font-mono text-[var(--ink-muted)]">Expires {pm.expiry}</p>
              <div className="mt-5 flex items-center gap-4 text-xs font-medium pt-3 border-t border-black/5 dark:border-white/10">
                {!pm.isDefault && (
                  <button
                    onClick={() => setDefaultPaymentMethod(pm.id)}
                    className="text-[var(--ink-muted)] hover:text-[var(--ink-primary)] transition-colors"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => {
                    removePaymentMethod(pm.id);
                    showToast("Card removed");
                  }}
                  className="ml-auto flex items-center gap-1.5 text-rose-500 hover:underline"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountPayment;
