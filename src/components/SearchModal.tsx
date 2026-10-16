// src/components/SearchModal.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtelierBridge } from '../lib/storeBridge';

export const SearchModal: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isSearchOpen,
    openSearch,
    closeSearch,
    products,
    addToCart,
    openCart,
  } = useAtelierBridge();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isSearchOpen) closeSearch();
        else openSearch();
      } else if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4">
      <div
        onClick={closeSearch}
        className="fixed inset-0 bg-black/55 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-3xl surface-modal rounded-[28px] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <svg className="w-5 h-5 text-[var(--accent-signal)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search silhouettes, wool coats, trousers..."
            className="w-full bg-transparent text-base font-medium focus:outline-none"
          />
          <button
            onClick={closeSearch}
            className="px-3 py-1 rounded-full bg-[var(--bg-sub)] font-mono-tech text-xs"
          >
            ESC
          </button>
        </div>

        {/* Results Grid */}
        <div className="p-5 max-h-[62vh] overflow-y-auto space-y-3">
          <div className="font-mono-tech text-[11px] uppercase text-[var(--ink-muted)] px-1">
            {query ? `Matching Pieces (${results.length})` : 'Featured Archive Pieces'}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--ink-secondary)]">
              No pieces found matching "{query}"
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 hover:border-[var(--accent-signal)] transition-colors"
                >
                  <button
                    onClick={() => {
                      closeSearch();
                      navigate(`/product/${item.slug}`);
                    }}
                    className="flex items-center gap-3 text-left min-w-0 flex-1"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-mono-tech text-[10px] uppercase text-[var(--ink-muted)] block">
                        {item.category}
                      </span>
                      <h4 className="font-display font-bold text-sm truncate">
                        {item.name}
                      </h4>
                      <span className="font-mono-tech text-xs font-bold">
                        ${item.price}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      addToCart(item, 'M', 'Obsidian', 1);
                      closeSearch();
                      openCart();
                    }}
                    className="px-3 py-2 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--accent-signal)] hover:text-white font-mono-tech text-[11px] font-bold shrink-0 transition-colors"
                  >
                    + Bag
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
