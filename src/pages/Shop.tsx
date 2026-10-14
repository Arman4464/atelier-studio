import React, { useState, useMemo } from 'react';
import { useProductsStore } from '../store/productsStore';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const productsStore = useProductsStore() as any;
  const rawProducts: any[] = productsStore.products || [];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [density, setDensity] = useState<'EDITORIAL' | 'GALLERY' | 'COMPACT'>('EDITORIAL');

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    rawProducts.forEach((p) => {
      if (p?.category) set.add(String(p.category));
    });
    return Array.from(set);
  }, [rawProducts]);

  const filteredProducts = useMemo(() => {
    return rawProducts.filter((p) => {
      const catMatch =
        selectedCategory === 'All' ||
        String(p?.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const title = String(p?.name || p?.title || '').toLowerCase();
      const queryMatch = !searchQuery || title.includes(searchQuery.toLowerCase());
      return catMatch && queryMatch;
    });
  }, [rawProducts, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen pt-28 pb-32 px-5 sm:px-10 max-w-[1440px] mx-auto">
      {/* Minimalist Centered Editorial Title */}
      <header className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-3">
          Autumn — Winter Collection
        </span>
        <h1 className="font-editorial italic text-5xl sm:text-7xl font-normal tracking-tight">
          The Complete Wardrobe
        </h1>
      </header>

      {/* Floating Frosted Filter & Layout Bar */}
      <div className="sticky top-20 z-30 mb-14 flex flex-wrap items-center justify-between gap-4 glass-island p-2 rounded-full max-w-5xl mx-auto">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] shadow-sm'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search + Density Switcher */}
        <div className="flex items-center gap-2 ml-auto pr-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter pieces..."
            className="px-4 py-1.5 rounded-full bg-[var(--bg-sub)] text-xs placeholder:text-[var(--ink-muted)] focus:outline-none w-36 sm:w-48 text-[var(--ink-primary)]"
          />

          <div className="hidden md:flex items-center gap-1 bg-[var(--bg-sub)] p-1 rounded-full text-[11px]">
            <button
              onClick={() => setDensity('EDITORIAL')}
              className={`px-3 py-1 rounded-full transition-colors ${
                density === 'EDITORIAL' ? 'bg-[var(--bg-elevated)] font-semibold shadow-sm' : 'opacity-60'
              }`}
            >
              Editorial
            </button>
            <button
              onClick={() => setDensity('GALLERY')}
              className={`px-3 py-1 rounded-full transition-colors ${
                density === 'GALLERY' ? 'bg-[var(--bg-elevated)] font-semibold shadow-sm' : 'opacity-60'
              }`}
            >
              3 Col
            </button>
            <button
              onClick={() => setDensity('COMPACT')}
              className={`px-3 py-1 rounded-full transition-colors ${
                density === 'COMPACT' ? 'bg-[var(--bg-elevated)] font-semibold shadow-sm' : 'opacity-60'
              }`}
            >
              4 Col
            </button>
          </div>
        </div>
      </div>

      {/* Product Showcase Grid */}
      {density === 'EDITORIAL' ? (
        /* Staggered Asymmetric Bento Rhythm */
        <section className="grid grid-cols-1 md:grid-cols-12 gap-y-14 gap-x-8 items-start">
          {filteredProducts.map((product, idx) => {
            const pattern = idx % 5;
            let spanClass = 'md:col-span-4';
            let aspect = 'aspect-[3/4]';

            if (pattern === 0) {
              spanClass = 'md:col-span-7';
              aspect = 'aspect-[4/4] sm:aspect-[16/12]';
            } else if (pattern === 1) {
              spanClass = 'md:col-span-5 md:mt-20';
              aspect = 'aspect-[3/4]';
            } else if (pattern === 3) {
              spanClass = 'md:col-span-4 md:mt-12';
            }

            return (
              <div key={product.id || idx} className={spanClass}>
                <ProductCard product={product} index={idx} aspectClass={aspect} />
              </div>
            );
          })}
        </section>
      ) : (
        <section
          className={`grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-12 ${
            density === 'GALLERY' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          }`}
        >
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} index={idx} />
          ))}
        </section>
      )}
    </main>
  );
};

export default Shop;
