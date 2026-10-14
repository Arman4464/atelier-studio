import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import { useUIStore } from "../../store/uiStore";
import FormField from "../../components/FormField";

export const AdminSettings: React.FC = () => {
  const settings = useSettingsStore();
  const showToast = useUIStore((s) => s.showToast);

  const [storeName, setStoreName] = useState(settings.storeName);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(String(settings.freeShippingThreshold));
  const [standardShippingCost, setStandardShippingCost] = useState(String(settings.standardShippingCost));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    settings.updateSettings({
      storeName: storeName.trim() || "ATELIER",
      supportEmail: supportEmail.trim(),
      freeShippingThreshold: Number(freeShippingThreshold) || 0,
      standardShippingCost: Number(standardShippingCost) || 0,
    });
    showToast("Settings saved");
  };

  const resetDemoData = () => {
    if (!confirm("Reset all demo data (products, orders, customers, discounts) back to the original seed? This clears everything stored in this browser.")) return;
    ["atelier-products-v2", "atelier-auth-v2", "atelier-discounts-v2", "atelier-settings-v2", "atelier-cart-v2"].forEach((key) => localStorage.removeItem(key));
    window.location.href = "/";
  };

  return (
    <div className="max-w-2xl space-y-10">
      <div className="pb-6 border-b border-black/5 dark:border-white/10">
        <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Studio Administration
        </span>
        <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
          Global Config
        </h1>
      </div>

      <section className="glass-card rounded-[28px] p-6 sm:p-8">
        <h2 className="mb-5 font-display text-2xl font-light text-[var(--ink-primary)]">Storefront Parameters</h2>
        <form onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Brand / Studio Wordmark" value={storeName} onChange={setStoreName} required />
          <FormField label="Liaison Email" type="email" value={supportEmail} onChange={setSupportEmail} />
          <FormField label="Complimentary Dispatch Threshold ($)" mono value={freeShippingThreshold} onChange={setFreeShippingThreshold} />
          <FormField label="Standard Courier Fee ($)" mono value={standardShippingCost} onChange={setStandardShippingCost} />
          <div className="sm:col-span-2 pt-3">
            <button type="submit" className="btn-prism px-7 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider">
              Apply Configurations
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[28px] border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8">
        <h2 className="mb-2 font-display text-lg font-semibold text-rose-500">Demo State Maintenance</h2>
        <p className="mb-5 text-xs text-[var(--ink-secondary)]">
          Resets all local client accounts, order manifests, inventory overrides, and concession codes back to initial laboratory state.
        </p>
        <button
          onClick={resetDemoData}
          className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
        >
          <RotateCcw size={13} /> Reset Factory Seed Data
        </button>
      </section>
    </div>
  );
};

export default AdminSettings;
