import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
        (p) =>
          String(p.slug) === String(targetKey) ||
          String(p.id) === String(targetKey)
      ) || products[0]
    );
  }, [products, targetKey]);

  const images: string[] = useMemo(() => {
    if (product?.images?.length) return product.images;
    if (product?.image) return [product.image];
    return [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    ];
  }, [product]);

  const sizes: string[] = product?.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const colors: any[] = product?.colors || [{ name: 'Raw Carbon', hex: '#181715' }, { name: 'Unbleached Calico', hex: '#DDD6C7' }];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[2] || sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(
    typeof colors[0] === 'string' ? colors[0] : colors[0]?.name || 'Raw Carbon'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [openAccordion, setOpenAccordion] = useState<string>('CONSTRUCTION');
  const [stamped, setStamped] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-10 font-ledger text-xs">
        <p className="mb-4">[ SPECIMEN NOT FOUND IN ARCHIVE ]</p>
        <Link to="/shop" className="px-5 py-3 bg-[var(--ink-primary)] text-[var(--bg-canvas)]">
          RETURN TO CATALOG →
        </Link>
      </div>
    );
  }

  const title = product.name || product.title || 'Archival Garment';
  const priceNum =
    typeof product.price === 'number'
      ? product.price > 1000
        ? Math.round(product.price * 0.0104)
        : product.price
      : Number(product.price) || 420;

  const handleAddToBag = () => {
    if (cartStore.addItem) {
      cartStore.addItem({
        ...product,
        id: product.id,
        selectedSize,
        size: selectedSize,
        selectedColor,
        color: selectedColor,
        quantity,
      });
    } else if (cartStore.addToCart) {
      cartStore.addToCart(product, quantity, selectedSize, selectedColor);
    }

    setStamped(true);
    setTimeout(() => setStamped(false), 1400);
    if (uiStore.openCart) uiStore.openCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(true);
  };

  const openSizeGuide = () => {
    if (uiStore.openSizeGuide) uiStore.openSizeGuide();
    else if (uiStore.setSizeGuideOpen) uiStore.setSizeGuideOpen(true);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const specs = [
    {
      id: 'CONSTRUCTION',
      title: '01 // PATTERN & TEXTILE SPECIFICATION',
      content:
        product.description ||
        'Cut from high-density loomstate textile with unlined interior French seams. Horn buttons are hand-shanked with waxed linen thread to prevent tension pull.',
    },
    {
      id: 'MEASUREMENTS',
      title: '02 // FLAT PATTERN TOLERANCES (CM)',
      content:
        'Relaxed architectural drape. Chest: 58cm (S) / 61cm (M) / 64cm (L). Center-back length: 76cm–112cm depending on silhouette index. Allow ±0.8cm variance due to cold-vat garment dyeing.',
    },
    {
      id: 'PROVENANCE',
      title: '03 // MILL ORIGIN & CARE DOCTRINE',
      content:
        'Woven in Biella, Italy & Okayama, Japan. Cold water immersion only; dry flat on unbleached cotton towel away from direct solar radiation.',
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Top Breadcrumb Specification Bar */}
      <div className="px-6 sm:px-10 py-3 hairline-b flex flex-wrap items-center justify-between font-ledger text-[11px] uppercase text-[var(--ink-secondary)]">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="hover:text-[var(--ink-primary)]">
            ← BACK
          </button>
          <span>/</span>
          <Link to="/shop" className="hover:text-[var(--ink-primary)]">
            ARCHIVE
          </Link>
          <span>/</span>
          <span className="text-[var(--ink-primary)] font-medium">{title}</span>
        </div>
        <div>SPECIMEN REF: AS-{String(product.id || '019').toUpperCase()}</div>
      </div>

      {/* Main Garment Dissection Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 hairline-b">
        {/* Left 7 Columns: Contact Sheet & Specimen Plates */}
        <div className="lg:col-span-7 hairline-r flex flex-col">
          {/* Primary Plate Viewer */}
          <div className="relative aspect-[4/5] bg-[var(--bg-sub)] overflow-hidden hairline-b">
            <img
              src={images[activeImage]}
              alt={`${title} — Plate ${activeImage + 1}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 bg-[var(--bg-canvas)]/90 backdrop-blur-sm px-3 py-1 hairline-box font-ledger text-[11px]">
              PLATE 0{activeImage + 1} OF 0{images.length} // SCALE 1:1
            </div>
          </div>

          {/* Contact Sheet Thumbnail Strip */}
          <div className="grid grid-cols-4 sm:grid-cols-6 bg-[var(--bg-canvas)]">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative aspect-[3/4] overflow-hidden hairline-r p-1.5 transition-all ${
                  activeImage === idx
                    ? 'bg-[var(--ink-primary)]'
                    : 'opacity-65 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-1 bg-[var(--bg-canvas)] font-ledger text-[9px]">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: Sticky Woven Care Tag & Requisition Controls */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between lg:sticky lg:top-[68px] h-fit">
          <div>
            {/* Batch Stamp & Category */}
            <div className="flex items-center justify-between font-ledger text-xs uppercase text-[var(--ink-muted)] pb-4 perforated-b">
              <span>CATEGORY // {product.category || 'OUTERWEAR'}</span>
              <span className="text-[var(--accent-stamp)] font-medium">
                [ IN ARCHIVE STOCK ]
              </span>
            </div>

            {/* Garment Title & Valuation */}
            <div className="mt-6 flex items-baseline justify-between gap-4">
              <h1 className="font-grotesk font-extrabold text-3xl sm:text-4xl uppercase tracking-[-0.03em] leading-[0.98]">
                {title}
              </h1>
              <span className="font-ledger text-2xl font-semibold shrink-0">
                ${priceNum.toFixed(2)}
              </span>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[var(--ink-secondary)] leading-relaxed">
              {product.description ||
                'Architectural silhouette engineered from heavy-gauge natural fibers. Raw selvedge seams and unbleached internal pocketing with numbered batch stamp.'}
            </p>

            {/* Dye Lot (Color) Selector */}
            <div className="mt-8 pt-6 hairline-t">
              <div className="flex items-center justify-between font-ledger text-xs uppercase mb-3">
                <span className="text-[var(--ink-muted)]">DYE LOT SPECIFICATION:</span>
                <span className="font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c, idx) => {
                  const colorName = typeof c === 'string' ? c : c.name || `Lot 0${idx + 1}`;
                  const colorHex = typeof c === 'object' && c.hex ? c.hex : '#1C1B1A';
                  const active = selectedColor === colorName;
                  return (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      className={`px-3.5 py-2 hairline-box font-ledger text-xs uppercase flex items-center gap-2 transition-colors ${
                        active
                          ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                          : 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-sub)]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-current"
                        style={{ backgroundColor: colorHex }}
                      />
                      <span>{colorName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Woven Size Tag Matrix */}
            <div className="mt-6 pt-6 hairline-t">
              <div className="flex items-center justify-between font-ledger text-xs uppercase mb-3">
                <span className="text-[var(--ink-muted)]">PATTERN PROPORTION (SIZE):</span>
                <button
                  onClick={openSizeGuide}
                  className="underline hover:text-[var(--accent-stamp)]"
                >
                  [ VIEW PATTERN CHART ]
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((sz) => {
                  const active = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 font-ledger text-xs uppercase hairline-box transition-colors ${
                        active
                          ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-bold'
                          : 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-sub)]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Requisition Button */}
            <div className="mt-8 grid grid-cols-12 gap-3">
              <div className="col-span-4 flex items-center justify-between hairline-box bg-[var(--bg-elevated)] font-ledger text-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-4 hover:bg-[var(--bg-sub)]"
                >
                  -
                </button>
                <span>{String(quantity).padStart(2, '0')}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-4 hover:bg-[var(--bg-sub)]"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToBag}
                className="col-span-8 py-4 px-6 bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] transition-colors font-ledger text-xs uppercase tracking-widest font-medium flex items-center justify-between"
              >
                <span>
                  {stamped
                    ? `STAMPED [${selectedSize}] TO REQUISITION`
                    : 'STAMP TO REQUISITION BAG'}
                </span>
                <span>→</span>
              </button>
            </div>

            {/* Technical Specification Accordions */}
            <div className="mt-10 hairline-t">
              {specs.map((spec) => {
                const isOpen = openAccordion === spec.id;
                return (
                  <div key={spec.id} className="hairline-b">
                    <button
                      onClick={() => setOpenAccordion(isOpen ? '' : spec.id)}
                      className="w-full py-4 flex items-center justify-between font-ledger text-xs uppercase text-left hover:text-[var(--accent-stamp)]"
                    >
                      <span>{spec.title}</span>
                      <span>{isOpen ? '[ — ]' : '[ + ]'}</span>
                    </button>
                    {isOpen && (
                      <div className="pb-5 text-sm text-[var(--ink-secondary)] leading-relaxed">
                        {spec.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Related Archive Specimens */}
      {relatedProducts.length > 0 && (
        <section className="hairline-b">
          <div className="px-6 sm:px-10 py-6 hairline-b flex items-center justify-between">
            <h2 className="font-grotesk font-extrabold text-xl uppercase tracking-tight">
              Companion Archive Specimens
            </h2>
            <Link to="/shop" className="font-ledger text-xs uppercase underline">
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item, idx) => (
              <div key={item.id || idx} className="hairline-r hairline-b">
                <ProductCard product={item} index={idx} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetail;
