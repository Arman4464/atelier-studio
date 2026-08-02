import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuthStore, computeAllCustomers } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";

export default function AdminCustomers() {
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
    <div>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Admin</span>
      <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">Customers</h1>

      <div className="relative mt-6 max-w-sm">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers..."
          className="w-full border border-line bg-void-2 py-2.5 pl-9 pr-3 text-xs text-ink focus:outline-none focus:border-indigo-glow"
        />
      </div>

      <div className="mt-6 overflow-x-auto border border-line">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line bg-void-2 text-left text-[10px] uppercase tracking-widest text-ink-dim">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 text-right font-medium">Orders</th>
              <th className="px-4 py-3 text-right font-medium">Lifetime Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((c) => {
              const spend = c.orders.reduce((s, o) => s + o.total, 0);
              return (
                <tr key={c.id} className="transition-colors hover:bg-void-2">
                  <td className="px-4 py-3">
                    <Link to={`/admin/customers/${c.id}`} className="block">
                      <span className="text-ink hover:text-indigo-glow">{c.name}</span>
                      <span className="block text-xs text-ink-dim">{c.email}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-dim">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{c.orders.length}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{formatPrice(spend, currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sorted.length === 0 && <p className="p-8 text-center text-sm text-ink-dim">No customers match that search.</p>}
      </div>
    </div>
  );
}
