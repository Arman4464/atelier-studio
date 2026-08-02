import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import { useUIStore } from "../../store/uiStore";
import FormField from "../../components/FormField";

export default function AdminSettings() {
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
    <div className="max-w-2xl">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Admin</span>
      <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">Settings</h1>

      <form onSubmit={save} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Store Name" value={storeName} onChange={setStoreName} required />
        <FormField label="Support Email" type="email" value={supportEmail} onChange={setSupportEmail} />
        <FormField label="Free Shipping Threshold (INR)" mono value={freeShippingThreshold} onChange={setFreeShippingThreshold} />
        <FormField label="Standard Shipping Cost (INR)" mono value={standardShippingCost} onChange={setStandardShippingCost} />
        <button type="submit" className="w-fit bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow sm:col-span-2">
          Save Settings
        </button>
      </form>

      <section className="mt-14 border border-flame/30 p-6">
        <h2 className="mb-2 font-display text-lg font-bold text-flame">Danger Zone</h2>
        <p className="mb-5 text-xs text-ink-dim">
          Resets products, orders, customers, and discounts back to the original seeded demo data. Useful after testing admin changes.
        </p>
        <button onClick={resetDemoData} className="flex items-center gap-2 border border-flame px-6 py-3 text-xs font-semibold uppercase tracking-widest text-flame transition-colors hover:bg-flame hover:text-on-flame">
          <RotateCcw size={13} /> Reset Demo Data
        </button>
      </section>
    </div>
  );
}
