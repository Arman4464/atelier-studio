import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useProductsStore } from "../../store/productsStore";
import ProductCard from "../ProductCard";
import { formatPrice } from "../../lib/format";
import { useCartStore } from "../../store/cartStore";

export default function KeyPieces() {
  const currency = useCartStore((s) => s.currency);
  const products = useProductsStore((s) => s.products);
  const [featured, ...rest] = products;
  const grid = rest.slice(0, 4);

  if (!featured) return null;

  return (
    <section className="mx-auto max-w-[1800px] px-1.5 py-1.5">
      <div className="mb-8 flex items-end justify-between px-4 pt-10 md:px-6">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Curated Selection</span>
          <h2 className="font-display text-4xl font-black uppercase text-ink md:text-6xl">Key Pieces</h2>
        </div>
        <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-dim hover:text-ink sm:flex">
          View All ({products.length}) <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-12">
        <Link
          to={`/product/${featured.id}`}
          className="group relative min-h-[420px] overflow-hidden border border-line bg-void-3 md:col-span-5"
        >
          <img
            src={featured.images[0]}
            alt={featured.name}
            className="absolute inset-0 h-full w-full object-cover saturate-[0.85] transition-all duration-1000 ease-out group-hover:scale-105 group-hover:saturate-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/10 to-transparent" />
          <span className="absolute left-5 top-5 border border-on-scrim/20 bg-scrim/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-on-scrim backdrop-blur-md">
            {featured.category}
          </span>
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-on-scrim">
            <h3 className="font-display text-3xl font-bold leading-tight">{featured.name}</h3>
            <span className="flex-shrink-0 font-mono text-sm">{formatPrice(featured.price, currency)}</span>
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-1.5 md:col-span-7">
          {grid.map((p) => (
            <div key={p.id} className="border border-line p-3">
              <ProductCard product={p} aspect="aspect-square" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
