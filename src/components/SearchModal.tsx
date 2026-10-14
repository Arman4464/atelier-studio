import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products.filter((p) => {
      const name = String(p.name || p.title || '').toLowerCase();
      const cat = String(p.category || '').toLowerCase();
      const desc = String(p.description || '').toLowerCase();
      return name.includes(q) || cat.includes(q) || desc.includes(q);
    });
  }, [products, query]);

  if (!isOpen) return null;

  const quickQueries = ['OUTERWEAR', 'WOOL', 'CANVAS', 'KNITWEAR', 'OBJECTS'];

  const formatPrice = (price: any) => {
    if (typeof price === 'number') {
      return price > 1000 ? `$${Math.round(price * 0.0104)}` : `$${price}`;
    }
    return price || '$380';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={closeSearch}
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      {/* Microfiche Index Terminal */}
      <div className="relative z-10 w-full max-w-4xl bg-[var(--bg-canvas)] text-[var(--ink-primary)] hairline-box shadow-2xl overflow-hidden font-ledger text-xs">
        {/* Top Terminal Status Bar */}
        <div className="px-6 py-3 bg-[var(--ink-primary)] text-[var(--bg-canvas)] flex items-center justify-between font-ledger text-[11px] uppercase">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-[var(--accent-stamp)]" />
            <span>ARCHIVE MICROFICHE TERMINAL // QUERY MODE</span>
          </div>
          <button
            onClick={closeSearch}
            className="hover:text-[var(--accent-stamp)] transition-colors"
          >
            [ ESC TO EXIT ]
          </button>
        </div>

        {/* Search Input Row */}
        <div className="p-6 hairline-b bg-[var(--bg-elevated)] flex items-center gap-4">
          <span className="font-ledger text-sm text-[var(--accent-stamp)] font-bold">
            QUERY://
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TYPE SILHOUETTE, TEXTILE WEIGHT, OR REF N°..."
            className="w-full bg-transparent font-ledger text-sm sm:text-base uppercase placeholder:text-[var(--ink-muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="font-ledger text-xs text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
            >
              [CLEAR]
            </button>
          )}
        </div>

        {/* Preset Tag Filters */}
        <div className="px-6 py-2.5 hairline-b bg-[var(--bg-sub)] flex items-center gap-2 overflow-x-auto font-ledger text-[10px]">
          <span className="text-[var(--ink-muted)] uppercase shrink-0">INDEX TAGS:</span>
          {quickQueries.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-[var(--bg-canvas)] hairline-box hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors uppercase shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Split Results Ledger & Specimen Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[60vh] overflow-y-auto">
          {/* Left 7 Columns: Ledger Rows */}
          <div className="md:col-span-7 hairline-r divide-y divide-[var(--border-hairline)]">
            {results.length === 0 ? (
              <div className="p-10 font-ledger text-xs text-[var(--ink-muted)] text-center">
                [ NO ARCHIVE SPECIMENS MATCHING "{query.toUpperCase()}" ]
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
                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors group font-ledger text-xs"
                  >
                    <div className="flex items-center gap-4">
                      <span className="opacity-50">
                        N° {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="font-grotesk font-bold text-sm uppercase">
                          {title}
                        </div>
                        <div className="text-[10px] opacity-70 uppercase">
                          {item.category || 'ARCHIVE'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{price}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right 5 Columns: Live Optical Plate */}
          <div className="hidden md:flex md:col-span-5 p-6 bg-[var(--bg-sub)] flex-col justify-between">
            {activeProduct ? (
              <div className="space-y-4">
                <div className="flex justify-between font-ledger text-[10px] text-[var(--ink-muted)] uppercase">
                  <span>OPTICAL PLATE PREVIEW</span>
                  <span>REF. AS-{activeProduct.id || '01'}</span>
                </div>
                <div className="aspect-[4/5] bg-[var(--bg-canvas)] hairline-box overflow-hidden">
                  <img
                    src={activeProduct?.images?.[0] || activeProduct?.image}
                    alt={activeProduct?.name || activeProduct?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-baseline justify-between font-ledger text-xs pt-2 hairline-t">
                  <span className="font-bold uppercase">
                    {activeProduct.name || activeProduct.title}
                  </span>
                  <Link
                    to={`/product/${activeProduct.slug || activeProduct.id}`}
                    onClick={closeSearch}
                    className="underline text-[var(--accent-stamp)] font-semibold"
                  >
                    OPEN DOSSIER ↗
                  </Link>
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
