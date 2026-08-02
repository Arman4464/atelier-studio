import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuthStore, computeAllOrders, type OrderStatus } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

const STATUSES: Array<OrderStatus | "All"> = ["All", "Processing", "Shipped", "Delivered"];

export default function AdminOrders() {
  const accounts = useAuthStore((s) => s.accounts);
  const allOrders = useMemo(() => computeAllOrders(accounts), [accounts]);
  const currency = useCartStore((s) => s.currency);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "All">("All");

  const filtered = useMemo(() => {
    let list = allOrders;
    if (status !== "All") list = list.filter((o) => o.status === status);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q));
    }
    return list;
  }, [allOrders, status, query]);

  return (
    <div>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Admin</span>
      <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">Orders</h1>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID or customer..."
            className="w-full border border-line bg-void-2 py-2.5 pl-9 pr-3 text-xs text-ink focus:outline-none focus:border-indigo-glow"
          />
        </div>
        <div className="flex items-center gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`border px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                status === s ? "border-indigo-glow bg-indigo-glow/10 text-ink" : "border-line text-ink-dim hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-line">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line bg-void-2 text-left text-[10px] uppercase tracking-widest text-ink-dim">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-void-2">
                <td className="px-4 py-3">
                  <Link to={`/admin/orders/${o.customerId}/${o.id}`} className="font-mono text-xs text-indigo-glow hover:underline">
                    {o.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink">{o.customerName}</td>
                <td className="px-4 py-3 text-ink-dim">{new Date(o.date).toLocaleDateString()}</td>
                <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-right font-mono text-ink">{formatPrice(o.total, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-ink-dim">No orders match those filters.</p>}
      </div>
    </div>
  );
}
