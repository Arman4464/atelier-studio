import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useProductsStore } from "../store/productsStore";
import { useCartStore } from "../store/cartStore";
import { useSettingsStore } from "../store/settingsStore";
import { useUIStore } from "../store/uiStore";
import { formatPrice } from "../lib/format";
import Rating from "../components/Rating";

const PALETTE = [
  { name: "Void Black", cls: "bg-onpaper" },
  { name: "Stone Grey", cls: "bg-[#8A8A85]" },
  { name: "Forest", cls: "bg-[#3F4B3C]" },
];

export default function ProductDetail() {
  const { id } = useParams();
  const products = useProductsStore((s) => s.products);
  const product = products.find((p) => p.id === Number(id));

  const currency = useCartStore((s) => s.currency);
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold);
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isWishlisted = useCartStore((s) => s.isWishlisted(product?.id ?? -1));
  const setSizeGuideOpen = useUIStore((s) => s.setSizeGuideOpen);
  const showToast = useUIStore((s) => s.showToast);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [size, setSize] = useState("S");
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [accordion, setAccordion] = useState<number | null>(null);

  useEffect(() => {
    setGalleryIndex(0);
    setSize("S");
    setColor(0);
    setQty(1);
    setAccordion(null);
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!product) {
    return (
      <div className="py-32 text-center">
        <p className="mb-6 font-display text-3xl text-ink-dim">That piece isn't available.</p>
        <Link to="/shop" className="text-xs uppercase tracking-widest text-indigo-glow hover:text-ink">Back to Catalog</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pb-24 md:pb-0">
      <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[1800px] items-center gap-2 border-b border-line px-5 py-5 text-[11px] uppercase tracking-widest text-ink-dim md:px-10">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-ink">Catalog</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="border-line bg-void-2 lg:sticky lg:top-[110px] lg:col-span-7 lg:h-[calc(100vh-110px)] lg:self-start lg:border-r">
          <div className="flex h-full flex-col">
            <div className="relative min-h-[420px] flex-1 overflow-hidden">
              <img src={product.images[galleryIndex]} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  showToast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
                }}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-scrim/80 backdrop-blur-md hover:bg-scrim"
              >
                <Heart size={18} className={isWishlisted ? "fill-flame text-flame" : "text-on-scrim"} />
              </button>
              <button
                onClick={() => setGalleryIndex((galleryIndex - 1 + product.images.length) % product.images.length)}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-scrim/70 backdrop-blur-md hover:bg-scrim"
              >
                <ChevronLeft size={16} className="text-on-scrim" />
              </button>
              <button
                onClick={() => setGalleryIndex((galleryIndex + 1) % product.images.length)}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-scrim/70 backdrop-blur-md hover:bg-scrim"
              >
                <ChevronRight size={16} className="text-on-scrim" />
              </button>
            </div>
            <div className="flex justify-center gap-2 p-4">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setGalleryIndex(i)} className={`h-20 w-16 overflow-hidden border-2 transition-colors ${galleryIndex === i ? "border-indigo-glow" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={img} className="h-full w-full object-cover" alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-void px-6 py-10 md:px-14 md:py-16 lg:col-span-5">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">{product.category}</span>
            <span className="font-mono text-xs text-ink-dim">SKU: ATL-2026-00{product.id}</span>
          </div>

          <h1 className="font-display text-4xl font-black uppercase leading-tight text-ink md:text-5xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating} />
            <a href="#reviews" className="text-xs text-ink-dim hover:text-ink">{product.reviewCount} reviews</a>
          </div>

          <p className="mt-4 font-mono text-2xl font-light text-ink">{formatPrice(product.price, currency)}</p>

          {product.stock <= 4 && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-flame">Only {product.stock} left in this run</p>
          )}

          <div className="my-8 h-px w-full bg-line" />

          <p className="text-sm leading-relaxed text-ink-dim">{product.description}</p>

          <div className="mt-10">
            <label className="mb-4 block text-[10px] font-semibold uppercase tracking-widest text-ink">Select Palette</label>
            <div className="flex gap-4">
              {PALETTE.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setColor(i)}
                  aria-label={c.name}
                  className={`h-7 w-7 rounded-full ${c.cls} ${color === i ? "ring-2 ring-indigo-glow ring-offset-2 ring-offset-void" : ""}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-ink">Select Size</label>
              <button onClick={() => setSizeGuideOpen(true)} className="text-xs text-ink-dim hover:text-ink">Sizing Chart</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {["XS", "S", "M", "L"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`border py-3 font-mono text-xs uppercase transition-colors ${size === s ? "border-indigo-glow bg-indigo-glow text-void" : "border-line text-ink hover:border-ink"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-4 block text-[10px] font-semibold uppercase tracking-widest text-ink">Quantity</label>
            <div className="flex w-fit items-center border border-line font-mono text-sm">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 hover:bg-void-3" aria-label="Decrease quantity"><Minus size={13} /></button>
              <span className="px-5">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-2.5 hover:bg-void-3" aria-label="Increase quantity"><Plus size={13} /></button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            <div className="border border-line p-3">
              <span className="mb-1 block text-[9px] uppercase tracking-widest text-ink-dim">Material</span>
              <span className="block text-xs font-medium text-ink">{product.origin.material}</span>
            </div>
            <div className="border border-line p-3">
              <span className="mb-1 block text-[9px] uppercase tracking-widest text-ink-dim">Maker</span>
              <span className="block text-xs font-medium text-ink">{product.origin.maker}</span>
            </div>
            <div className="border border-line p-3">
              <span className="mb-1 block text-[9px] uppercase tracking-widest text-ink-dim">Arrives</span>
              <span className="block text-xs font-medium text-ink">{product.origin.arrival}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-line">
            {[
              { title: "Material & Care", body: product.care },
              { title: "Shipping & Returns", body: `Complimentary carbon-neutral express delivery on all orders over ${formatPrice(freeShippingThreshold, currency)}. Returns accepted within 14 days, unworn and with tags attached.` },
              { title: "Sustainability", body: product.sustainability },
            ].map((section, i) => (
              <div key={section.title} className="border-b border-line">
                <button onClick={() => setAccordion(accordion === i ? null : i)} className="flex w-full items-center justify-between py-5 text-xs font-semibold uppercase tracking-widest text-ink">
                  <span>{section.title}</span>
                  <span className="font-mono text-base text-indigo-glow">{accordion === i ? "\u2212" : "+"}</span>
                </button>
                {accordion === i && <div className="pb-6 text-xs leading-relaxed text-ink-dim">{section.body}</div>}
              </div>
            ))}
          </div>

          <div className="mt-10 hidden pt-2 md:block">
            <button
              onClick={() => {
                addToCart(product, qty);
                useUIStore.getState().setCartOpen(true);
                showToast(`${product.name} added to your bag`);
              }}
              className="w-full bg-ink py-5 text-xs font-semibold uppercase tracking-[0.2em] text-void transition-colors hover:bg-indigo-glow"
            >
              Add To Bag — {formatPrice(product.price * qty, currency)}
            </button>
            <p className="mt-4 text-center text-[11px] text-ink-dim">Free returns within 14 days · Secure checkout</p>
          </div>
        </div>
      </div>

      <div id="reviews" className="border-t border-line bg-void-2 py-20">
        <div className="mx-auto max-w-[1000px] px-6 md:px-10">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="font-display text-3xl font-black uppercase text-ink md:text-5xl">Reviews</h2>
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl font-black text-ink">{product.rating.toFixed(1)}</span>
              <div>
                <Rating value={product.rating} />
                <span className="text-xs text-ink-dim">Based on {product.reviewCount} reviews</span>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {product.reviews.map((review, i) => (
              <div key={i} className="border-b border-line pb-8 last:border-0">
                <div className="mb-2 flex items-center justify-between">
                  <Rating value={review.rating} />
                  <span className="text-[11px] text-ink-dim">{review.date}</span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-ink">{review.text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink">{review.author}</span>
                  {review.verified && (
                    <span className="border border-indigo-glow/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-indigo-glow">
                      Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line py-20">
        <div className="mx-auto max-w-[1800px] px-6 md:px-10">
          <h2 className="mb-12 font-display text-3xl font-black uppercase text-ink md:text-5xl">Complete The Look</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {related.map((p) => (
              <ProductLite key={p.id} id={p.id} name={p.name} image={p.images[0]} price={p.price} />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-void-2 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] md:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-ink">{product.name}</p>
          <p className="font-mono text-sm text-ink">{formatPrice(product.price * qty, currency)}</p>
        </div>
        <button
          onClick={() => {
            addToCart(product, qty);
            showToast(`${product.name} added to your bag`);
          }}
          className="flex-shrink-0 bg-indigo-glow px-6 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-void"
        >
          Add to Bag
        </button>
      </div>
    </motion.div>
  );
}

function ProductLite({ id, name, image, price }: { id: number; name: string; image: string; price: number }) {
  const currency = useCartStore((s) => s.currency);
  const navigate = useNavigate();
  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/product/${id}`)}>
      <div className="mb-4 aspect-[3/4] overflow-hidden border border-line bg-void-3">
        <img src={image} alt={name} className="h-full w-full object-cover saturate-[0.85] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:saturate-100" />
      </div>
      <h3 className="font-display text-lg text-ink transition-colors group-hover:text-indigo-glow">{name}</h3>
      <span className="font-mono text-xs text-ink-dim">{formatPrice(price, currency)}</span>
    </div>
  );
}
