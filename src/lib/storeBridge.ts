// src/lib/storeBridge.ts
import { create } from 'zustand';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useProductsStore } from '../store/productsStore';
import { useThemeStore } from '../store/themeStore';

// Fallback local UI & Wishlist state in case any method is absent in the base stores
interface FallbackUIState {
  cartOpen: boolean;
  searchOpen: boolean;
  wishlistOpen: boolean;
  mobileNavOpen: boolean;
  sizeGuideOpen: boolean;
  quickViewProduct: any | null;
  wishlistIds: string[];
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setWishlistOpen: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
  setSizeGuideOpen: (v: boolean) => void;
  setQuickViewProduct: (p: any | null) => void;
  toggleWishlistId: (id: string) => void;
}

const useFallbackStore = create<FallbackUIState>((set, get) => ({
  cartOpen: false,
  searchOpen: false,
  wishlistOpen: false,
  mobileNavOpen: false,
  sizeGuideOpen: false,
  quickViewProduct: null,
  wishlistIds: JSON.parse(localStorage.getItem('atelier_wishlist_ids') || '[]'),
  setCartOpen: (v) => set({ cartOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setWishlistOpen: (v) => set({ wishlistOpen: v }),
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
  setSizeGuideOpen: (v) => set({ sizeGuideOpen: v }),
  setQuickViewProduct: (p) => set({ quickViewProduct: p }),
  toggleWishlistId: (id) => {
    const current = get().wishlistIds;
    const exists = current.includes(id);
    const next = exists ? current.filter((item) => item !== id) : [...current, id];
    localStorage.setItem('atelier_wishlist_ids', JSON.stringify(next));
    set({ wishlistIds: next });
  },
}));

export function normalizeProduct(raw: any, idx = 0) {
  if (!raw) return null;
  const id = String(raw.id ?? raw.slug ?? `piece-${idx}`);
  const slug = String(raw.slug ?? raw.id ?? id);
  const title = String(raw.name ?? raw.title ?? 'Architectural Garment');
  const category = String(raw.category ?? 'Outerwear');
  const price =
    typeof raw.price === 'number'
      ? raw.price
      : parseFloat(String(raw.price || '420').replace(/[^0-9.]/g, '')) || 420;
  const originalPrice = raw.originalPrice ?? raw.compareAtPrice ?? null;

  const images: string[] =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : raw.image
      ? [raw.image]
      : [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
        ];

  const sizes: string[] =
    Array.isArray(raw.sizes) && raw.sizes.length > 0
      ? raw.sizes
      : ['XS', 'S', 'M', 'L', 'XL'];

  const colors: { name: string; hex: string }[] = Array.isArray(raw.colors)
    ? raw.colors.map((c: any) =>
        typeof c === 'string'
          ? { name: c, hex: c.toLowerCase().includes('white') || c.toLowerCase().includes('bone') ? '#EAE8E1' : '#18181B' }
          : { name: c.name || 'Obsidian', hex: c.hex || '#18181B' }
      )
    : [
        { name: 'Obsidian', hex: '#141416' },
        { name: 'Warm Stone', hex: '#DCD9D0' },
      ];

  return {
    ...raw,
    id,
    slug,
    name: title,
    title,
    category,
    price,
    originalPrice,
    images,
    image: images[0],
    sizes,
    colors,
    description:
      raw.description ||
      'Engineered from high-density Italian and Japanese technical textiles with articulated patterning and hand-finished internal seams.',
    fabric: raw.fabric || raw.material || '480 GSM Double-Faced Virgin Wool & Technical Silk',
    rating: raw.rating || 4.9,
    reviewsCount: raw.reviewsCount || raw.reviews || 28,
    isNew: Boolean(raw.isNew || raw.badge === 'New' || idx < 3),
  };
}

export function useAtelierBridge() {
  const cartStore = useCartStore() as any;
  const uiStore = useUIStore() as any;
  const productsStore = useProductsStore() as any;
  const themeStore = useThemeStore() as any;
  const fb = useFallbackStore();

  // Normalized Products
  const rawProducts: any[] = productsStore.products || [];
  const products = rawProducts.map((p, i) => normalizeProduct(p, i)).filter(Boolean);

  // Cart State & Actions
  const rawCartItems: any[] = cartStore.items || cartStore.cart || [];
  const cartItems = rawCartItems.map((item, idx) => {
    const prod = item.product ? normalizeProduct(item.product, idx) : normalizeProduct(item, idx);
    return {
      ...prod,
      ...item,
      id: prod?.id || item.id,
      name: prod?.name || item.name,
      price: Number(prod?.price ?? item.price ?? 420),
      image: prod?.image || item.image,
      images: prod?.images || [item.image],
      size: item.selectedSize || item.size || 'M',
      selectedSize: item.selectedSize || item.size || 'M',
      color:
        typeof (item.selectedColor || item.color) === 'object'
          ? (item.selectedColor || item.color).name
          : item.selectedColor || item.color || 'Obsidian',
      quantity: Number(item.quantity || 1),
    };
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Drawer & Modal Visibility
  const isCartOpen = Boolean(uiStore.isCartOpen ?? uiStore.cartOpen ?? fb.cartOpen);
  const isSearchOpen = Boolean(uiStore.isSearchOpen ?? uiStore.searchOpen ?? fb.searchOpen);
  const isWishlistOpen = Boolean(uiStore.isWishlistOpen ?? uiStore.wishlistOpen ?? fb.wishlistOpen);
  const isMobileNavOpen = Boolean(uiStore.isMobileNavOpen ?? uiStore.mobileNavOpen ?? fb.mobileNavOpen);
  const isSizeGuideOpen = Boolean(uiStore.isSizeGuideOpen ?? uiStore.sizeGuideOpen ?? fb.sizeGuideOpen);
  const quickViewProduct = normalizeProduct(
    uiStore.quickViewProduct ?? uiStore.selectedProduct ?? fb.quickViewProduct
  );

  const openCart = () => {
    fb.setCartOpen(true);
    uiStore.openCart?.();
    uiStore.setCartOpen?.(true);
  };
  const closeCart = () => {
    fb.setCartOpen(false);
    uiStore.closeCart?.();
    uiStore.setCartOpen?.(false);
  };

  const openSearch = () => {
    fb.setSearchOpen(true);
    uiStore.openSearch?.();
    uiStore.setSearchOpen?.(true);
  };
  const closeSearch = () => {
    fb.setSearchOpen(false);
    uiStore.closeSearch?.();
    uiStore.setSearchOpen?.(false);
  };

  const openWishlist = () => {
    fb.setWishlistOpen(true);
    uiStore.openWishlist?.();
    uiStore.setWishlistOpen?.(true);
  };
  const closeWishlist = () => {
    fb.setWishlistOpen(false);
    uiStore.closeWishlist?.();
    uiStore.setWishlistOpen?.(false);
  };

  const openMobileNav = () => {
    fb.setMobileNavOpen(true);
    uiStore.openMobileNav?.();
    uiStore.setMobileNavOpen?.(true);
  };
  const closeMobileNav = () => {
    fb.setMobileNavOpen(false);
    uiStore.closeMobileNav?.();
    uiStore.setMobileNavOpen?.(false);
  };

  const openSizeGuide = () => {
    fb.setSizeGuideOpen(true);
    uiStore.openSizeGuide?.();
    uiStore.setSizeGuideOpen?.(true);
  };
  const closeSizeGuide = () => {
    fb.setSizeGuideOpen(false);
    uiStore.closeSizeGuide?.();
    uiStore.setSizeGuideOpen?.(false);
  };

  const openQuickView = (product: any) => {
    const norm = normalizeProduct(product);
    fb.setQuickViewProduct(norm);
    uiStore.openQuickView?.(norm);
    uiStore.setQuickViewProduct?.(norm);
  };
  const closeQuickView = () => {
    fb.setQuickViewProduct(null);
    uiStore.closeQuickView?.();
    uiStore.setQuickViewProduct?.(null);
  };

  // Universal Add to Cart (handles all possible store signatures)
  const addToCart = (rawProduct: any, size = 'M', color = 'Obsidian', quantity = 1) => {
    const p = normalizeProduct(rawProduct);
    if (!p) return;
    const colorStr = typeof color === 'object' ? (color as any).name : color;

    if (typeof cartStore.addItem === 'function') {
      try {
        if (cartStore.addItem.length >= 2) {
          cartStore.addItem(p, size, colorStr, quantity);
        } else {
          cartStore.addItem({
            ...p,
            product: p,
            id: p.id,
            size,
            selectedSize: size,
            color: colorStr,
            selectedColor: colorStr,
            quantity,
          });
        }
      } catch {
        cartStore.addItem({ ...p, size, selectedSize: size, color: colorStr, selectedColor: colorStr, quantity });
      }
    } else if (typeof cartStore.addToCart === 'function') {
      cartStore.addToCart(p, quantity, size, colorStr);
    }
  };

  const updateCartQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    if (typeof cartStore.updateQuantity === 'function') {
      cartStore.updateQuantity(id, quantity, size, color);
    }
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    if (typeof cartStore.removeItem === 'function') {
      cartStore.removeItem(id, size, color);
    } else if (typeof cartStore.removeFromCart === 'function') {
      cartStore.removeFromCart(id, size, color);
    }
  };

  // Universal Wishlist
  const toggleWishlist = (productId: string) => {
    fb.toggleWishlistId(String(productId));
    productsStore.toggleWishlist?.(productId);
  };

  const isWishlisted = (productId: string) => {
    return fb.wishlistIds.includes(String(productId));
  };

  const wishlistProducts = products.filter((p) => fb.wishlistIds.includes(String(p.id)));

  // Theme Toggle
  const toggleTheme = () => {
    if (typeof themeStore.toggleTheme === 'function') {
      themeStore.toggleTheme();
    } else {
      document.documentElement.classList.toggle('dark');
    }
  };

  return {
    products,
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart: cartStore.clearCart,
    isCartOpen,
    openCart,
    closeCart,
    isSearchOpen,
    openSearch,
    closeSearch,
    isWishlistOpen,
    openWishlist,
    closeWishlist,
    isMobileNavOpen,
    openMobileNav,
    closeMobileNav,
    isSizeGuideOpen,
    openSizeGuide,
    closeSizeGuide,
    quickViewProduct,
    openQuickView,
    closeQuickView,
    toggleWishlist,
    isWishlisted,
    wishlistProducts,
    wishlistCount: wishlistProducts.length,
    toggleTheme,
  };
}
