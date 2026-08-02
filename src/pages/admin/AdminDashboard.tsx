import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DollarSign, Package, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { useAuthStore, computeAllOrders, computeAllCustomers } from "../../store/authStore";
import { useProductsStore } from "../../store/productsStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import { useChartColors } from "../../lib/chartColors";
import StatCard from "../../components/admin/StatCard";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

function monthLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short" });
}

export default function AdminDashboard() {
  const accounts = useAuthStore((s) => s.accounts);
  const allOrders = useMemo(() => computeAllOrders(accounts), [accounts]);
  const allCustomers = useMemo(() => computeAllCustomers(accounts), [accounts]);
  const products = useProductsStore((s) => s.products);
  const currency = useCartStore((s) => s.currency);
  const colors = useChartColors();

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = allOrders.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const lowStock = products.filter((p) => p.stock <= 4);

  // Revenue for the trailing 6 months (bucketed by month)
  const now = new Date();
  const months: { key: string; label: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: monthLabel(d), revenue: 0 });
  }
  allOrders.forEach((o) => {
    const d = new Date(o.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.revenue += o.total;
  });

  // Top products by units sold
  const unitsByProduct = new Map<number, { name: string; units: number; revenue: number }>();
  allOrders.forEach((o) => {
    o.items.forEach((item) => {
      const entry = unitsByProduct.get(item.productId) ?? { name: item.name, units: 0, revenue: 0 };
      entry.units += item.qty;
      entry.revenue += item.price * item.qty;
      unitsByProduct.set(item.productId, entry);
    });
  });
  const topProducts = [...unitsByProduct.values()].sort((a, b) => b.units - a.units).slice(0, 5);

  const recentOrders = allOrders.slice(0, 6);

  return (
    <div>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Admin</span>
      <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue, currency)} icon={DollarSign} />
        <StatCard label="Total Orders" value={String(totalOrders)} icon={Package} />
        <StatCard label="Customers" value={String(allCustomers.length)} icon={Users} />
        <StatCard label="Avg. Order Value" value={formatPrice(avgOrderValue, currency)} icon={TrendingUp} />
      </div>

      {lowStock.length > 0 && (
        <Link
          to="/admin/products"
          className="mt-4 flex items-center gap-3 border border-flame/30 bg-flame/10 px-5 py-4 text-xs text-flame transition-colors hover:bg-flame/15"
        >
          <AlertTriangle size={16} className="flex-shrink-0" />
          {lowStock.length} product{lowStock.length > 1 ? "s" : ""} running low on stock — review inventory.
        </Link>
      )}

      <div className="mt-10 border border-line bg-void-2 p-6">
        <h2 className="mb-6 font-display text-lg font-bold text-ink">Revenue — Last 6 Months</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={months} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.indigoGlow} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.indigoGlow} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={colors.line} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={{ stroke: colors.line }} tickLine={false} />
              <YAxis stroke={colors.inkDim} tick={{ fill: colors.inkDim, fontSize: 11 }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => formatPrice(v, currency)} />
              <Tooltip
                formatter={(value) => formatPrice(Number(value), currency)}
                contentStyle={{ background: colors.voidTwo, border: `1px solid ${colors.line}`, borderRadius: 0, fontSize: 12 }}
                labelStyle={{ color: colors.ink }}
              />
              <Area type="monotone" dataKey="revenue" stroke={colors.indigoGlow} strokeWidth={2} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold uppercase tracking-widest text-ink-dim hover:text-ink">View All</Link>
          </div>
          <div className="divide-y divide-line border border-line">
            {recentOrders.length === 0 && <p className="p-6 text-sm text-ink-dim">No orders yet.</p>}
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/admin/orders/${order.customerId}/${order.id}`} className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-void-2">
                <div className="min-w-[120px] flex-1">
                  <p className="font-mono text-xs text-ink">{order.id}</p>
                  <p className="text-[11px] text-ink-dim">{order.customerName}</p>
                </div>
                <OrderStatusBadge status={order.status} />
                <span className="ml-auto font-mono text-sm text-ink">{formatPrice(order.total, currency)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">Top Products</h2>
          <div className="divide-y divide-line border border-line">
            {topProducts.length === 0 && <p className="p-6 text-sm text-ink-dim">No sales data yet.</p>}
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4 p-4">
                <span className="font-mono text-xs text-ink-dim">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{p.name}</p>
                  <p className="text-[11px] text-ink-dim">{p.units} sold</p>
                </div>
                <span className="font-mono text-xs text-ink">{formatPrice(p.revenue, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
