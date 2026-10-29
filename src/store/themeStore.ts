// src/store/themeStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';
export type Theme = ThemeMode;

interface ThemeState {
  theme: ThemeMode;
  isDark: boolean;
  ledgerXRay: boolean;
  soundEnabled: boolean;
  _hasHydrated: boolean;
}

interface ThemeActions {
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  toggleLedgerXRay: () => void;
  toggleSound: () => void;
  setHasHydrated: (state: boolean) => void;
}

const applyDomAttributes = (theme: ThemeMode, ledgerXRay: boolean) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-ledger', String(ledgerXRay));
};

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isDark: false,
      ledgerXRay: false,
      soundEnabled: true,
      _hasHydrated: false,

      setTheme: (theme) => {
        applyDomAttributes(theme, get().ledgerXRay);
        set({ theme, isDark: theme === 'dark' });
      },
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        applyDomAttributes(next, get().ledgerXRay);
        set({ theme: next, isDark: next === 'dark' });
      },
      toggleLedgerXRay: () => {
        const nextLedger = !get().ledgerXRay;
        applyDomAttributes(get().theme, nextLedger);
        set({ ledgerXRay: nextLedger });
      },
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'atelier-theme-preferences',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyDomAttributes(state.theme, state.ledgerXRay);
          state.setHasHydrated(true);
        }
      },
    }
  )
);

export default useThemeStore;
