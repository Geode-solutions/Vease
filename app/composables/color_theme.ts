import { type AppSettings, sanitizeAppSettings } from "~~/electron/app_settings_utils";
import type { ComputedRef, Ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useTheme } from "vuetify";

import { DARK_THEME_NAME, LIGHT_THEME_NAME } from "@vease/utils/brand_themes";

type ColorTheme = typeof LIGHT_THEME_NAME | typeof DARK_THEME_NAME;

const STORAGE_KEY = "vease-color-theme";
// Set on the root element while the theme changes: no CSS transition runs (see main.css)
const SWITCHING_CLASS = "vease-theme-switching";

interface ColorThemeApi {
  colorTheme: Ref<ColorTheme>;
  isDark: ComputedRef<boolean>;
  applyStoredColorTheme: () => void;
  setColorTheme: (name: ColorTheme) => void;
  toggleColorTheme: () => void;
}

interface DesktopSettingsAPI {
  app_settings: unknown;
  app_settings_write: (settings: AppSettings) => Promise<unknown>;
}

function hasDesktopSettingsAPI(
  value: typeof globalThis,
): value is typeof globalThis & { electronAPI: DesktopSettingsAPI } {
  return (
    "electronAPI" in value &&
    typeof value.electronAPI === "object" &&
    value.electronAPI !== null &&
    "app_settings_write" in value.electronAPI
  );
}

// One ref shared by every caller, as the local storage ref is in the browser
const desktopColorThemes = new WeakMap<DesktopSettingsAPI, Ref<ColorTheme>>();

// The desktop app clears its browser storage on every launch: the choice lives in its settings.json, read before
// The page renders and written on every change. The browser keeps it in its local storage.
function storedColorTheme(): Ref<ColorTheme> {
  const globalScope = globalThis;
  if (!hasDesktopSettingsAPI(globalScope)) {
    return useLocalStorage<ColorTheme>(STORAGE_KEY, LIGHT_THEME_NAME);
  }
  const api = globalScope.electronAPI;
  const shared = desktopColorThemes.get(api);
  if (shared) {
    return shared;
  }
  const theme = ref<ColorTheme>(
    sanitizeAppSettings(api.app_settings).colorTheme ?? LIGHT_THEME_NAME,
  );
  // Detached: the first caller's unmount must not stop the saving
  effectScope(true).run(() => {
    watch(theme, (colorTheme) => {
      void api.app_settings_write({ colorTheme });
    });
  });
  desktopColorThemes.set(api, theme);
  return theme;
}

async function nextFrames(): Promise<void> {
  // oxlint-disable-next-line promise/avoid-new -- requestAnimationFrame has no promise form
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

let pendingSwitches = 0;

// Every color of the app changes at once. With the CSS transitions on, the Chromium of the desktop app sometimes
// Crashed computing the transitions of the new colors: renderer gone, white window until a relaunch (Vease#922).
// They are off until the new theme is painted, which also switches all the colors together.
async function switchWithoutTransitions(change: () => void): Promise<void> {
  const root = document.documentElement;
  pendingSwitches += 1;
  root.classList.add(SWITCHING_CLASS);
  try {
    change();
    await nextTick();
    await nextFrames();
  } finally {
    pendingSwitches -= 1;
    if (pendingSwitches === 0) {
      root.classList.remove(SWITCHING_CLASS);
    }
  }
}

function useColorTheme(): ColorThemeApi {
  const theme = useTheme();
  const colorTheme = storedColorTheme();
  const isDark = computed(() => theme.global.current.value.dark);

  function setColorTheme(name: ColorTheme): void {
    colorTheme.value = name;
    void switchWithoutTransitions(() => {
      void theme.change(name);
    });
  }

  function applyStoredColorTheme(): void {
    const stored = colorTheme.value === DARK_THEME_NAME ? DARK_THEME_NAME : LIGHT_THEME_NAME;
    void theme.change(stored);
  }

  function toggleColorTheme(): void {
    setColorTheme(isDark.value ? LIGHT_THEME_NAME : DARK_THEME_NAME);
  }

  return { colorTheme, isDark, applyStoredColorTheme, setColorTheme, toggleColorTheme };
}

export type { ColorTheme };
export { SWITCHING_CLASS, useColorTheme };
