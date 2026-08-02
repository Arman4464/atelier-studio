import { create } from "zustand";

export type Theme = "dark" | "light";

const STORAGE_KEY = "atelier-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

function applyThemeClass(theme: Theme) {
  const root = window.document.documentElement;
  root.classList.toggle("light", theme === "light");
}

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

  setTheme: (t) => {
    applyThemeClass(t);
    window.localStorage.setItem(STORAGE_KEY, t);
    set({ theme: t });
  },

  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
}));

// Apply the persisted (or default) theme to <html> as soon as this module
// loads, so there's no flash of the wrong theme on first paint.
if (typeof window !== "undefined") {
  applyThemeClass(getInitialTheme());
}
