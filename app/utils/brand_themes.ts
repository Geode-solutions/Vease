// Geode Solutions brand identity (brand book 2025): palette and the two Vuetify themes built on it.
// Imported by nuxt.config.ts, so it must stay free of Nuxt/Vue runtime imports (type imports are erased).
import type { ColorRGBA } from "@geode/opengeodeweb-viewer/schema_types";

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

// Tone on tone, with the brand book pairs: light = Bleu Fumée + Bleu Horizon (business cards, "Typographie"),
// Dark = Vert Noir + Vert Platine ("Vocabulaire graphique"). Surfaces only change in value, never in hue; Orange is
// The single accent. Tints come from the brand "palette de travail" (each color mixed with white or black).
// Text takes the app icon pair (Vert Noir on Bleu Fumée) both ways: Vert Noir on the light theme, Bleu Fumée on
// The dark one.
const HORIZON_INK = "#1F2E33";
const LIGHT_TEXT = BRAND_COLORS.vertNoir;
const DARK_TEXT = BRAND_COLORS.bleuFumee;

// Activity source badges that have no matching role in the palette: the same brand pairs on both themes
const ACTIVITY_SOURCE_COLORS = {
  "activity-viewer": BRAND_COLORS.vertPlatine,
  "on-activity-viewer": "#E8EEF0",
  "activity-extension": BRAND_COLORS.roseQuartz,
  "on-activity-extension": BRAND_COLORS.anthracite,
};

const lightTheme = {
  dark: false,
  colors: {
    background: BRAND_COLORS.bleuFumee,
    "on-background": LIGHT_TEXT,
    surface: "#D9E3E6",
    "on-surface": LIGHT_TEXT,
    "surface-bright": "#E8EEF0",
    "surface-light": "#CAD7DB",
    "surface-variant": BRAND_COLORS.bleuHorizon,
    "on-surface-variant": "#E8EEF0",
    primary: BRAND_COLORS.bleuHorizon,
    "on-primary": "#E8EEF0",
    secondary: HORIZON_INK,
    "on-secondary": "#E8EEF0",
    accent: BRAND_COLORS.orange,
    "on-accent": BRAND_COLORS.anthracite,
    error: "#8F3326",
    info: BRAND_COLORS.bleuHorizon,
    success: "#2E6448",
    ...ACTIVITY_SOURCE_COLORS,
    warning: BRAND_COLORS.orange,
  },
  variables: {
    "border-color": BRAND_COLORS.bleuHorizon,
    "border-opacity": 0.2,
    "high-emphasis-opacity": 0.96,
    "medium-emphasis-opacity": 0.76,
    "hover-opacity": 0.06,
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: BRAND_COLORS.vertNoir,
    "on-background": DARK_TEXT,
    surface: "#12322E",
    "on-surface": DARK_TEXT,
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
    ...ACTIVITY_SOURCE_COLORS,
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

// 3D viewer scene colors: a single blue-grey from the Bleu Fumée family for both themes, so data looks the
// Same whatever the app theme, with Horizon ink for the scene text (axes labels, scale).
const VIEWER_SCENE_COLORS: { background: ColorRGBA; text: ColorRGBA } = {
  background: { red: 160, green: 180, blue: 187, alpha: 1 },
  text: { red: 31, green: 46, blue: 51, alpha: 1 },
};

export {
  BRAND_COLORS,
  DARK_THEME_NAME,
  LIGHT_THEME_NAME,
  VIEWER_SCENE_COLORS,
  darkTheme,
  lightTheme,
};
