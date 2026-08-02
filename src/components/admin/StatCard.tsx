import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

export default function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="border border-line bg-void-2 p-6">
      <div className="mb-5 flex items-center justify-between">
        <Icon size={18} className="text-indigo-glow" />
        {trend && (
          <span className={cn("text-[11px] font-semibold", trend.positive ? "text-indigo-glow" : "text-flame")}>
            {trend.positive ? "\u2191" : "\u2193"} {trend.value}
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-black text-ink">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-ink-dim">{label}</div>
    </div>
  );
}
