import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useProductsStore } from "../../store/productsStore";
import ProductCard from "../../components/ProductCard";

export const AccountWishlist: React.FC = () => {
  const wishlist = useCartStore((s) => s.wishlist);
  const items = useProductsStore((s) => s.products).filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <span className="mb-2 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
        Curated Selection
      </span>
      <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">
        Saved Pieces
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 glass-card rounded-[28px] p-12 text-center">
          <p className="mb-4 text-sm text-[var(--ink-secondary)]">No garments currently preserved in your wishlist.</p>
          <Link to="/shop" className="btn-prism inline-flex px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider">
            Explore Collection &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountWishlist;
