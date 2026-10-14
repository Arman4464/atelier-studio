import React, { useState } from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import { useDiscountsStore, type DiscountType } from "../../store/discountsStore";
import { useUIStore } from "../../store/uiStore";
import FormField from "../../components/FormField";

const emptyForm = { code: "", type: "percentage" as DiscountType, value: "10", expiresAt: "", usageLimit: "" };

export const AdminDiscounts: React.FC = () => {
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Promotions &amp; Concessions
          </span>
          <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
            Discount Ledger
          </h1>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-prism flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider"
          >
            <Plus size={14} /> New Concession Code
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="glass-card rounded-[28px] p-6 sm:p-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Code" mono value={form.code} onChange={(v) => setForm({ ...form, code: v })} required placeholder="SUMMER25" error={errors.code} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })}
              className="glass-input"
            >
              <option value="percentage" className="bg-void dark:bg-zinc-900">Percentage Off (%)</option>
              <option value="fixed" className="bg-void dark:bg-zinc-900">Fixed Amount Off</option>
            </select>
          </div>
          <FormField label={form.type === "percentage" ? "Percentage (%)" : "Amount ($)"} mono value={form.value} onChange={(v) => setForm({ ...form, value: v })} required error={errors.value} />
          <FormField label="Usage Limit (optional)" mono value={form.usageLimit} onChange={(v) => setForm({ ...form, usageLimit: v })} placeholder="Unlimited" />
          <FormField label="Expires (optional)" type="date" value={form.expiresAt} onChange={(v) => setForm({ ...form, expiresAt: v })} placeholder="Never" />
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
              Create Concession Code
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className="glass-card rounded-[28px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-left text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">
                  <th className="px-5 py-3.5 font-medium">Code</th>
                  <th className="px-5 py-3.5 font-medium">Value</th>
                  <th className="px-5 py-3.5 font-medium">Usage</th>
                  <th className="px-5 py-3.5 font-medium">Expires</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10 text-xs">
                {discounts.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
                    <td className="px-5 py-3.5">
                      <button onClick={() => copyCode(d.code)} className="flex items-center gap-2 font-mono text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                        {d.code} <Copy size={11} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[var(--ink-secondary)]">{d.type === "percentage" ? `${d.value}%` : `$${d.value}`}</td>
                    <td className="px-5 py-3.5 font-mono text-[var(--ink-muted)]">{d.usageCount}{d.usageLimit != null ? ` / ${d.usageLimit}` : ""}</td>
                    <td className="px-5 py-3.5 font-mono text-[var(--ink-muted)]">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : "Never"}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleActive(d.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono uppercase border transition-all ${
                          d.active
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                            : "bg-black/5 border-black/10 text-[var(--ink-muted)]"
                        }`}
                      >
                        {d.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          deleteDiscount(d.id);
                          showToast(`${d.code} deleted`);
                        }}
                        aria-label={`Delete ${d.code}`}
                        className="text-[var(--ink-muted)] hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {discounts.length === 0 && <p className="p-8 text-center text-sm text-[var(--ink-muted)]">No active concession codes.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminDiscounts;
