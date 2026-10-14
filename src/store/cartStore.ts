import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../data/products";
import type { Currency } from "../lib/format";
import { DEFAULT_CURRENCY } from "../lib/format";
import { useSettingsStore } from "./settingsStore";
import { useDiscountsStore, type Discount } from "./discountsStore";

export interface CartItem extends Product {
  qty: number;
  quantity?: number;
  selectedSize?: string;
  selectedColor?: string;
  size?: string;
  color?: string;
}

interface CartState {
  cart: CartItem[];
  items?: CartItem[];
  wishlist: number[];
  currency: Currency;
  promoCode: string;
  appliedDiscount: Discount | null;
  promoError: string | null;

  addToCart: (product: Product, qty?: number, size?: string, color?: string) => void;
  addItem?: (product: any) => void;
  updateQty: (id: number, delta: number) => void;
  updateQuantity?: (id: number, qty: number, size?: string, color?: string) => void;
  removeFromCart: (id: number) => void;
  removeItem?: (id: number, size?: string, color?: string) => void;
  clearCart: () => void;

  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;

  setCurrency: (c: Currency) => void;
  setPromoCode: (code: string) => void;
  applyPromo: () => void;
  removePromo: () => void;

  cartTotal: () => number;
  cartCount: () => number;
  discountAmount: () => number;
  shippingCost: () => number;
  cartGrandTotal: () => number;
}

function toItems(cart: CartItem[]): CartItem[] {
  return cart.map((i) => ({
    ...i,
    quantity: i.qty || i.quantity || 1,
    size: i.selectedSize || i.size || "M",
    color: i.selectedColor || i.color || "RAW",
  }));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      items: [],
      wishlist: [],
      currency: DEFAULT_CURRENCY,
      promoCode: "",
      appliedDiscount: null,
      promoError: null,

      addToCart: (product, qty = 1, size = "M", color = "RAW") => {
        set((state) => {
          const existing = state.cart.find((i) => i.id === product.id && (i.selectedSize || i.size) === size);
          let nextCart: CartItem[];
          if (existing) {
            nextCart = state.cart.map((i) =>
              i.id === product.id && (i.selectedSize || i.size) === size
                ? { ...i, qty: i.qty + qty, quantity: i.qty + qty }
                : i
            );
          } else {
            nextCart = [
              ...state.cart,
              {
                ...product,
                qty,
                quantity: qty,
                selectedSize: size,
                size,
                selectedColor: color,
                color,
              },
            ];
          }
          return { cart: nextCart, items: toItems(nextCart) };
        });
      },

      addItem: (product: any) => {
        const qty = product.quantity || 1;
        const size = product.selectedSize || product.size || "M";
        const color = product.selectedColor || product.color || "RAW";
        get().addToCart(product, qty, size, color);
      },

      updateQty: (id, delta) => {
        set((state) => {
          const next = state.cart
            .map((i) => (i.id === id ? { ...i, qty: i.qty + delta, quantity: i.qty + delta } : i))
            .filter((i) => i.qty > 0);
          return { cart: next, items: toItems(next) };
        });
      },

      updateQuantity: (id, qty, size) => {
        set((state) => {
          let next: CartItem[];
          if (qty <= 0) {
            next = state.cart.filter((i) => !(i.id === id && (!size || (i.selectedSize || i.size) === size)));
          } else {
            next = state.cart.map((i) =>
              i.id === id && (!size || (i.selectedSize || i.size) === size)
                ? { ...i, qty, quantity: qty }
                : i
            );
          }
          return { cart: next, items: toItems(next) };
        });
      },

      removeFromCart: (id) =>
        set((state) => {
          const next = state.cart.filter((i) => i.id !== id);
          return { cart: next, items: toItems(next) };
        }),

      removeItem: (id, size) =>
        set((state) => {
          const next = state.cart.filter((i) => !(i.id === id && (!size || (i.selectedSize || i.size) === size)));
          return { cart: next, items: toItems(next) };
        }),

      clearCart: () => set({ cart: [], items: [], appliedDiscount: null, promoCode: "", promoError: null }),

      toggleWishlist: (id) => {
        set((state) => {
          const has = state.wishlist.includes(id);
          return { wishlist: has ? state.wishlist.filter((w) => w !== id) : [...state.wishlist, id] };
        });
      },
      isWishlisted: (id) => get().wishlist.includes(id),

      setCurrency: (c) => set({ currency: c }),
      setPromoCode: (code) => set({ promoCode: code }),

      applyPromo: () => {
        const result = useDiscountsStore.getState().redeem(get().promoCode);
        if (result.ok) {
          set({ appliedDiscount: result.discount, promoError: null });
        } else {
          set({ appliedDiscount: null, promoError: result.error });
          setTimeout(() => set({ promoError: null }), 4000);
        }
      },

      removePromo: () => set({ appliedDiscount: null, promoCode: "" }),

      cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.qty, 0),

      discountAmount: () => {
        const discount = get().appliedDiscount;
        if (!discount) return 0;
        const total = get().cartTotal();
        const amount = discount.type === "percentage" ? total * (discount.value / 100) : discount.value;
        return Math.min(amount, total);
      },

      shippingCost: () => {
        const total = get().cartTotal();
        const { freeShippingThreshold, standardShippingCost } = useSettingsStore.getState();
        return total === 0 || total >= freeShippingThreshold ? 0 : standardShippingCost;
      },

      cartGrandTotal: () => {
        const total = get().cartTotal();
        return Math.max(0, total + get().shippingCost() - get().discountAmount());
      },
    }),
    {
      name: "atelier-cart-v2",
      version: 1,
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist, currency: state.currency }),
    }
  )
);
