import type { ComputedRef, Ref } from "vue";
import { useAppSetting } from "@vease/composables/app_setting";
import { useTheme } from "vuetify";

import { DARK_THEME_NAME, LIGHT_THEME_NAME } from "@vease/utils/brand_themes";

type ColorTheme = typeof LIGHT_THEME_NAME | typeof DARK_THEME_NAME;

const STORAGE_KEY = "vease-color-theme";

interface ColorThemeApi {
  colorTheme: Ref<ColorTheme>;
  isDark: ComputedRef<boolean>;
  applyStoredColorTheme: () => void;
  setColorTheme: (name: ColorTheme) => void;
  toggleColorTheme: () => void;
}

function useColorTheme(): ColorThemeApi {
  const theme = useTheme();
  // Saved in settings.json in the desktop app, in the local storage in the browser
  const colorTheme = useAppSetting("colorTheme", STORAGE_KEY, LIGHT_THEME_NAME);
  const isDark = computed(() => theme.global.current.value.dark);

  function setColorTheme(name: ColorTheme): void {
    colorTheme.value = name;
    void theme.change(name);
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
export { useColorTheme };
