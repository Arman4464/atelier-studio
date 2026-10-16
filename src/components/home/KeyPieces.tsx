// src/components/home/KeyPieces.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtelierBridge } from '../../lib/storeBridge';
import { ProductCard } from '../ProductCard';

export const KeyPieces: React.FC = () => {
  const { products, addToCart, openCart } = useAtelierBridge();
  const showcase = products.slice(0, 4);

  const [topIdx, setTopIdx] = useState(0);
  const [bottomIdx, setBottomIdx] = useState(Math.min(1, products.length - 1));

  const topPiece = products[topIdx] || products[0];
  const bottomPiece = products[bottomIdx] || products[0];

  const handleBundleAdd = () => {
    if (topPiece) addToCart(topPiece, 'M', 'Obsidian', 1);
    if (bottomPiece) addToCart(bottomPiece, 'M', 'Obsidian', 1);
    openCart();
  };

  return (
    <section className="py-16 sm:py-24 px-3 sm:px-6 max-w-[1440px] mx-auto space-y-20">
      {/* 1. Curated Bento Showcase */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 px-2">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[var(--accent-signal)] block mb-2">
              // CURATED ARCHIVE
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight uppercase">
              Key <span className="font-editorial italic font-normal lowercase">Silhouettes</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="btn-primary px-6 py-3 text-xs uppercase tracking-wider"
          >
            View All ({products.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {showcase.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} index={idx} />
          ))}
        </div>
      </div>

      {/* 2. Interactive Silhouette Pairing Studio */}
      {topPiece && bottomPiece && (
        <div className="surface-card p-6 sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)] mb-8">
            <div>
              <span className="font-mono-tech text-xs uppercase text-[var(--accent-signal)] font-bold">
                INTERACTIVE STYLING LAB
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase mt-1">
                Build Your 2-Piece Silhouette
              </h3>
            </div>
            <button
              onClick={handleBundleAdd}
              className="btn-signal px-6 py-3.5 text-xs uppercase tracking-wider"
            >
              Add Paired Look — ${(topPiece.price + bottomPiece.price).toFixed(0)} →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slot A: Primary Layer */}
            <div className="p-4 rounded-2xl bg-[var(--bg-sub)]/60 flex flex-col sm:flex-row items-center gap-5">
              <img
                src={topPiece.image}
                alt={topPiece.name}
                className="w-full sm:w-40 aspect-[3/4] rounded-xl object-cover"
              />
              <div className="flex-1 space-y-3 w-full">
                <span className="font-mono-tech text-[10px] uppercase text-[var(--ink-muted)]">
                  LAYER 01 // OUTERWEAR OR TOP
                </span>
                <h4 className="font-display font-bold text-lg">{topPiece.name}</h4>
                <p className="text-xs text-[var(--ink-secondary)] line-clamp-2">
                  {topPiece.description}
                </p>
                <div className="font-mono-tech font-bold text-sm">${topPiece.price}</div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setTopIdx((i) => (i - 1 + products.length) % products.length)}
                    className="px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] text-xs font-semibold"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setTopIdx((i) => (i + 1) % products.length)}
                    className="px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] text-xs font-semibold"
                  >
                    Next Piece →
                  </button>
                </div>
              </div>
            </div>

            {/* Slot B: Companion Layer */}
            <div className="p-4 rounded-2xl bg-[var(--bg-sub)]/60 flex flex-col sm:flex-row items-center gap-5">
              <img
                src={bottomPiece.image}
                alt={bottomPiece.name}
                className="w-full sm:w-40 aspect-[3/4] rounded-xl object-cover"
              />
              <div className="flex-1 space-y-3 w-full">
                <span className="font-mono-tech text-[10px] uppercase text-[var(--ink-muted)]">
                  LAYER 02 // COMPANION PIECE
                </span>
                <h4 className="font-display font-bold text-lg">{bottomPiece.name}</h4>
                <p className="text-xs text-[var(--ink-secondary)] line-clamp-2">
                  {bottomPiece.description}
                </p>
                <div className="font-mono-tech font-bold text-sm">${bottomPiece.price}</div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setBottomIdx((i) => (i - 1 + products.length) % products.length)}
                    className="px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] text-xs font-semibold"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setBottomIdx((i) => (i + 1) % products.length)}
                    className="px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] text-xs font-semibold"
                  >
                    Next Piece →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default KeyPieces;
