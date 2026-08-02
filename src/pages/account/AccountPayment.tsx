import { useState } from "react";
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

export default function AccountPayment() {
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
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Account</span>
          <h1 className="font-display text-4xl font-black uppercase text-ink md:text-5xl">Payment Methods</h1>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 border border-line px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-indigo-glow hover:text-indigo-glow">
            <Plus size={14} /> Add Card
          </button>
        )}
      </div>

      <p className="mt-4 max-w-lg text-xs leading-relaxed text-ink-dim">
        This is a demo store — card numbers are never transmitted or stored. Only the card brand, last 4 digits and expiry are kept, exactly like a real checkout would show you.
      </p>

      {showForm && (
        <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-5 border border-line p-6 sm:grid-cols-2">
          <FormField label="Name on Card" span2 value={name} onChange={setName} required error={errors.name} />
          <FormField label="Card Number" span2 mono placeholder="0000 0000 0000 0000" maxLength={19} value={cardNumber} onChange={setCardNumber} required error={errors.cardNumber} />
          <FormField label="Expiry" mono placeholder="MM / YY" value={expiry} onChange={setExpiry} required error={errors.expiry} />
          <div className="flex gap-4 sm:col-span-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-line py-4 text-xs font-semibold uppercase tracking-widest text-ink hover:border-ink">
              Cancel
            </button>
            <button type="submit" className="flex-[2] bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void hover:bg-indigo-glow">
              Add Card
            </button>
          </div>
        </form>
      )}

      {!showForm && user.paymentMethods.length === 0 && (
        <div className="mt-10 border border-line p-10 text-center">
          <p className="text-sm text-ink-dim">No saved payment methods yet.</p>
        </div>
      )}

      {!showForm && user.paymentMethods.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {user.paymentMethods.map((pm) => (
            <div key={pm.id} className="border border-line p-6">
              <div className="mb-4 flex items-center justify-between">
                <CreditCard size={20} className="text-indigo-glow" />
                {pm.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-zest">
                    <Star size={11} className="fill-zest" /> Default
                  </span>
                )}
              </div>
              <p className="font-mono text-sm text-ink">{pm.brand} &bull;&bull;&bull;&bull; {pm.last4}</p>
              <p className="mt-1 text-xs text-ink-dim">Expires {pm.expiry}</p>
              <div className="mt-5 flex items-center gap-5 text-[11px] uppercase tracking-widest">
                {!pm.isDefault && (
                  <button onClick={() => setDefaultPaymentMethod(pm.id)} className="text-ink-dim hover:text-ink">
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => {
                    removePaymentMethod(pm.id);
                    showToast("Card removed");
                  }}
                  className="ml-auto flex items-center gap-1.5 text-flame hover:underline"
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
}
