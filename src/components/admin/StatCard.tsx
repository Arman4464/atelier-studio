import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend }) => {
  return (
    <div className="glass-card rounded-[24px] p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
          <Icon size={18} />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full border",
              trend.positive
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-300"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-light text-[var(--ink-primary)] tracking-tight">{value}</div>
      <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">{label}</div>
    </div>
  );
};

export default StatCard;
