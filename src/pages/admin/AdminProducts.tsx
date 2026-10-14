import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useProductsStore } from "../../store/productsStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { CATEGORIES, type Category } from "../../data/products";
import { formatPrice } from "../../lib/format";

export const AdminProducts: React.FC = () => {
  const products = useProductsStore((s) => s.products);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);
  const currency = useCartStore((s) => s.currency);
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    let list = category === "All" ? products : products.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.material.toLowerCase().includes(q));
    }
    return list;
  }, [products, category, query]);

  const remove = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This removes it from the storefront immediately.`)) return;
    deleteProduct(id);
    showToast(`${name} deleted`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Archive Inventory
          </span>
          <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
            Garment Catalogue
          </h1>
        </div>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="btn-prism flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider"
        >
          <Plus size={14} /> Add Garment
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter catalogue by title or textile..."
            className="glass-input pl-10 pr-4 py-2.5 text-xs"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                category === c
                  ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 font-semibold border border-purple-500/20 shadow-xs"
                  : "glass-pill text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-left text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)]">
                <th className="px-5 py-3.5 font-medium">Garment</th>
                <th className="px-5 py-3.5 font-medium">Category</th>
                <th className="px-5 py-3.5 text-right font-medium">Price</th>
                <th className="px-5 py-3.5 text-right font-medium">Stock</th>
                <th className="px-5 py-3.5 text-right font-medium">Rating</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10 text-xs">
              {filtered.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="h-12 w-10 flex-shrink-0 rounded-xl object-cover shadow-xs" />
                      <span className="font-medium text-[var(--ink-primary)]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[var(--ink-secondary)]">{p.category}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-medium text-[var(--ink-primary)]">{formatPrice(p.price, currency)}</td>
                  <td className="px-5 py-3.5 text-right font-mono">
                    <span className={p.stock <= 4 ? "text-rose-500 font-semibold" : "text-[var(--ink-primary)]"}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-[var(--ink-muted)]">{p.rating.toFixed(1)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`} className="text-[var(--ink-muted)] hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => remove(p.id, p.name)} aria-label={`Delete ${p.name}`} className="text-[var(--ink-muted)] hover:text-rose-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-[var(--ink-muted)]">No garments match current criteria.</p>}
      </div>
    </div>
  );
};

export default AdminProducts;
