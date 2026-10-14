import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuthStore, computeAllCustomers } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";

export const AdminCustomers: React.FC = () => {
  const accounts = useAuthStore((s) => s.accounts);
  const customers = useMemo(() => computeAllCustomers(accounts), [accounts]);
  const currency = useCartStore((s) => s.currency);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.trim().toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [customers, query]);

  const sorted = [...filtered].sort((a, b) => {
    const spendA = a.orders.reduce((s, o) => s + o.total, 0);
    const spendB = b.orders.reduce((s, o) => s + o.total, 0);
    return spendB - spendA;
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-black/5 dark:border-white/10">
        <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Client Directory
        </span>
        <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
          Client Register
        </h1>
      </div>

      <div className="relative max-w-md">
        <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by client name or email..."
          className="glass-input pl-10 pr-4 py-2.5 text-xs"
        />
      </div>

      <div className="glass-card rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-left text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">
                <th className="px-5 py-3.5 font-medium">Client</th>
                <th className="px-5 py-3.5 font-medium">Registered</th>
                <th className="px-5 py-3.5 text-right font-medium">Orders</th>
                <th className="px-5 py-3.5 text-right font-medium">Cumulative Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10 text-xs">
              {sorted.map((c) => {
                const spend = c.orders.reduce((s, o) => s + o.total, 0);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
                    <td className="px-5 py-3.5">
                      <Link to={`/admin/customers/${c.id}`} className="block group">
                        <span className="font-semibold text-[var(--ink-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {c.name}
                        </span>
                        <span className="block text-xs font-mono text-[var(--ink-muted)]">{c.email}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[var(--ink-muted)]">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-[var(--ink-primary)]">{c.orders.length}</td>
                    <td className="px-5 py-3.5 text-right font-mono font-medium text-[var(--ink-primary)]">{formatPrice(spend, currency)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && <p className="p-8 text-center text-sm text-[var(--ink-muted)]">No registered clients found.</p>}
      </div>
    </div>
  );
};

export default AdminCustomers;
