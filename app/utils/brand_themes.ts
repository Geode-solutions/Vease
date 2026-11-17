// Geode Solutions brand identity (brand book 2025): palette and the two Vuetify themes built on it.
// Imported by nuxt.config.ts, so it must stay free of Nuxt/Vue runtime imports.

const BRAND_COLORS = {
  vertPlatine: "#3E6965",
  vertNoir: "#0C2825",
  bleuFumee: "#B2C5CC",
  bleuHorizon: "#31444B",
  beige: "#EEEBE7",
  anthracite: "#1E1E1E",
  orange: "#F48830",
  rougeGothique: "#5C3236",
  roseQuartz: "#BE8388",
  auburn: "#47250A",
} as const;

const LIGHT_THEME_NAME = "light";
const DARK_THEME_NAME = "dark";

// Tone on tone: every surface stays in the hue of its background (beige in light, green black in dark),
// Only the value changes. Tints come from the brand "palette de travail" (each color mixed with white/black).
const lightTheme = {
  dark: false,
  colors: {
    background: "#DFDAD2",
    "on-background": BRAND_COLORS.anthracite,
    surface: BRAND_COLORS.beige,
    "on-surface": BRAND_COLORS.anthracite,
    "surface-bright": "#F4F2EF",
    "surface-light": "#E6E2DB",
    "surface-variant": BRAND_COLORS.vertNoir,
    "on-surface-variant": BRAND_COLORS.beige,
    primary: BRAND_COLORS.vertPlatine,
    "on-primary": BRAND_COLORS.beige,
    secondary: BRAND_COLORS.vertNoir,
    "on-secondary": BRAND_COLORS.beige,
    accent: BRAND_COLORS.orange,
    "on-accent": BRAND_COLORS.anthracite,
    error: "#A8402F",
    info: BRAND_COLORS.bleuHorizon,
    success: "#3E7556",
    warning: BRAND_COLORS.orange,
  },
  variables: {
    "border-color": BRAND_COLORS.vertNoir,
    "border-opacity": 0.16,
    "high-emphasis-opacity": 0.94,
    "medium-emphasis-opacity": 0.72,
    "hover-opacity": 0.06,
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: BRAND_COLORS.vertNoir,
    "on-background": BRAND_COLORS.beige,
    surface: "#12322E",
    "on-surface": BRAND_COLORS.beige,
    "surface-bright": "#1B413C",
    "surface-light": "#173A36",
    "surface-variant": BRAND_COLORS.beige,
    "on-surface-variant": BRAND_COLORS.vertNoir,
    primary: "#9EB4B2",
    "on-primary": BRAND_COLORS.vertNoir,
    secondary: "#C5D2D0",
    "on-secondary": BRAND_COLORS.vertNoir,
    accent: BRAND_COLORS.orange,
    "on-accent": BRAND_COLORS.anthracite,
    error: "#E8796E",
    info: BRAND_COLORS.bleuFumee,
    success: "#7FB89A",
    warning: BRAND_COLORS.orange,
  },
  variables: {
    "border-color": BRAND_COLORS.beige,
    "border-opacity": 0.14,
    "high-emphasis-opacity": 0.94,
    "medium-emphasis-opacity": 0.74,
    "hover-opacity": 0.08,
  },
};

interface RGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

// 3D viewer scene colors per theme, a step darker (light) or lighter (dark) than the app background
const VIEWER_SCENE_COLORS: Record<string, { background: RGBA; text: RGBA }> = {
  [LIGHT_THEME_NAME]: {
    background: { red: 206, green: 200, blue: 190, alpha: 1 },
    text: { red: 30, green: 30, blue: 30, alpha: 1 },
  },
  [DARK_THEME_NAME]: {
    background: { red: 24, green: 62, blue: 58, alpha: 1 },
    text: { red: 238, green: 235, blue: 231, alpha: 1 },
  },
};

export type { RGBA };
export {
  BRAND_COLORS,
  DARK_THEME_NAME,
  LIGHT_THEME_NAME,
  VIEWER_SCENE_COLORS,
  darkTheme,
  lightTheme,
};
