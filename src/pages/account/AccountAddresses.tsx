import React, { useState } from "react";
import { Plus, Star, Pencil, Trash2 } from "lucide-react";
import { useAuthStore, type Address } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import FormField from "../../components/FormField";

const emptyForm = { label: "", name: "", street: "", city: "", zip: "", country: "India" };

export const AccountAddresses: React.FC = () => {
  const user = useAuthStore((s) => s.currentUser());
  const addAddress = useAuthStore((s) => s.addAddress);
  const updateAddress = useAuthStore((s) => s.updateAddress);
  const removeAddress = useAuthStore((s) => s.removeAddress);
  const setDefaultAddress = useAuthStore((s) => s.setDefaultAddress);
  const showToast = useUIStore((s) => s.showToast);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return null;

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const startEdit = (address: Address) => {
    setForm({ label: address.label, name: address.name, street: address.street, city: address.city, zip: address.zip, country: address.country });
    setEditingId(address.id);
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.label.trim()) next.label = "Give this address a label";
    if (!form.name.trim()) next.name = "Enter a recipient name";
    if (!form.street.trim()) next.street = "Enter a street address";
    if (!form.city.trim()) next.city = "Enter a city";
    if (!form.zip.trim()) next.zip = "Enter a postal code";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingId) {
      updateAddress(editingId, form);
      showToast("Address updated");
    } else {
      addAddress({ ...form, isDefault: false });
      showToast("Address added");
    }
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="mb-2 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Private Client
          </span>
          <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">Saved Addresses</h1>
        </div>
        {!showForm && (
          <button
            onClick={startAdd}
            className="btn-prism flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider"
          >
            <Plus size={14} /> Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="mt-8 glass-card rounded-[28px] p-6 sm:p-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Label" placeholder="Home, Studio, Office..." value={form.label} onChange={(v) => setForm({ ...form, label: v })} required error={errors.label} />
          <FormField label="Recipient Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required error={errors.name} />
          <FormField label="Street Address" span2 value={form.street} onChange={(v) => setForm({ ...form, street: v })} required error={errors.street} />
          <FormField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required error={errors.city} />
          <FormField label="Postal Code" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} required error={errors.zip} />
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1">Country</label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="glass-input"
            >
              {["India", "Portugal", "France", "United Kingdom", "United States", "Japan", "Other"].map((c) => (
                <option key={c} value={c} className="bg-void dark:bg-zinc-900">{c}</option>
              ))}
            </select>
          </div>
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
              {editingId ? "Save Changes" : "Save Address"}
            </button>
          </div>
        </form>
      )}

      {!showForm && user.addresses.length === 0 && (
        <div className="mt-8 glass-card rounded-[28px] p-12 text-center">
          <p className="text-sm text-[var(--ink-secondary)]">No saved addresses on file.</p>
        </div>
      )}

      {!showForm && user.addresses.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {user.addresses.map((address) => (
            <div key={address.id} className="glass-card rounded-[24px] p-6 transition-all duration-300 hover:shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {address.label}
                </span>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300">
                    <Star size={11} className="fill-amber-500" /> Default
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[var(--ink-primary)]">{address.name}</p>
              <p className="mt-1 text-xs text-[var(--ink-secondary)] leading-relaxed">
                {address.street}, {address.city} {address.zip}, {address.country}
              </p>
              <div className="mt-5 flex items-center gap-4 text-xs font-medium pt-3 border-t border-black/5 dark:border-white/10">
                <button
                  onClick={() => startEdit(address)}
                  className="flex items-center gap-1.5 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address.id)}
                    className="text-[var(--ink-muted)] hover:text-[var(--ink-primary)] transition-colors"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => {
                    removeAddress(address.id);
                    showToast("Address removed");
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

export default AccountAddresses;
