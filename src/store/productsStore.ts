import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts, type Product } from "../data/products";

interface ProductsState {
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => Product;
  updateProduct: (id: number, fields: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  adjustStock: (id: number, delta: number) => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: seedProducts,

      addProduct: (p) => {
        const nextId = get().products.reduce((max, x) => Math.max(max, x.id), 0) + 1;
        const newProduct: Product = { ...p, id: nextId };
        set((state) => ({ products: [...state.products, newProduct] }));
        return newProduct;
      },

      updateProduct: (id, fields) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...fields } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },

      adjustStock: (id, delta) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)),
        }));
      },
    }),
    { name: "atelier-products-v2", version: 1 }
  )
);

/** Non-reactive lookup for use inside event handlers / callbacks. */
export function getProductById(id: number): Product | undefined {
  return useProductsStore.getState().products.find((p) => p.id === id);
}
