import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { LayoutGrid, Rows3 } from "lucide-react";
import { CATEGORIES, type Category } from "../data/products";
import { useProductsStore } from "../store/productsStore";
import ProductCard from "../components/ProductCard";
import { formatPrice } from "../lib/format";
import { useCartStore } from "../store/cartStore";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const currency = useCartStore((s) => s.currency);
  const products = useProductsStore((s) => s.products);
  const catParam = params.get("cat") as Category | null;
  const filter: Category | "All" = catParam && CATEGORIES.includes(catParam) ? catParam : "All";

  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [priceMax, setPriceMax] = useState(80000);
  const [gridCols, setGridCols] = useState<2 | 4>(4);

  const setFilter = (cat: Category | "All") => {
    if (cat === "All") {
      params.delete("cat");
    } else {
      params.set("cat", cat);
    }
    setParams(params, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = filter === "All" ? products : products.filter((p) => p.category === filter);
    list = list.filter((p) => p.price <= priceMax);
    list = [...list];
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, filter, sortBy, priceMax]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pb-1.5">
      <div className="mx-auto flex max-w-[1800px] flex-col justify-between gap-6 border-b border-line px-5 py-16 md:flex-row md:items-end md:px-10">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Permanent Collection</span>
          <h1 className="font-display text-5xl font-black uppercase text-ink md:text-7xl">The Catalog</h1>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-ink-dim">
          Filter by category or price. Every garment and object ships with full supply-chain traceability.
        </p>
      </div>

      <div className="border-b border-line bg-void">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-5 px-5 py-5 md:px-10">
          <div className="flex items-center gap-3 overflow-x-auto text-xs font-semibold uppercase tracking-widest no-scrollbar md:gap-6">
            {(["All", ...CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-shrink-0 pb-1 transition-colors ${filter === cat ? "border-b-2 border-indigo-glow text-ink" : "text-ink-dim hover:text-ink"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 md:gap-7">
            <div className="hidden items-center gap-3 text-[11px] text-ink-dim lg:flex">
              <span>Up to</span>
              <input type="range" min={10000} max={80000} step={1000} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-28" />
              <span className="w-14 font-mono text-ink">{formatPrice(priceMax, currency)}</span>
            </div>
            <label className="flex items-center gap-2 text-[11px] text-ink">
              <span className="hidden uppercase tracking-widest text-ink-dim sm:inline">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="border border-line bg-void px-2 py-1.5 text-xs focus:outline-none focus:border-indigo-glow"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </label>
            <span className="hidden font-mono text-xs text-ink-dim sm:inline">{filtered.length} Artifacts</span>
            <div className="hidden items-center gap-3 border-l border-line pl-6 md:flex">
              <button onClick={() => setGridCols(2)} aria-label="Two columns" className={gridCols === 2 ? "text-ink" : "text-ink-dim/50"}>
                <Rows3 size={18} />
              </button>
              <button onClick={() => setGridCols(4)} aria-label="Four columns" className={gridCols === 4 ? "text-ink" : "text-ink-dim/50"}>
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-5 py-16 md:px-10">
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="mb-4 font-display text-3xl text-ink-dim">No pieces match those filters.</p>
            <button
              onClick={() => {
                setFilter("All");
                setPriceMax(80000);
              }}
              className="text-xs uppercase tracking-widest text-indigo-glow hover:text-ink"
            >
              Clear filters
            </button>
          </div>
        )}
        <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"}`}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} aspect={gridCols === 2 ? "aspect-[16/10]" : "aspect-[3/4]"} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
