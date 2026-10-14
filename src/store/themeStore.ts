import { create } from "zustand";

export type StudioTheme = "klein" | "verdigris" | "infrared" | "bauhaus";
export type Theme = StudioTheme | "dark" | "light";

export interface ThemeConfig {
  id: StudioTheme;
  name: string;
  tag: string;
  dotColor: string;
  accentColor: string;
  isDark: boolean;
}

export const THEMES: Record<StudioTheme, ThemeConfig> = {
  klein: {
    id: "klein",
    name: "Klein Titanium",
    tag: "T-01",
    dotColor: "#0038FF",
    accentColor: "#CEFF00",
    isDark: false,
  },
  verdigris: {
    id: "verdigris",
    name: "Jade & Molten Copper",
    tag: "T-02",
    dotColor: "#FF5100",
    accentColor: "#00FF9D",
    isDark: true,
  },
  infrared: {
    id: "infrared",
    name: "Obsidian Linea Rossa",
    tag: "T-03",
    dotColor: "#FF1730",
    accentColor: "#00E5FF",
    isDark: true,
  },
  bauhaus: {
    id: "bauhaus",
    name: "Chromatic Acid Studio",
    tag: "T-04",
    dotColor: "#2B00FF",
    accentColor: "#D9FF00",
    isDark: false,
  },
};

export const THEME_LIST: StudioTheme[] = ["klein", "verdigris", "infrared", "bauhaus"];

const PALETTE_KEY = "atelier_palette";
const LEGACY_KEY = "atelier-theme";

function getInitialPalette(): StudioTheme {
  if (typeof window === "undefined") return "klein";
  try {
    const stored = window.localStorage.getItem(PALETTE_KEY) as StudioTheme;
    if (stored && stored in THEMES) return stored;
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy === "dark") return "infrared";
  } catch (e) {}
  return "klein";
}

function applyThemeToDOM(palette: StudioTheme) {
  if (typeof window === "undefined" || !window.document) return;
  const root = window.document.documentElement;
  const config = THEMES[palette] || THEMES.klein;
  
  root.setAttribute("data-theme", palette);
  root.classList.toggle("dark", config.isDark);
  root.classList.toggle("light", !config.isDark);

  try {
    window.localStorage.setItem(PALETTE_KEY, palette);
    window.localStorage.setItem(LEGACY_KEY, config.isDark ? "dark" : "light");
  } catch (e) {}
}

interface ThemeState {
  theme: StudioTheme;
  palette: StudioTheme;
  isDark: boolean;
  setTheme: (t: StudioTheme | "dark" | "light") => void;
  setPalette: (t: StudioTheme) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialPalette(),
  palette: getInitialPalette(),
  isDark: THEMES[getInitialPalette()].isDark,

  setTheme: (t) => {
    let target: StudioTheme = "klein";
    if (t === "dark") target = "infrared";
    else if (t === "light") target = "klein";
    else if (t in THEMES) target = t as StudioTheme;

    applyThemeToDOM(target);
    set({
      theme: target,
      palette: target,
      isDark: THEMES[target].isDark,
    });
  },

  setPalette: (t) => {
    get().setTheme(t);
  },

  toggleTheme: () => {
    const current = get().theme;
    const next: StudioTheme = THEMES[current]?.isDark ? "klein" : "infrared";
    get().setTheme(next);
  },

  cycleTheme: () => {
    const current = get().theme;
    const idx = THEME_LIST.indexOf(current);
    const nextIdx = (idx + 1) % THEME_LIST.length;
    get().setTheme(THEME_LIST[nextIdx]);
  },
}));

// Apply theme immediately on script evaluation
if (typeof window !== "undefined") {
  applyThemeToDOM(getInitialPalette());
}

export default useThemeStore;
