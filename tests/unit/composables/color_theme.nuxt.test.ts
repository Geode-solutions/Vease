import {
  DARK_THEME_NAME,
  LIGHT_THEME_NAME,
  darkTheme,
  lightTheme,
} from "@vease/utils/brand_themes";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { defineComponent, nextTick } from "vue";
import type { AppSettings } from "~~/electron/app_settings_utils";
import { createVuetify } from "vuetify";
import { mount } from "@vue/test-utils";
import { useColorTheme } from "@vease/composables/color_theme";

vi.setConfig({ testTimeout: 10_000 });

const STORAGE_KEY = "vease-color-theme";

function withVuetify(): ReturnType<typeof useColorTheme> {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: LIGHT_THEME_NAME,
      themes: { [LIGHT_THEME_NAME]: lightTheme, [DARK_THEME_NAME]: darkTheme },
    },
  });
  const holder: { api?: ReturnType<typeof useColorTheme> } = {};
  mount(
    defineComponent({
      setup() {
        holder.api = useColorTheme();
        return {};
      },
      template: "<div />",
    }),
    { global: { plugins: [vuetify] } },
  );
  if (holder.api === undefined) {
    throw new Error("useColorTheme was not called");
  }
  return holder.api;
}

describe("color theme", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("defaults to the light theme", () => {
    const { colorTheme, isDark } = withVuetify();

    expect(colorTheme.value).toBe(LIGHT_THEME_NAME);
    expect(isDark.value).toBe(false);
  });

  test("toggles between light and dark and remembers the choice", async () => {
    const { isDark, toggleColorTheme } = withVuetify();

    toggleColorTheme();
    await nextTick();
    expect(isDark.value).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(DARK_THEME_NAME);

    toggleColorTheme();
    await nextTick();
    expect(isDark.value).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(LIGHT_THEME_NAME);
  });

  test("applies the stored theme", () => {
    localStorage.setItem(STORAGE_KEY, DARK_THEME_NAME);
    const { applyStoredColorTheme, isDark } = withVuetify();

    applyStoredColorTheme();
    expect(isDark.value).toBe(true);
  });

  test("falls back to light on an unknown stored value", () => {
    localStorage.setItem(STORAGE_KEY, "solarized");
    const { applyStoredColorTheme, isDark } = withVuetify();

    applyStoredColorTheme();
    expect(isDark.value).toBe(false);
  });
});

describe("color theme on desktop", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "electronAPI");
  });

  test("reads the saved theme and saves the choice in the settings file", async () => {
    const writeSettings = vi.fn<(settings: AppSettings) => Promise<unknown>>();
    Object.assign(globalThis, {
      electronAPI: {
        app_settings: { colorTheme: DARK_THEME_NAME },
        app_settings_write: writeSettings,
      },
    });
    const { applyStoredColorTheme, isDark, toggleColorTheme } = withVuetify();

    applyStoredColorTheme();
    expect(isDark.value).toBe(true);
    toggleColorTheme();
    await nextTick();
    expect(writeSettings).toHaveBeenCalledWith({ colorTheme: LIGHT_THEME_NAME });
    // The browser storage of the desktop app is cleared on every launch: not used
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  test("falls back to light on invalid saved settings", () => {
    Object.assign(globalThis, {
      electronAPI: {
        app_settings: { colorTheme: "solarized" },
        app_settings_write: vi.fn<() => Promise<unknown>>(),
      },
    });
    const { applyStoredColorTheme, isDark } = withVuetify();

    applyStoredColorTheme();
    expect(isDark.value).toBe(false);
  });
});
