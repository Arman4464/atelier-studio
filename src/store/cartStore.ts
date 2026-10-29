// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency } from '../lib/format';
import { DEFAULT_CURRENCY } from '../lib/format';

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  title: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  size: string;
  selectedSize: string;
  color: string;
  selectedColor: string;
  quantity: number;
  product: any;
}

interface CartStore {
  items: CartItem[];
  wishlist: (string | number)[];
  currency: Currency;
  discountCode: string | null;
  discountPercent: number;
  addItem: (productOrItem: any, size?: string, color?: string, quantity?: number) => void;
  addToCart: (product: any, quantity?: number, size?: string, color?: string) => void;
  removeItem: (id: string | number, size?: string, color?: string) => void;
  removeFromCart: (id: string | number, size?: string, color?: string) => void;
  updateQuantity: (id: string | number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string | number) => void;
  isInWishlist: (productId: string | number) => boolean;
  setCurrency: (c: Currency) => void;
  applyDiscount: (code: string, percent?: number) => boolean;
  removeDiscount: () => void;
  totalItems: () => number;
  subtotal: () => number;
  total: () => number;
}

function normalizeCartEntry(
  raw: any,
  sizeArg?: string,
  colorArg?: string,
  qtyArg?: number
): CartItem {
  const base = raw?.product ? { ...raw.product, ...raw } : raw || {};
  const id = String(base.id ?? base.productId ?? base.slug ?? 'item-1');
  const slug = String(base.slug ?? id);
  const name = String(base.name ?? base.title ?? 'Atelier Piece');
  const price =
    typeof base.price === 'number'
      ? base.price
      : parseFloat(String(base.price || '380').replace(/[^0-9.]/g, '')) || 380;

  const images =
    Array.isArray(base.images) && base.images.length > 0
      ? base.images
      : base.image
      ? [base.image]
      : ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80'];

  const size = String(sizeArg ?? raw?.selectedSize ?? raw?.size ?? base.sizes?.[0] ?? 'M');
  const rawCol = colorArg ?? raw?.selectedColor ?? raw?.color ?? base.colors?.[0] ?? 'Obsidian';
  const color = typeof rawCol === 'object' ? String(rawCol.name || 'Obsidian') : String(rawCol);
  const quantity = Math.max(1, Number(qtyArg ?? raw?.quantity ?? 1));

  return {
    id,
    productId: id,
    slug,
    name,
    title: name,
    price,
    image: images[0],
    images,
    category: String(base.category || 'Collection'),
    size,
    selectedSize: size,
    color,
    selectedColor: color,
    quantity,
    product: {
      ...base,
      id,
      slug,
      name,
      title: name,
      price,
      image: images[0],
      images,
    },
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      currency: DEFAULT_CURRENCY,
      discountCode: null,
      discountPercent: 0,

      addItem: (productOrItem, size, color, quantity) => {
        const entry = normalizeCartEntry(productOrItem, size, color, quantity);
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.id === entry.id && i.size === entry.size && i.color === entry.color
          );
          if (idx > -1) {
            const updated = [...state.items];
            updated[idx] = {
              ...updated[idx],
              quantity: updated[idx].quantity + entry.quantity,
            };
            return { items: updated };
          }
          return { items: [...state.items, entry] };
        });
      },

      addToCart: (product, quantity = 1, size = 'M', color = 'Obsidian') => {
        get().addItem(product, size, color, quantity);
      },

      removeItem: (id, size, color) => {
        const strId = String(id);
        set((state) => ({
          items: state.items.filter((i) => {
            const sameId = String(i.id) === strId || String(i.productId) === strId;
            if (!sameId) return true;
            if (size && i.size !== size) return true;
            if (color && i.color !== color) return true;
            return false;
          }),
        }));
      },

      removeFromCart: (id, size, color) => {
        get().removeItem(id, size, color);
      },

      updateQuantity: (id, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color);
          return;
        }
        const strId = String(id);
        set((state) => ({
          items: state.items.map((i) => {
            const sameId = String(i.id) === strId || String(i.productId) === strId;
            const sameSize = !size || i.size === size;
            const sameColor = !color || i.color === color;
            return sameId && sameSize && sameColor ? { ...i, quantity } : i;
          }),
        }));
      },

      clearCart: () => set({ items: [], discountCode: null, discountPercent: 0 }),

      toggleWishlist: (productId) => {
        const pid = String(productId);
        set((state) => ({
          wishlist: state.wishlist.includes(pid)
            ? state.wishlist.filter((id) => id !== pid)
            : [...state.wishlist, pid],
        }));
      },

      isInWishlist: (productId) => get().wishlist.includes(String(productId)),

      setCurrency: (currency) => set({ currency }),

      applyDiscount: (code, percent = 15) => {
        const clean = code.trim().toUpperCase();
        if (!clean) return false;
        set({ discountCode: clean, discountPercent: percent });
        return true;
      },

      removeDiscount: () => set({ discountCode: null, discountPercent: 0 }),

      totalItems: () => get().items.reduce((sum, i) => sum + (i.quantity || 1), 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 1), 0),

      total: () => {
        const sub = get().subtotal();
        const disc = (sub * (get().discountPercent || 0)) / 100;
        return Math.max(0, sub - disc);
      },
    }),
    { name: 'atelier-cart-v2' }
  )
);

export default useCartStore;
