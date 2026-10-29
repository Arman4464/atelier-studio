// src/store/uiStore.ts
import { create } from 'zustand';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface UIStore {
  cartOpen: boolean;
  isCartOpen: boolean;
  wishlistOpen: boolean;
  isWishlistOpen: boolean;
  searchOpen: boolean;
  isSearchOpen: boolean;
  mobileNavOpen: boolean;
  isMobileNavOpen: boolean;
  sizeGuideOpen: boolean;
  isSizeGuideOpen: boolean;
  quickViewProduct: any | null;
  selectedProduct: any | null;
  toasts: ToastItem[];

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCartOpen: (v: boolean) => void;

  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
  setWishlistOpen: (v: boolean) => void;

  openSearch: () => void;
  closeSearch: () => void;
  setSearchOpen: (v: boolean) => void;

  openMobileNav: () => void;
  closeMobileNav: () => void;
  setMobileNavOpen: (v: boolean) => void;

  openSizeGuide: () => void;
  closeSizeGuide: () => void;
  setSizeGuideOpen: (v: boolean) => void;

  openQuickView: (product: any) => void;
  closeQuickView: () => void;
  setQuickViewProduct: (product: any | null) => void;

  closeAll: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  addToast: (message: string | { title?: string; message?: string; type?: 'success' | 'error' | 'info' }, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  cartOpen: false,
  isCartOpen: false,
  wishlistOpen: false,
  isWishlistOpen: false,
  searchOpen: false,
  isSearchOpen: false,
  mobileNavOpen: false,
  isMobileNavOpen: false,
  sizeGuideOpen: false,
  isSizeGuideOpen: false,
  quickViewProduct: null,
  selectedProduct: null,
  toasts: [],

  openCart: () => set({ cartOpen: true, isCartOpen: true }),
  closeCart: () => set({ cartOpen: false, isCartOpen: false }),
  toggleCart: () => {
    const next = !get().cartOpen;
    set({ cartOpen: next, isCartOpen: next });
  },
  setCartOpen: (v) => set({ cartOpen: v, isCartOpen: v }),

  openWishlist: () => set({ wishlistOpen: true, isWishlistOpen: true }),
  closeWishlist: () => set({ wishlistOpen: false, isWishlistOpen: false }),
  toggleWishlistDrawer: () => {
    const next = !get().wishlistOpen;
    set({ wishlistOpen: next, isWishlistOpen: next });
  },
  setWishlistOpen: (v) => set({ wishlistOpen: v, isWishlistOpen: v }),

  openSearch: () => set({ searchOpen: true, isSearchOpen: true }),
  closeSearch: () => set({ searchOpen: false, isSearchOpen: false }),
  setSearchOpen: (v) => set({ searchOpen: v, isSearchOpen: v }),

  openMobileNav: () => set({ mobileNavOpen: true, isMobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false, isMobileNavOpen: false }),
  setMobileNavOpen: (v) => set({ mobileNavOpen: v, isMobileNavOpen: v }),

  openSizeGuide: () => set({ sizeGuideOpen: true, isSizeGuideOpen: true }),
  closeSizeGuide: () => set({ sizeGuideOpen: false, isSizeGuideOpen: false }),
  setSizeGuideOpen: (v) => set({ sizeGuideOpen: v, isSizeGuideOpen: v }),

  openQuickView: (product) => set({ quickViewProduct: product, selectedProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null, selectedProduct: null }),
  setQuickViewProduct: (product) => set({ quickViewProduct: product, selectedProduct: product }),

  closeAll: () =>
    set({
      mobileNavOpen: false,
      isMobileNavOpen: false,
      cartOpen: false,
      isCartOpen: false,
      wishlistOpen: false,
      isWishlistOpen: false,
      searchOpen: false,
      isSearchOpen: false,
      sizeGuideOpen: false,
      isSizeGuideOpen: false,
      quickViewProduct: null,
      selectedProduct: null,
    }),

  showToast: (message, type = 'info') => get().addToast(message, type),

  addToast: (input, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    const item: ToastItem =
      typeof input === 'string'
        ? { id, message: input, type }
        : { id, title: input.title, message: input.message || input.title || 'Updated', type: input.type || type };
    set((state) => ({ toasts: [...state.toasts, item] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export default useUIStore;
