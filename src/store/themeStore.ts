import { create } from "zustand";

export type Theme = "dark" | "light";

const STORAGE_KEY = "atelier_theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem("atelier-theme");
    if (stored === "dark" || stored === "light") return stored;
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  } catch (e) {}
  return "light";
}

function applyTheme(theme: Theme) {
  if (typeof window === "undefined" || !window.document) return;
  const root = window.document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
    window.localStorage.setItem("atelier-theme", theme);
  } catch (e) {}
}

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  isDark: getInitialTheme() === "dark",

  setTheme: (t: Theme) => {
    applyTheme(t);
    set({ theme: t, isDark: t === "dark" });
  },

  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
}));

if (typeof window !== "undefined") {
  applyTheme(getInitialTheme());
}

export default useThemeStore;
