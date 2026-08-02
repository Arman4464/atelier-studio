import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useProductsStore } from "../../store/productsStore";
import ProductCard from "../../components/ProductCard";

export default function AccountWishlist() {
  const wishlist = useCartStore((s) => s.wishlist);
  const items = useProductsStore((s) => s.products).filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Account</span>
      <h1 className="font-display text-4xl font-black uppercase text-ink md:text-5xl">Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 border border-line p-10 text-center">
          <p className="mb-4 text-sm text-ink-dim">Nothing saved yet.</p>
          <Link to="/shop" className="text-xs font-semibold uppercase tracking-widest text-indigo-glow hover:text-ink">
            Browse Collection &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
