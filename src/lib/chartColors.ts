import { useThemeStore } from "../store/themeStore";

const DARK = {
  indigo: "#8B5CF6",
  indigoGlow: "#C084FC",
  brass: "#F59E0B",
  zest: "#EC4899",
  flame: "#F43F5E",
  line: "rgba(255, 255, 255, 0.1)",
  inkDim: "#A3A8B8",
  ink: "#F5F6FA",
  voidTwo: "#161822",
};

const LIGHT = {
  indigo: "#8B5CF6",
  indigoGlow: "#9333EA",
  brass: "#D97706",
  zest: "#EC4899",
  flame: "#E11D48",
  line: "rgba(15, 17, 23, 0.08)",
  inkDim: "#4B5060",
  ink: "#0F1117",
  voidTwo: "#FAF8F5",
};

/** Literal (non-CSS-variable) colors matching the active theme, for use in recharts. */
export function useChartColors() {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? DARK : LIGHT;
}

export const CHART_SERIES = ["#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4", "#10B981"];
