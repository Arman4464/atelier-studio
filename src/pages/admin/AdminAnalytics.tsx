import { useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useAuthStore, computeAllOrders } from "../../store/authStore";
import { useProductsStore } from "../../store/productsStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import { useChartColors, CHART_SERIES } from "../../lib/chartColors";

export default function AdminAnalytics() {
  const accounts = useAuthStore((s) => s.accounts);
  const allOrders = useMemo(() => computeAllOrders(accounts), [accounts]);
  const products = useProductsStore((s) => s.products);
  const currency = useCartStore((s) => s.currency);
  const colors = useChartColors();

  // Orders by status
  const statusCounts = { Processing: 0, Shipped: 0, Delivered: 0 };
  allOrders.forEach((o) => {
    if (statusCounts[o.status as keyof typeof statusCounts] !== undefined) {
      statusCounts[o.status as keyof typeof statusCounts]++;
    }
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const statusColors: Record<string, string> = { Processing: colors.zest, Shipped: colors.indigo, Delivered: colors.indigoGlow };

  // Sales by category
  const revenueByCategory = new Map<string, number>();
  allOrders.forEach((o) => {
    o.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      const cat = product?.category ?? "Other";
      revenueByCategory.set(cat, (revenueByCategory.get(cat) ?? 0) + item.price * (item.qty || 1));
    });
  });
  const categoryData = [...revenueByCategory.entries()].map(([name, revenue]) => ({ name, revenue }));

  // Top products by revenue
  const revenueByProduct = new Map<string, number>();
  allOrders.forEach((o) => {
    o.items.forEach((item) => {
      revenueByProduct.set(item.name, (revenueByProduct.get(item.name) ?? 0) + item.price * (item.qty || 1));
    });
  });
  const productData = [...revenueByProduct.entries()]
    .map(([name, revenue]) => ({ name: name.length > 18 ? `${name.slice(0, 18)}\u2026` : name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const totalRevenue = allOrders.reduce((s, o) => s + (o.total || 0), 0);
  const totalUnits = allOrders.reduce((s, o) => s + o.items.reduce((si, i) => si + (i.qty || 1), 0), 0);

  return (
    <div className="space-y-8">
      {/* Ledger Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--accent-signal)]">
            // STUDIO INTELLIGENCE · ARCHIVAL TELEMETRY
          </span>
          <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
            Archival Analytics
          </h1>
        </div>
        <div className="font-mono text-xs text-[var(--ink-muted)]">
          CYCLE 2026 // LIVE DISPATCH TELEMETRY
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="surface-card p-5 border border-[var(--border-subtle)]">
          <div className="font-display text-2xl font-bold text-[var(--ink-primary)]">{formatPrice(totalRevenue, currency)}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">Total Revenue</div>
        </div>
        <div className="surface-card p-5 border border-[var(--border-subtle)]">
          <div className="font-display text-2xl font-bold text-[var(--ink-primary)]">{totalUnits}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">Units Dispatched</div>
        </div>
        <div className="surface-card p-5 border border-[var(--border-subtle)]">
          <div className="font-display text-2xl font-bold text-[var(--ink-primary)]">{allOrders.length}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">Archival Orders</div>
        </div>
        <div className="surface-card p-5 border border-[var(--border-subtle)]">
          <div className="font-display text-2xl font-bold text-[var(--ink-primary)]">{products.length}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">Pattern Blocks</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="surface-card p-6 border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-bold text-[var(--ink-primary)]">Dispatches by Status</h2>
            <span className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">Order Distribution</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={statusColors[entry.name]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-glass-heavy)", border: "1px solid var(--border-subtle)", borderRadius: "12px", fontSize: 12, color: "var(--ink-primary)" }} labelStyle={{ color: "var(--ink-primary)" }} />
                <Legend wrapperStyle={{ fontSize: 11, color: "var(--ink-secondary)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-6 border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-bold text-[var(--ink-primary)]">Valuation by Category</h2>
            <span className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">Revenue Split</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={colors.line} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={{ stroke: colors.line }} tickLine={false} />
                <YAxis stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => formatPrice(v, currency)} />
                <Tooltip formatter={(v) => formatPrice(Number(v), currency)} contentStyle={{ background: "var(--bg-glass-heavy)", border: "1px solid var(--border-subtle)", borderRadius: "12px", fontSize: 12, color: "var(--ink-primary)" }} labelStyle={{ color: "var(--ink-primary)" }} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={entry.name} fill={CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="surface-card p-6 border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-[var(--ink-primary)]">Top Garments by Revenue Allocation</h2>
          <span className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">Volume Ranking</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={colors.line} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatPrice(v, currency)} />
              <YAxis type="category" dataKey="name" stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
              <Tooltip formatter={(v) => formatPrice(Number(v), currency)} contentStyle={{ background: "var(--bg-glass-heavy)", border: "1px solid var(--border-subtle)", borderRadius: "12px", fontSize: 12, color: "var(--ink-primary)" }} labelStyle={{ color: "var(--ink-primary)" }} />
              <Bar dataKey="revenue" fill={colors.indigoGlow} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
