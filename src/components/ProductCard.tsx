import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import type { Product } from "../data/products";
import { useCartStore } from "../store/cartStore";
import { useUIStore } from "../store/uiStore";
import { formatPrice } from "../lib/format";
import Rating from "./Rating";
import { cn } from "../lib/cn";

interface ProductCardProps {
  product: Product;
  tone?: "dark" | "light";
  aspect?: string;
}

export default function ProductCard({ product, tone = "dark", aspect = "aspect-[3/4]" }: ProductCardProps) {
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isWishlisted = useCartStore((s) => s.isWishlisted(product.id));
  const addToCart = useCartStore((s) => s.addToCart);
  const currency = useCartStore((s) => s.currency);
  const setQuickViewProduct = useUIStore((s) => s.setQuickViewProduct);
  const showToast = useUIStore((s) => s.showToast);
  const wished = isWishlisted;
  const dark = tone === "dark";

  return (
    <div className="group flex flex-col">
      <div className={cn("relative overflow-hidden mb-4 border", aspect, dark ? "bg-void-3 border-line-soft" : "bg-paper-dim border-onpaper/10")}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out saturate-[0.88] contrast-[0.97] group-hover:saturate-100 group-hover:contrast-100 group-hover:scale-[1.04]"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span className="border border-on-scrim/20 bg-scrim/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-on-scrim backdrop-blur-md">
            {product.category}
          </span>
          {product.tags.includes("New") && (
            <span className="bg-indigo px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-on-indigo">New</span>
          )}
          {product.tags.includes("Bestseller") && (
            <span className="bg-zest px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-on-zest">Bestseller</span>
          )}
          {product.stock <= 4 && (
            <span className="bg-flame px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-on-flame">
              Only {product.stock} left
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
            showToast(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-scrim/80 backdrop-blur-md transition-colors hover:bg-scrim"
        >
          <Heart size={15} className={wished ? "fill-flame text-flame" : "text-on-scrim"} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              useUIStore.getState().setCartOpen(true);
              showToast(`${product.name} added to your bag`);
            }}
            className={cn(
              "flex-1 py-3 text-[11px] font-semibold uppercase tracking-widest backdrop-blur-md transition-colors",
              dark ? "bg-ink text-void hover:bg-indigo hover:text-on-indigo" : "bg-onpaper text-paper hover:bg-indigo hover:text-on-indigo"
            )}
          >
            Quick Add — {formatPrice(product.price, currency)}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setQuickViewProduct(product);
            }}
            aria-label="Quick view"
            className="flex w-11 flex-shrink-0 items-center justify-center bg-scrim/85 text-on-scrim backdrop-blur-md transition-colors hover:bg-scrim"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <Link to={`/product/${product.id}`} className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={cn("truncate font-display text-lg font-semibold transition-colors group-hover:text-indigo-glow", dark ? "text-ink" : "text-onpaper")}>
            {product.name}
          </h3>
          <Rating value={product.rating} size={11} className="mt-1" />
        </div>
        <span className={cn("flex-shrink-0 font-mono text-sm", dark ? "text-ink-dim" : "text-onpaper-dim")}>
          {formatPrice(product.price, currency)}
        </span>
      </Link>
    </div>
  );
}
