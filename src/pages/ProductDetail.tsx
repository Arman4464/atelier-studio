import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductsStore } from '../store/productsStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();

  const productsStore = useProductsStore() as any;
  const cartStore = useCartStore() as any;
  const uiStore = useUIStore() as any;

  const products: any[] = productsStore.products || [];
  const targetKey = slug || id;

  const product = useMemo(() => {
    return (
      products.find(
        (p) => String(p.slug) === String(targetKey) || String(p.id) === String(targetKey)
      ) || products[0]
    );
  }, [products, targetKey]);

  const images: string[] = useMemo(() => {
    if (product?.images?.length) return product.images;
    if (product?.image) return [product.image];
    return [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
    ];
  }, [product]);

  const sizes: string[] = product?.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const colors: any[] = product?.colors || [
    { name: 'Obsidian', hex: '#141416' },
    { name: 'Warm Alabaster', hex: '#EAE6DF' },
  ];

  const [selectedSize, setSelectedSize] = useState<string>(sizes[1] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(
    typeof colors[0] === 'string' ? colors[0] : colors[0]?.name || 'Obsidian'
  );
  const [openTab, setOpenTab] = useState<string>('DETAILS');

  if (!product) return null;

  const title = product.name || product.title || 'Sculpted Silhouette';
  const rawPrice = Number(product.price) || 480;
  const priceNum = rawPrice > 1000 ? Math.round(rawPrice * 0.0104) : rawPrice;

  const handleAdd = () => {
    if (cartStore.addItem) {
      cartStore.addItem({
        ...product,
        id: product.id,
        selectedSize,
        size: selectedSize,
        selectedColor,
        color: selectedColor,
        quantity: 1,
      });
    } else if (cartStore.addToCart) {
      cartStore.addToCart(product, 1, selectedSize, selectedColor);
    }
    if (uiStore.openCart) uiStore.openCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(true);
  };

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="min-h-screen pt-24 pb-32 px-4 sm:px-8 max-w-[1440px] mx-auto">
      {/* Subtle Floating Back Pill */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-full glass-pill text-xs font-medium hover:scale-105 transition-transform"
        >
          ← Back to Collection
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left 7 Columns: Vertical Sculptural Image Stack */}
        <div className="lg:col-span-7 space-y-5">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="rounded-[28px] overflow-hidden bg-[var(--bg-sub)] aspect-[4/5]"
            >
              <img
                src={imgUrl}
                alt={`${title} view ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right 5 Columns: Sticky Floating Glass Purchase Island */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="glass-island rounded-[32px] p-7 sm:p-10 space-y-7">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                {product.category || 'Ready to Wear'}
              </span>
              <div className="flex items-baseline justify-between gap-4 mt-2">
                <h1 className="font-editorial italic text-4xl sm:text-5xl font-normal leading-tight">
                  {title}
                </h1>
                <span className="text-xl font-semibold">${priceNum.toFixed(2)}</span>
              </div>
              <p className="mt-4 text-sm text-[var(--ink-secondary)] leading-relaxed">
                {product.description ||
                  'Tailored from fluid, heavy-drape natural fibers with hand-finished interior seams and a relaxed architectural silhouette.'}
              </p>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex justify-between text-xs mb-2.5">
                <span className="text-[var(--ink-muted)]">Color</span>
                <span className="font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c, i) => {
                  const name = typeof c === 'string' ? c : c.name || `Shade ${i + 1}`;
                  const hex = typeof c === 'object' && c.hex ? c.hex : '#18181B';
                  const active = selectedColor === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedColor(name)}
                      className={`px-3.5 py-2 rounded-full text-xs flex items-center gap-2 transition-all ${
                        active
                          ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-medium shadow-sm'
                          : 'bg-[var(--bg-sub)] text-[var(--ink-secondary)]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: hex }}
                      />
                      <span>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rounded Pill Size Selector */}
            <div>
              <div className="flex justify-between text-xs mb-2.5">
                <span className="text-[var(--ink-muted)]">Select Size</span>
                <button
                  onClick={() => uiStore.openSizeGuide?.() || uiStore.setSizeGuideOpen?.(true)}
                  className="underline text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((sz) => {
                  const active = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 rounded-2xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] shadow-md scale-[1.02]'
                          : 'bg-[var(--bg-sub)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Add to Bag Capsule */}
            <button
              onClick={handleAdd}
              className="w-full py-4 rounded-full bg-[var(--ink-primary)] text-[var(--bg-canvas)] text-xs font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition-all shadow-lg"
            >
              Add to Bag — ${priceNum.toFixed(2)}
            </button>

            {/* Clean Pill Tabs for Craft & Care */}
            <div className="pt-4 border-t border-[var(--glass-border)]">
              <div className="flex gap-2 mb-3">
                {['DETAILS', 'FIT', 'CARE'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOpenTab(tab)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                      openTab === tab
                        ? 'bg-[var(--bg-sub)] text-[var(--ink-primary)]'
                        : 'text-[var(--ink-muted)]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                {openTab === 'DETAILS' &&
                  'Woven in Italy from 100% organic long-staple fibers. Features horn buttons, French interior seams, and custom tonal lining.'}
                {openTab === 'FIT' &&
                  'Designed for a relaxed, fluid drape. Take your normal size for the intended silhouette, or size down for a closer shoulder fit.'}
                {openTab === 'CARE' &&
                  'Specialist dry clean or cold gentle hand wash. Lay flat on a towel to dry in natural shade.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Pairings */}
      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="font-editorial italic text-3xl sm:text-5xl mb-10">
            Complete the Silhouette
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map((item, idx) => (
              <ProductCard key={item.id || idx} product={item} index={idx} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetail;
