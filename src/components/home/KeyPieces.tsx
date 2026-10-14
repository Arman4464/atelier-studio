import React from 'react';
import { Link } from 'react-router-dom';
import { useProductsStore } from '../../store/productsStore';
import { ProductCard } from '../ProductCard';

export const KeyPieces: React.FC = () => {
  const productsStore = useProductsStore() as any;
  const products: any[] = (productsStore.products || []).slice(0, 4);

  return (
    <section className="hairline-b">
      <div className="px-6 sm:px-10 py-8 hairline-b flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-ledger text-xs uppercase tracking-widest text-[var(--accent-stamp)]">
            // CURATED SPECIMENS
          </span>
          <h2 className="font-grotesk font-extrabold text-3xl sm:text-4xl uppercase tracking-tight mt-1">
            Key Archive <span className="font-editorial italic font-normal lowercase">Pieces</span>
          </h2>
        </div>
        <Link
          to="/shop"
          className="font-ledger text-xs uppercase px-5 py-3 hairline-box hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
        >
          INSPECT FULL ARCHIVE [01—{String(products.length).padStart(2, '0')}] →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, idx) => (
          <div key={product.id || idx} className="hairline-r hairline-b">
            <ProductCard product={product} index={idx} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyPieces;
