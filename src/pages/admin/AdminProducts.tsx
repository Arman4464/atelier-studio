import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useProductsStore } from "../../store/productsStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { CATEGORIES, type Category } from "../../data/products";
import { formatPrice } from "../../lib/format";

export default function AdminProducts() {
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
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Admin</span>
          <h1 className="font-display text-3xl font-black uppercase text-ink md:text-4xl">Products</h1>
        </div>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-line bg-void-2 py-2.5 pl-9 pr-3 text-xs text-ink focus:outline-none focus:border-indigo-glow"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`border px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                category === c ? "border-indigo-glow bg-indigo-glow/10 text-ink" : "border-line text-ink-dim hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-line">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line bg-void-2 text-left text-[10px] uppercase tracking-widest text-ink-dim">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Rating</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-void-2">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="h-12 w-10 flex-shrink-0 object-cover" />
                    <span className="text-ink">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-dim">{p.category}</td>
                <td className="px-4 py-3 text-right font-mono text-ink">{formatPrice(p.price, currency)}</td>
                <td className="px-4 py-3 text-right font-mono">
                  <span className={p.stock <= 4 ? "text-flame" : "text-ink"}>{p.stock}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-dim">{p.rating.toFixed(1)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link to={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`} className="text-ink-dim hover:text-indigo-glow">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => remove(p.id, p.name)} aria-label={`Delete ${p.name}`} className="text-ink-dim hover:text-flame">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-ink-dim">No products match those filters.</p>}
      </div>
    </div>
  );
}
