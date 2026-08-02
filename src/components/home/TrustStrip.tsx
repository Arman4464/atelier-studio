import { useMemo } from "react";
import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { getTrustPoints } from "../../data/content";
import { useSettingsStore } from "../../store/settingsStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";

const icons = [Truck, RotateCcw, ShieldCheck, Sparkles];

export default function TrustStrip() {
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold);
  const currency = useCartStore((s) => s.currency);
  const trustPoints = useMemo(
    () => getTrustPoints(formatPrice(freeShippingThreshold, currency)),
    [freeShippingThreshold, currency]
  );

  return (
    <section className="mx-auto max-w-[1800px] px-1.5">
      <div className="grid grid-cols-2 divide-x divide-y divide-line border border-t-0 border-line md:grid-cols-4 md:divide-y-0">
        {trustPoints.map((item, i) => {
          const Icon = icons[i];
          return (
            <div key={item.title} className="flex flex-col items-start gap-2 px-6 py-8">
              <Icon size={18} className="text-indigo-glow" />
              <span className="text-xs font-semibold uppercase tracking-widest text-ink">{item.title}</span>
              <span className="text-[11px] leading-snug text-ink-dim">{item.desc}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
