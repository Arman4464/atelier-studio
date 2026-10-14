import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';

interface QuickViewProps {
  product?: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export const QuickView: React.FC<QuickViewProps> = (props) => {
  const uiStore = useUIStore() as any;
  const cartStore = useCartStore() as any;

  const product =
    props.product ?? uiStore.quickViewProduct ?? uiStore.selectedProduct ?? null;
  const isOpen =
    props.isOpen ?? Boolean(uiStore.isQuickViewOpen ?? uiStore.quickViewOpen ?? product);

  const closeQuickView = () => {
    if (props.onClose) props.onClose();
    if (uiStore.closeQuickView) uiStore.closeQuickView();
    else if (uiStore.setQuickViewProduct) uiStore.setQuickViewProduct(null);
    else if (uiStore.setQuickViewOpen) uiStore.setQuickViewOpen(false);
  };

  const sizes: string[] = product?.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const colors: any[] = product?.colors || [{ name: 'Raw Carbon', hex: '#141413' }];

  const [selectedSize, setSelectedSize] = useState<string>(sizes[1] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(
    typeof colors[0] === 'string' ? colors[0] : colors[0]?.name || 'Raw Carbon'
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[1] || product.sizes?.[0] || 'M');
      const firstCol = product.colors?.[0];
      setSelectedColor(typeof firstCol === 'string' ? firstCol : firstCol?.name || 'Raw Carbon');
      setActiveImageIdx(0);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const images: string[] = product.images?.length
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'];
  const title = product.name || product.title || 'Archive Specimen';
  const price =
    typeof product.price === 'number'
      ? product.price > 1000
        ? `$${Math.round(product.price * 0.0104)}`
        : `$${product.price.toFixed(2)}`
      : product.price || '$380';
  const slug = product.slug || product.id;

  const handleStampToBag = () => {
    if (cartStore.addItem) {
      cartStore.addItem({
        ...product,
        id: product.id,
        selectedSize,
        size: selectedSize,
        selectedColor,
        color: selectedColor,
        quantity: 1,
      });
    } else if (cartStore.addToCart) {
      cartStore.addToCart(product, 1, selectedSize, selectedColor);
    }
    closeQuickView();
    if (uiStore.openCart) uiStore.openCart();
    else if (uiStore.setCartOpen) uiStore.setCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/65 backdrop-blur-[2px]"
      />

      <div className="relative z-10 w-full max-w-4xl bg-[var(--bg-canvas)] text-[var(--ink-primary)] hairline-box shadow-2xl grid grid-cols-1 md:grid-cols-12 overflow-hidden max-h-[90vh]">
        {/* Left 6 Columns: Specimen Plate */}
        <div className="md:col-span-6 bg-[var(--bg-sub)] hairline-r relative flex flex-col justify-between">
          <div className="px-4 py-2.5 hairline-b flex justify-between font-ledger text-[10px] text-[var(--ink-secondary)] uppercase">
            <span>SPECIMEN LOUPE // 1:1</span>
            <span>PLATE 0{activeImageIdx + 1}</span>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={images[activeImageIdx]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 hairline-t bg-[var(--bg-canvas)]">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`aspect-square hairline-r p-1 transition-opacity ${
                    activeImageIdx === i ? 'bg-[var(--ink-primary)]' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right 6 Columns: Woven Care & Size Stamp */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 perforated-b font-ledger text-xs">
              <span className="uppercase text-[var(--ink-muted)]">
                {product.category || 'ARCHIVE EDITION'}
              </span>
              <button
                onClick={closeQuickView}
                className="px-2 py-0.5 hairline-box hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)]"
              >
                [ ✕ ]
              </button>
            </div>

            <div className="mt-5 flex items-baseline justify-between gap-3">
              <h2 className="font-grotesk font-extrabold text-2xl uppercase tracking-tight">
                {title}
              </h2>
              <span className="font-ledger text-lg font-bold text-[var(--accent-stamp)]">
                {price}
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
              {product.description ||
                'Unlined architectural construction cut from loomstate fabric. Numbered edition label stitched into interior seam.'}
            </p>

            {/* Dye Lot Selector */}
            <div className="mt-6 pt-4 hairline-t font-ledger text-xs">
              <div className="flex justify-between uppercase mb-2">
                <span className="text-[var(--ink-muted)]">DYE LOT:</span>
                <span>{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c, i) => {
                  const cName = typeof c === 'string' ? c : c.name || `Lot ${i + 1}`;
                  return (
                    <button
                      key={cName}
                      onClick={() => setSelectedColor(cName)}
                      className={`px-3 py-1.5 hairline-box uppercase text-[11px] ${
                        selectedColor === cName
                          ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                          : 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-sub)]'
                      }`}
                    >
                      {cName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Woven Size Matrix */}
            <div className="mt-5 pt-4 hairline-t font-ledger text-xs">
              <div className="flex justify-between uppercase mb-2">
                <span className="text-[var(--ink-muted)]">PATTERN SIZE:</span>
                <span>[{selectedSize}]</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 hairline-box uppercase ${
                      selectedSize === sz
                        ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-bold'
                        : 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-sub)]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 hairline-t space-y-3 font-ledger text-xs">
            <button
              onClick={handleStampToBag}
              className="w-full py-4 bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] transition-colors uppercase tracking-widest font-bold"
            >
              STAMP SIZE [{selectedSize}] TO BAG →
            </button>
            <Link
              to={`/product/${slug}`}
              onClick={closeQuickView}
              className="block w-full text-center py-2.5 hairline-box uppercase hover:bg-[var(--bg-sub)]"
            >
              INSPECT FULL GARMENT DOSSIER ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
