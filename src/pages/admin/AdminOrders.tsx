import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuthStore, computeAllOrders, type OrderStatus } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";

const STATUSES: Array<OrderStatus | "All"> = ["All", "Processing", "Shipped", "Delivered"];

export const AdminOrders: React.FC = () => {
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
    <div className="space-y-8">
      <div className="pb-6 border-b border-black/5 dark:border-white/10">
        <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Client Fulfillment
        </span>
        <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
          Order Log
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID or client credentials..."
            className="glass-input pl-10 pr-4 py-2.5 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                status === s
                  ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 font-semibold border border-purple-500/20 shadow-xs"
                  : "glass-pill text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-left text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">
                <th className="px-5 py-3.5 font-medium">Waybill #</th>
                <th className="px-5 py-3.5 font-medium">Client</th>
                <th className="px-5 py-3.5 font-medium">Dispatch Date</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 text-right font-medium">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10 text-xs">
              {filtered.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/orders/${o.customerId}/${o.id}`} className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-[var(--ink-primary)]">{o.customerName}</td>
                  <td className="px-5 py-3.5 font-mono text-[var(--ink-muted)]">{new Date(o.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-5 py-3.5 text-right font-mono font-medium text-[var(--ink-primary)]">{formatPrice(o.total, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-[var(--ink-muted)]">No client orders match criteria.</p>}
      </div>
    </div>
  );
};

export default AdminOrders;
