import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DiscountType = "percentage" | "fixed";

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  active: boolean;
  expiresAt: string | null;
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
}

function uid(): string {
  return `disc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface DiscountsState {
  discounts: Discount[];
  addDiscount: (d: Omit<Discount, "id" | "usageCount" | "createdAt">) => void;
  updateDiscount: (id: string, fields: Partial<Omit<Discount, "id">>) => void;
  deleteDiscount: (id: string) => void;
  toggleActive: (id: string) => void;

  /** Validates a code at checkout and, if valid, returns the discount and records a use. */
  redeem: (code: string) => { ok: true; discount: Discount } | { ok: false; error: string };
}

export const useDiscountsStore = create<DiscountsState>()(
  persist(
    (set, get) => ({
      discounts: [
        {
          id: "disc-welcome10",
          code: "WELCOME10",
          type: "percentage",
          value: 10,
          active: true,
          expiresAt: null,
          usageLimit: null,
          usageCount: 0,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],

      addDiscount: (d) => {
        set((state) => ({
          discounts: [...state.discounts, { ...d, id: uid(), usageCount: 0, createdAt: new Date().toISOString() }],
        }));
      },

      updateDiscount: (id, fields) => {
        set((state) => ({
          discounts: state.discounts.map((d) => (d.id === id ? { ...d, ...fields } : d)),
        }));
      },

      deleteDiscount: (id) => set((state) => ({ discounts: state.discounts.filter((d) => d.id !== id) })),

      toggleActive: (id) => {
        set((state) => ({
          discounts: state.discounts.map((d) => (d.id === id ? { ...d, active: !d.active } : d)),
        }));
      },

      redeem: (code) => {
        const normalized = code.trim().toUpperCase();
        const discount = get().discounts.find((d) => d.code === normalized);
        if (!discount) return { ok: false, error: "That code isn't valid." };
        if (!discount.active) return { ok: false, error: "That code is no longer active." };
        if (discount.expiresAt && new Date(discount.expiresAt).getTime() < Date.now()) {
          return { ok: false, error: "That code has expired." };
        }
        if (discount.usageLimit != null && discount.usageCount >= discount.usageLimit) {
          return { ok: false, error: "That code has reached its usage limit." };
        }
        set((state) => ({
          discounts: state.discounts.map((d) => (d.id === discount.id ? { ...d, usageCount: d.usageCount + 1 } : d)),
        }));
        return { ok: true, discount };
      },
    }),
    { name: "atelier-discounts-v2", version: 1 }
  )
);
