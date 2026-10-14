import { create } from "zustand";
import type { Product } from "../data/products";

export interface Toast {
  id: string;
  message: string;
}

interface UIState {
  mobileNavOpen: boolean;
  cartOpen: boolean;
  wishlistOpen: boolean;
  searchOpen: boolean;
  sizeGuideOpen: boolean;
  quickViewProduct: Product | null;
  toasts: Toast[];

  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  setMobileNavOpen: (v: boolean) => void;
  setCartOpen: (v: boolean) => void;
  setWishlistOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setSizeGuideOpen: (v: boolean) => void;
  setQuickViewProduct: (p: Product | null) => void;
  closeAll: () => void;

  showToast: (message: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  cartOpen: false,
  wishlistOpen: false,
  searchOpen: false,
  sizeGuideOpen: false,
  quickViewProduct: null,
  toasts: [],

  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openWishlist: () => set({ wishlistOpen: true }),
  closeWishlist: () => set({ wishlistOpen: false }),
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
  setCartOpen: (v) => set({ cartOpen: v }),
  setWishlistOpen: (v) => set({ wishlistOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setSizeGuideOpen: (v) => set({ sizeGuideOpen: v }),
  setQuickViewProduct: (p) => set({ quickViewProduct: p }),
  closeAll: () =>
    set({
      mobileNavOpen: false,
      cartOpen: false,
      wishlistOpen: false,
      searchOpen: false,
      sizeGuideOpen: false,
      quickViewProduct: null,
    }),

  showToast: (message) => {
    const id = `${Date.now()}-${Math.random()}`;
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
}));
