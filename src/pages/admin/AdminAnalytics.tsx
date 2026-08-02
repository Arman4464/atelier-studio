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
    statusCounts[o.status]++;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const statusColors: Record<string, string> = { Processing: colors.zest, Shipped: colors.indigo, Delivered: colors.indigoGlow };

  // Sales by category
  const revenueByCategory = new Map<string, number>();
  allOrders.forEach((o) => {
    o.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      const cat = product?.category ?? "Other";
      revenueByCategory.set(cat, (revenueByCategory.get(cat) ?? 0) + item.price * item.qty);
    });
  });
  const categoryData = [...revenueByCategory.entries()].map(([name, revenue]) => ({ name, revenue }));

  // Top products by revenue
  const revenueByProduct = new Map<string, number>();
  allOrders.forEach((o) => {
    o.items.forEach((item) => {
      revenueByProduct.set(item.name, (revenueByProduct.get(item.name) ?? 0) + item.price * item.qty);
    });
  });
  const productData = [...revenueByProduct.entries()]
    .map(([name, revenue]) => ({ name: name.length > 18 ? `${name.slice(0, 18)}\u2026` : name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
  const totalUnits = allOrders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.qty, 0), 0);

  return (
    <div>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Admin</span>
      <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">Analytics</h1>

      <div className="mt-8 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
        <div className="border border-line bg-void-2 p-5">
          <div className="font-display text-2xl font-black text-ink">{formatPrice(totalRevenue, currency)}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">Total Revenue</div>
        </div>
        <div className="border border-line bg-void-2 p-5">
          <div className="font-display text-2xl font-black text-ink">{totalUnits}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">Units Sold</div>
        </div>
        <div className="border border-line bg-void-2 p-5">
          <div className="font-display text-2xl font-black text-ink">{allOrders.length}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">Orders</div>
        </div>
        <div className="border border-line bg-void-2 p-5">
          <div className="font-display text-2xl font-black text-ink">{products.length}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-dim">Products Listed</div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border border-line bg-void-2 p-6">
          <h2 className="mb-6 font-display text-lg font-bold text-ink">Orders by Status</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={statusColors[entry.name]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: colors.voidTwo, border: `1px solid ${colors.line}`, borderRadius: 0, fontSize: 12 }} labelStyle={{ color: colors.ink }} />
                <Legend wrapperStyle={{ fontSize: 11, color: colors.inkDim }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-line bg-void-2 p-6">
          <h2 className="mb-6 font-display text-lg font-bold text-ink">Revenue by Category</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={colors.line} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={{ stroke: colors.line }} tickLine={false} />
                <YAxis stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => formatPrice(v, currency)} />
                <Tooltip formatter={(v) => formatPrice(Number(v), currency)} contentStyle={{ background: colors.voidTwo, border: `1px solid ${colors.line}`, borderRadius: 0, fontSize: 12 }} labelStyle={{ color: colors.ink }} />
                <Bar dataKey="revenue" radius={[2, 2, 0, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={entry.name} fill={CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 border border-line bg-void-2 p-6">
        <h2 className="mb-6 font-display text-lg font-bold text-ink">Top Products by Revenue</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={colors.line} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatPrice(v, currency)} />
              <YAxis type="category" dataKey="name" stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
              <Tooltip formatter={(v) => formatPrice(Number(v), currency)} contentStyle={{ background: colors.voidTwo, border: `1px solid ${colors.line}`, borderRadius: 0, fontSize: 12 }} labelStyle={{ color: colors.ink }} />
              <Bar dataKey="revenue" fill={colors.indigoGlow} radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
