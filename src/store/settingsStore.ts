import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  storeName: string;
  supportEmail: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  updateSettings: (fields: Partial<Omit<SettingsState, "updateSettings">>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      storeName: "ATELIER",
      supportEmail: "hello@atelier.com",
      freeShippingThreshold: 25000,
      standardShippingCost: 499,
      updateSettings: (fields) => set(fields),
    }),
    { name: "atelier-settings-v2", version: 1 }
  )
);
