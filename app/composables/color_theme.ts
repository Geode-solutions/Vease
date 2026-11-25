import type { ComputedRef, Ref } from "vue";
import {
  defineUserSetting,
  useUserSetting,
} from "@ogw_front/composables/user_setting";
import { useTheme } from "vuetify";
import { z } from "zod";

import { DARK_THEME_NAME, LIGHT_THEME_NAME } from "@vease/utils/brand_themes";

type ColorTheme = typeof LIGHT_THEME_NAME | typeof DARK_THEME_NAME;

const STORAGE_KEY = "vease-color-theme";
// Saved in settings.json in the desktop app, in the local storage in the browser (kept as a raw string there)
const colorThemeSetting = defineUserSetting<ColorTheme>({
  key: "colorTheme",
  schema: z.enum([LIGHT_THEME_NAME, DARK_THEME_NAME]),
  fallback: LIGHT_THEME_NAME,
  browserKey: STORAGE_KEY,
});
// Set on the root element while the theme changes: no CSS transition runs (see main.css)
const SWITCHING_CLASS = "vease-theme-switching";

interface ColorThemeApi {
  colorTheme: Ref<ColorTheme>;
  isDark: ComputedRef<boolean>;
  applyStoredColorTheme: () => void;
  setColorTheme: (name: ColorTheme) => void;
  toggleColorTheme: () => void;
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
  const colorTheme = useUserSetting(colorThemeSetting);
  const isDark = computed(() => theme.global.current.value.dark);

  function setColorTheme(name: ColorTheme): void {
    colorTheme.value = name;
    void switchWithoutTransitions(() => {
      void theme.change(name);
    });
  }

  function applyStoredColorTheme(): void {
    const stored =
      colorTheme.value === DARK_THEME_NAME ? DARK_THEME_NAME : LIGHT_THEME_NAME;
    void theme.change(stored);
  }

  function toggleColorTheme(): void {
    setColorTheme(isDark.value ? LIGHT_THEME_NAME : DARK_THEME_NAME);
  }

  return {
    colorTheme,
    isDark,
    applyStoredColorTheme,
    setColorTheme,
    toggleColorTheme,
  };
}

export type { ColorTheme };
export { SWITCHING_CLASS, useColorTheme };
