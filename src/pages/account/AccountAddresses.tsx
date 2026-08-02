import { useState } from "react";
import { Plus, Star, Pencil, Trash2 } from "lucide-react";
import { useAuthStore, type Address } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import FormField from "../../components/FormField";

const emptyForm = { label: "", name: "", street: "", city: "", zip: "", country: "India" };

export default function AccountAddresses() {
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
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Account</span>
          <h1 className="font-display text-4xl font-black uppercase text-ink md:text-5xl">Addresses</h1>
        </div>
        {!showForm && (
          <button onClick={startAdd} className="flex items-center gap-2 border border-line px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-indigo-glow hover:text-indigo-glow">
            <Plus size={14} /> Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-5 border border-line p-6 sm:grid-cols-2">
          <FormField label="Label" placeholder="Home, Studio, Office..." value={form.label} onChange={(v) => setForm({ ...form, label: v })} required error={errors.label} />
          <FormField label="Recipient Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required error={errors.name} />
          <FormField label="Street Address" span2 value={form.street} onChange={(v) => setForm({ ...form, street: v })} required error={errors.street} />
          <FormField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required error={errors.city} />
          <FormField label="Postal Code" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} required error={errors.zip} />
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-[10px] uppercase tracking-widest text-ink-dim">Country</span>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="border border-line bg-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:border-indigo-glow"
            >
              {["India", "Portugal", "France", "United Kingdom", "United States", "Japan", "Other"].map((c) => (
                <option key={c} value={c} className="bg-void">{c}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-4 sm:col-span-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-line py-4 text-xs font-semibold uppercase tracking-widest text-ink hover:border-ink">
              Cancel
            </button>
            <button type="submit" className="flex-[2] bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void hover:bg-indigo-glow">
              {editingId ? "Save Changes" : "Add Address"}
            </button>
          </div>
        </form>
      )}

      {!showForm && user.addresses.length === 0 && (
        <div className="mt-10 border border-line p-10 text-center">
          <p className="text-sm text-ink-dim">No saved addresses yet.</p>
        </div>
      )}

      {!showForm && user.addresses.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {user.addresses.map((address) => (
            <div key={address.id} className="border border-line p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-glow">{address.label}</span>
                {address.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-zest">
                    <Star size={11} className="fill-zest" /> Default
                  </span>
                )}
              </div>
              <p className="text-sm text-ink">{address.name}</p>
              <p className="mt-1 text-sm text-ink-dim">
                {address.street}, {address.city} {address.zip}, {address.country}
              </p>
              <div className="mt-5 flex items-center gap-5 text-[11px] uppercase tracking-widest">
                <button onClick={() => startEdit(address)} className="flex items-center gap-1.5 text-ink-dim hover:text-ink">
                  <Pencil size={12} /> Edit
                </button>
                {!address.isDefault && (
                  <button onClick={() => setDefaultAddress(address.id)} className="text-ink-dim hover:text-ink">
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => {
                    removeAddress(address.id);
                    showToast("Address removed");
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
