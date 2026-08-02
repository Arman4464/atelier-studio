import { useThemeStore } from "../store/themeStore";

const DARK = {
  indigo: "#4553ff",
  indigoGlow: "#7c86ff",
  brass: "#c9a15d",
  zest: "#ffd23f",
  flame: "#ff5b39",
  line: "#2a2a2d",
  inkDim: "#98978d",
  ink: "#f5f4ef",
  voidTwo: "#151517",
};

const LIGHT = {
  indigo: "#4553ff",
  indigoGlow: "#3644d6",
  brass: "#755a2c",
  zest: "#e8a93a",
  flame: "#b84b31",
  line: "#d2c7a6",
  inkDim: "#6b6653",
  ink: "#1b1a13",
  voidTwo: "#e4dcc6",
};

/** Literal (non-CSS-variable) colors matching the active theme, for use in recharts. */
export function useChartColors() {
  const theme = useThemeStore((s) => s.theme);
  return theme === "light" ? LIGHT : DARK;
}

export const CHART_SERIES = ["#4553ff", "#c9a15d", "#e8a93a", "#7c86ff", "#b84b31"];
