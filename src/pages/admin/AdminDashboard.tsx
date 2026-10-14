import React from "react";
import { Link } from "react-router-dom";
import { Package, TrendingUp, Layers, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useProductsStore } from "../../store/productsStore";
import { useAuthStore, computeAllOrders } from "../../store/authStore";

export const AdminDashboard: React.FC = () => {
  const productsStore = useProductsStore() as any;
  const products: any[] = productsStore.products || [];
  const accounts = useAuthStore((s) => s.accounts);
  const allOrders = computeAllOrders(accounts);

  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const formattedRevenue = totalRevenue > 1000
    ? `$${(Math.round(totalRevenue * 0.0104)).toLocaleString()}`
    : `$${totalRevenue.toLocaleString()}`;

  const metrics = [
    {
      code: "M-01",
      label: "Gross Archive Valuation",
      value: formattedRevenue,
      delta: "+14.2% vs last cycle",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      code: "M-02",
      label: "Active Dispatches",
      value: String(allOrders.length),
      delta: "4 pending courier seal",
      icon: ShoppingBag,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      code: "M-03",
      label: "Indexed Garments",
      value: String(products.length || 12),
      delta: "2 low-stock allocations",
      icon: Layers,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      code: "M-04",
      label: "Registered Clients",
      value: String(accounts.length),
      delta: "+6 accounts this month",
      icon: Package,
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  const formatAuditPrice = (price: any) => {
    if (typeof price === "number") {
      return (price > 1000 ? Math.round(price * 0.0104) : price).toFixed(2);
    }
    const parsed = parseFloat(String(price).replace(/[^0-9.]/g, ""));
    return (isNaN(parsed) ? 380 : parsed > 1000 ? Math.round(parsed * 0.0104) : parsed).toFixed(2);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Operations &amp; Archive Management
          </span>
          <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
            Command Center
          </h1>
        </div>
        <Link
          to="/admin/products/new"
          className="btn-prism px-6 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider"
        >
          + Index New Garment
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((m) => (
          <div
            key={m.code}
            className="glass-card rounded-[24px] p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <m.icon size={18} />
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[var(--ink-muted)]">
                {m.code}
              </span>
            </div>
            <div className="font-display text-3xl font-light text-[var(--ink-primary)] tracking-tight">
              {m.value}
            </div>
            <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">
              {m.label}
            </div>
            <div className="mt-3 text-[11px] font-mono text-purple-600 dark:text-purple-400">
              {m.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Specimen Inventory Audit Table */}
      <div className="glass-card rounded-[28px] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--ink-primary)]">
            Active Garment Archive
          </span>
          <Link
            to="/admin/products"
            className="glass-pill px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] flex items-center gap-1.5"
          >
            Manage All Garments <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/10 text-xs">
          {products.slice(0, 6).map((p, idx) => (
            <div
              key={p.id || idx}
              className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <span className="col-span-2 font-mono text-[var(--ink-muted)]">ATL-{(idx + 101).toString()}</span>
              <span className="col-span-5 font-semibold text-[var(--ink-primary)]">
                {p.name || p.title}
              </span>
              <span className="col-span-3 font-mono uppercase text-[var(--ink-secondary)]">
                {p.category || "Outerwear"}
              </span>
              <span className="col-span-2 text-right font-mono font-semibold text-[var(--ink-primary)]">
                ${formatAuditPrice(p.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
