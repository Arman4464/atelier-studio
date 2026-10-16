// src/pages/Shop.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const { products } = useAtelierBridge();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [layout, setLayout] = useState<'bento' | 'grid3' | 'grid4'>('grid3');

  useEffect(() => {
    const urlCat = searchParams.get('category') || 'All';
    setSelectedCategory(urlCat);
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const catMatch =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const qMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return catMatch && qMatch;
    });

    if (sortBy === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <main className="min-h-screen py-10 px-3 sm:px-6 max-w-[1440px] mx-auto">
      {/* Header Banner */}
      <div className="surface-card p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[var(--accent-signal)] block mb-2">
            // ARCHIVE CATALOG · {filteredProducts.length} PIECES
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight leading-none">
            {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory}
          </h1>
        </div>

        {/* Search + Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pieces..."
            className="input-studio !w-48 sm:!w-56 !py-2.5 !rounded-full text-xs"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-studio !w-auto !py-2.5 ! px-4 !rounded-full text-xs font-medium cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Sticky Category Pills + Grid Switcher */}
      <div className="sticky top-20 z-30 mb-8 surface-glass rounded-full p-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const active = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[var(--accent-signal)] text-white shadow-sm'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-1 bg-[var(--bg-sub)] p-1 rounded-full shrink-0">
          <button
            onClick={() => setLayout('bento')}
            className={`px-3 py-1 rounded-full font-mono-tech text-[11px] ${
              layout === 'bento' ? 'bg-[var(--bg-card)] font-bold shadow-sm' : 'opacity-60'
            }`}
          >
            Bento
          </button>
          <button
            onClick={() => setLayout('grid3')}
            className={`px-3 py-1 rounded-full font-mono-tech text-[11px] ${
              layout === 'grid3' ? 'bg-[var(--bg-card)] font-bold shadow-sm' : 'opacity-60'
            }`}
          >
            3 Col
          </button>
          <button
            onClick={() => setLayout('grid4')}
            className={`px-3 py-1 rounded-full font-mono-tech text-[11px] ${
              layout === 'grid4' ? 'bg-[var(--bg-card)] font-bold shadow-sm' : 'opacity-60'
            }`}
          >
            4 Col
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="surface-card p-16 text-center space-y-4">
          <p className="font-display text-xl font-bold">No pieces match your filter</p>
          <button
            onClick={() => {
              handleCategorySelect('All');
              setSearchQuery('');
            }}
            className="btn-primary px-6 py-3 text-xs uppercase"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
            layout === 'grid4' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          }`}
        >
          {filteredProducts.map((product, idx) => {
            const isBentoFeature = layout === 'bento' && idx % 5 === 0;
            return (
              <div
                key={product.id || idx}
                className={isBentoFeature ? 'sm:col-span-2' : 'col-span-1'}
              >
                <ProductCard
                  product={product}
                  index={idx}
                  featured={isBentoFeature}
                />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Shop;
