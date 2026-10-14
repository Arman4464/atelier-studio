import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useProductsStore } from '../store/productsStore';

interface SearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = (props) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const uiStore = useUIStore() as any;
  const productsStore = useProductsStore() as any;

  const isOpen =
    props.isOpen ??
    Boolean(uiStore.isSearchOpen ?? uiStore.searchOpen ?? uiStore.activeModal === 'search');

  const closeSearch = () => {
    if (props.onClose) props.onClose();
    if (uiStore.closeSearch) uiStore.closeSearch();
    else if (uiStore.setSearchOpen) uiStore.setSearchOpen(false);
    else if (uiStore.closeModal) uiStore.closeModal();
  };

  const products: any[] = productsStore.products || [];
  const [query, setQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<any | null>(null);

  // Global Cmd+K / Ctrl+K & Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) closeSearch();
        else if (uiStore.openSearch) uiStore.openSearch();
        else if (uiStore.setSearchOpen) uiStore.setSearchOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      if (products.length > 0 && !activeProduct) {
        setActiveProduct(products[0]);
      }
    } else {
      setQuery('');
    }
  }, [isOpen, products]);

  const results = useMemo(() => {
    if (!query.trim()) return products.slice(0, 6);
    const q = query.toLowerCase();
    return products.filter((p) => {
      const title = String(p.name || p.title || '').toLowerCase();
      const cat = String(p.category || '').toLowerCase();
      return title.includes(q) || cat.includes(q);
    });
  }, [query, products]);

  const quickQueries = ['Coats', 'Trousers', 'Knitwear', 'Silk', 'Outerwear'];

  const formatPrice = (val: any) => {
    if (typeof val === 'number') {
      const num = val > 1000 ? Math.round(val * 0.0104) : val;
      return `$${num}`;
    }
    return val || '$380';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={closeSearch}
        className="fixed inset-0 bg-black/45 backdrop-blur-md transition-opacity"
      />

      <div className="relative z-10 w-full max-w-3xl glass-island rounded-[32px] overflow-hidden shadow-2xl">
        {/* Search Input Bar */}
        <div className="p-5 sm:p-7 border-b border-[var(--glass-border)] flex items-center gap-4">
          <svg className="w-5 h-5 text-[var(--ink-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wardrobe, silhouettes, textiles..."
            className="w-full bg-transparent text-lg sm:text-xl font-light placeholder:text-[var(--ink-muted)] focus:outline-none text-[var(--ink-primary)]"
          />
          <button
            onClick={closeSearch}
            className="w-8 h-8 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-xs hover:scale-105 transition-transform shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-3 border-b border-[var(--glass-border)] bg-[var(--bg-sub)]/50 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[var(--ink-muted)] shrink-0">Explore:</span>
          {quickQueries.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3.5 py-1 rounded-full glass-pill text-xs hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List & Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[55vh] overflow-y-auto no-scrollbar">
          <div className="md:col-span-7 divide-y divide-[var(--glass-border)]">
            {results.length === 0 ? (
              <div className="p-12 text-center text-sm text-[var(--ink-muted)]">
                No pieces found matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              results.map((item, idx) => {
                const slug = item.slug || item.id;
                const title = item.name || item.title;
                const price = formatPrice(item.price);

                return (
                  <button
                    key={slug || idx}
                    onMouseEnter={() => setActiveProduct(item)}
                    onClick={() => {
                      closeSearch();
                      navigate(`/product/${slug}`);
                    }}
                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-sub)] transition-colors group"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-[var(--ink-primary)] group-hover:opacity-75 transition-opacity">
                        {title}
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                        {item.category || 'Collection Piece'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[var(--ink-primary)]">
                      {price}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Preview Column */}
          <div className="hidden md:block md:col-span-5 p-6 bg-[var(--bg-sub)]/30 border-l border-[var(--glass-border)]">
            {activeProduct ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-[var(--bg-sub)] shadow-md">
                  <img
                    src={activeProduct.images?.[0] || activeProduct.image}
                    alt={activeProduct.name || activeProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-editorial italic text-2xl leading-none">
                    {activeProduct.name || activeProduct.title}
                  </h4>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">
                    {activeProduct.category} · {formatPrice(activeProduct.price)}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
