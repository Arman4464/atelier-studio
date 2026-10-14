import React from 'react';
import { Link } from 'react-router-dom';
import { useProductsStore } from '../../store/productsStore';
import { ProductCard } from '../ProductCard';

export const KeyPieces: React.FC = () => {
  const productsStore = useProductsStore() as any;
  const products: any[] = (productsStore.products || []).slice(0, 4);

  return (
    <section className="py-20 sm:py-28 px-5 sm:px-10 max-w-[1440px] mx-auto">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-3">
            Curated Silhouettes
          </span>
          <h2 className="font-editorial italic text-4xl sm:text-6xl font-normal tracking-tight leading-none">
            Objects of Permanence
          </h2>
        </div>
        <Link
          to="/shop"
          className="self-start md:self-end px-6 py-3 rounded-full glass-pill text-xs font-medium tracking-wider uppercase hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
        >
          View All Pieces →
        </Link>
      </div>

      {/* Staggered Asymmetric Gallery (Offsets every 2nd column vertically) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {products.map((product, idx) => {
          // Asymmetric column spans & vertical offsets
          const layoutClasses = [
            'lg:col-span-4',
            'lg:col-span-3 lg:mt-20',
            'lg:col-span-3',
            'lg:col-span-2 lg:mt-28',
          ][idx % 4];

          return (
            <div key={product.id || idx} className={layoutClasses}>
              <ProductCard product={product} index={idx} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KeyPieces;
