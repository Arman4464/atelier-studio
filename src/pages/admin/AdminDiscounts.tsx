import { useState } from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import { useDiscountsStore, type DiscountType } from "../../store/discountsStore";
import { useUIStore } from "../../store/uiStore";
import FormField from "../../components/FormField";

const emptyForm = { code: "", type: "percentage" as DiscountType, value: "10", expiresAt: "", usageLimit: "" };

export default function AdminDiscounts() {
  const discounts = useDiscountsStore((s) => s.discounts);
  const addDiscount = useDiscountsStore((s) => s.addDiscount);
  const deleteDiscount = useDiscountsStore((s) => s.deleteDiscount);
  const toggleActive = useDiscountsStore((s) => s.toggleActive);
  const showToast = useUIStore((s) => s.showToast);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.code.trim()) next.code = "Enter a code";
    else if (discounts.some((d) => d.code === form.code.trim().toUpperCase())) next.code = "That code already exists";
    if (!form.value.trim() || Number(form.value) <= 0) next.value = "Enter a valid value";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addDiscount({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      active: true,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
    });
    showToast(`${form.code.trim().toUpperCase()} created`);
    setForm(emptyForm);
    setShowForm(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    showToast(`Copied ${code}`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Admin</span>
          <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">Discounts</h1>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow">
            <Plus size={14} /> New Discount
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-5 border border-line p-6 sm:grid-cols-2">
          <FormField label="Code" mono value={form.code} onChange={(v) => setForm({ ...form, code: v })} required placeholder="SUMMER25" error={errors.code} />
          <label className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-ink-dim">Type</span>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })}
              className="border border-line bg-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:border-indigo-glow"
            >
              <option value="percentage" className="bg-void">Percentage Off</option>
              <option value="fixed" className="bg-void">Fixed Amount Off</option>
            </select>
          </label>
          <FormField label={form.type === "percentage" ? "Percentage (%)" : "Amount (INR)"} mono value={form.value} onChange={(v) => setForm({ ...form, value: v })} required error={errors.value} />
          <FormField label="Usage Limit (optional)" mono value={form.usageLimit} onChange={(v) => setForm({ ...form, usageLimit: v })} placeholder="Unlimited" />
          <FormField label="Expires (optional)" type="date" value={form.expiresAt} onChange={(v) => setForm({ ...form, expiresAt: v })} placeholder="Never" />
          <div className="flex gap-4 sm:col-span-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-line py-4 text-xs font-semibold uppercase tracking-widest text-ink hover:border-ink">
              Cancel
            </button>
            <button type="submit" className="flex-[2] bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void hover:bg-indigo-glow">
              Create Discount
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className="mt-6 overflow-x-auto border border-line">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line bg-void-2 text-left text-[10px] uppercase tracking-widest text-ink-dim">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Usage</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {discounts.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-void-2">
                  <td className="px-4 py-3">
                    <button onClick={() => copyCode(d.code)} className="flex items-center gap-2 font-mono text-xs text-ink hover:text-indigo-glow">
                      {d.code} <Copy size={11} />
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-dim">{d.type === "percentage" ? `${d.value}%` : `$${d.value}`}</td>
                  <td className="px-4 py-3 font-mono text-ink-dim">{d.usageCount}{d.usageLimit != null ? ` / ${d.usageLimit}` : ""}</td>
                  <td className="px-4 py-3 text-ink-dim">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : "Never"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(d.id)}
                      className={`px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest ${d.active ? "bg-indigo-glow text-void" : "bg-line text-ink-dim"}`}
                    >
                      {d.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        deleteDiscount(d.id);
                        showToast(`${d.code} deleted`);
                      }}
                      aria-label={`Delete ${d.code}`}
                      className="text-ink-dim hover:text-flame"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {discounts.length === 0 && <p className="p-8 text-center text-sm text-ink-dim">No discount codes yet.</p>}
        </div>
      )}
    </div>
  );
}
