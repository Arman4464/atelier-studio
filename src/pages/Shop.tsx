import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProductsStore } from '../store/productsStore';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const [params] = useSearchParams();
  const productsStore = useProductsStore() as any;
  const rawProducts: any[] = productsStore.products || [];

  const initialCat = (params.get('category') || params.get('cat') || 'ALL').toUpperCase();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [viewMode, setViewMode] = useState<'EDITORIAL' | 'INDEX'>('EDITORIAL');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState<any | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>(['ALL']);
    rawProducts.forEach((p) => {
      if (p?.category) set.add(String(p.category).toUpperCase());
    });
    return Array.from(set);
  }, [rawProducts]);

  const filteredProducts = useMemo(() => {
    return rawProducts.filter((p) => {
      const catMatch =
        selectedCategory === 'ALL' ||
        String(p?.category || '').toUpperCase() === selectedCategory;
      const title = String(p?.name || p?.title || '').toLowerCase();
      const queryMatch = !searchQuery || title.includes(searchQuery.toLowerCase());
      return catMatch && queryMatch;
    });
  }, [rawProducts, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Top Archive Header */}
      <section className="px-6 sm:px-10 py-12 hairline-b grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-8">
          <div className="font-ledger text-xs text-[var(--accent-stamp)] uppercase tracking-widest mb-2">
            // COMPLETE GARMENT INDEX
          </div>
          <h1 className="font-grotesk font-extrabold text-4xl sm:text-6xl tracking-[-0.04em] uppercase leading-none">
            Archive <span className="font-editorial italic font-normal lowercase">Catalog</span>
          </h1>
        </div>
        <div className="lg:col-span-4 font-ledger text-xs text-[var(--ink-secondary)] flex flex-col sm:items-end justify-end">
          <span>SHOWING {String(filteredProducts.length).padStart(2, '0')} SPECIMENS</span>
          <span>BATCH RELEASE: AW // 2026</span>
        </div>
      </section>

      {/* Filter & View Switcher Toolbar */}
      <div className="sticky top-[68px] z-30 bg-[var(--bg-canvas)]/95 backdrop-blur-md hairline-b grid grid-cols-1 lg:grid-cols-12">
        {/* Category Tabs */}
        <div className="lg:col-span-7 flex items-center overflow-x-auto no-scrollbar hairline-r">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3.5 font-ledger text-xs uppercase whitespace-nowrap hairline-r transition-colors ${
                  active
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-medium'
                    : 'hover:bg-[var(--bg-sub)] text-[var(--ink-secondary)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input + Editorial / Index View Toggle */}
        <div className="lg:col-span-5 flex items-stretch justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER BY GARMENT OR REF..."
            className="w-full px-4 py-3 bg-transparent font-ledger text-xs uppercase placeholder:text-[var(--ink-muted)] focus:outline-none hairline-r"
          />

          <div className="flex items-stretch shrink-0">
            <button
              onClick={() => setViewMode('EDITORIAL')}
              className={`px-4 font-ledger text-[11px] uppercase hairline-r ${
                viewMode === 'EDITORIAL'
                  ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                  : 'hover:bg-[var(--bg-sub)]'
              }`}
            >
              [ GRID ]
            </button>
            <button
              onClick={() => setViewMode('INDEX')}
              className={`px-4 font-ledger text-[11px] uppercase ${
                viewMode === 'INDEX'
                  ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                  : 'hover:bg-[var(--bg-sub)]'
              }`}
            >
              [ LEDGER ]
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: Asymmetric Editorial Grid */}
      {viewMode === 'EDITORIAL' ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, idx) => {
            // Every 5th item spans 2 columns for an editorial magazine rhythm
            const isFeature = idx % 5 === 0;
            return (
              <div
                key={product.id || idx}
                className={`hairline-b hairline-r ${
                  isFeature ? 'sm:col-span-2' : 'col-span-1'
                }`}
              >
                <ProductCard product={product} index={idx} featured={isFeature} />
              </div>
            );
          })}
        </section>
      ) : (
        /* MODE 2: High-Density Archival Ledger Table with Floating Lookbook Preview */
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[70vh]">
          <div className="lg:col-span-8 hairline-r">
            <div className="grid grid-cols-12 px-6 py-3 hairline-b font-ledger text-[10px] uppercase text-[var(--ink-muted)]">
              <div className="col-span-2">REF N°</div>
              <div className="col-span-5">GARMENT SPECIFICATION</div>
              <div className="col-span-3">CATEGORY</div>
              <div className="col-span-2 text-right">VALUATION</div>
            </div>

            {filteredProducts.map((product, idx) => {
              const slug = product?.slug || product?.id;
              const title = product?.name || product?.title;
              const price =
                typeof product?.price === 'number'
                  ? product.price > 1000
                    ? `$${Math.round(product.price * 0.0104)}`
                    : `$${product.price}`
                  : product?.price || '$380';

              return (
                <Link
                  key={slug || idx}
                  to={`/product/${slug}`}
                  onMouseEnter={() => setHoveredProduct(product)}
                  className="grid grid-cols-12 items-center px-6 py-4 hairline-b font-ledger text-xs hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors group"
                >
                  <div className="col-span-2 opacity-60">
                    AS-{String(idx + 101)}
                  </div>
                  <div className="col-span-5 font-grotesk font-bold text-sm">
                    {title}
                  </div>
                  <div className="col-span-3 uppercase opacity-75">
                    {product?.category || 'ARCHIVE'}
                  </div>
                  <div className="col-span-2 text-right font-medium">
                    {price} <span className="ml-1 opacity-0 group-hover:opacity-100">↗</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sticky Specimen Preview Pane */}
          <div className="hidden lg:flex lg:col-span-4 p-8 sticky top-[120px] h-fit flex-col justify-between">
            {hoveredProduct ? (
              <div className="space-y-4">
                <div className="font-ledger text-[11px] uppercase text-[var(--ink-muted)] flex justify-between">
                  <span>SPECIMEN PREVIEW</span>
                  <span>[ LIVE ]</span>
                </div>
                <div className="aspect-[3/4] hairline-box overflow-hidden bg-[var(--bg-sub)]">
                  <img
                    src={hoveredProduct?.images?.[0] || hoveredProduct?.image}
                    alt={hoveredProduct?.name || hoveredProduct?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-ledger text-xs">
                  <div className="font-bold uppercase">
                    {hoveredProduct?.name || hoveredProduct?.title}
                  </div>
                  <p className="text-[var(--ink-secondary)] mt-1 line-clamp-2">
                    {hoveredProduct?.description || 'Archival small-batch construction.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-[3/4] hairline-box flex items-center justify-center p-8 text-center font-ledger text-xs text-[var(--ink-muted)]">
                [ HOVER ANY ARCHIVE LEDGER ROW TO INSPECT SILHOUETTE ]
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default Shop;
