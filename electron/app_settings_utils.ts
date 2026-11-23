// Settings of Vease kept by the desktop app in settings.json (userData folder): its browser storage is cleared
// On every launch. Pure helpers and IPC types, free of Electron imports so they can be unit tested and shared with
// The renderer. The browser keeps them in its local storage (see app/composables/color_theme.ts).

type ColorTheme = "light" | "dark";

interface AppSettings {
  colorTheme?: ColorTheme;
}

function isColorTheme(value: unknown): value is ColorTheme {
  return value === "light" || value === "dark";
}

// The known and valid settings of a parsed settings.json (or of an IPC message), the others dropped
function sanitizeAppSettings(raw: unknown): AppSettings {
  if (typeof raw !== "object" || raw === null) {
    return {};
  }
  const settings: AppSettings = {};
  const colorTheme: unknown = Reflect.get(raw, "colorTheme");
  if (isColorTheme(colorTheme)) {
    settings.colorTheme = colorTheme;
  }
  return settings;
}

export type { AppSettings, ColorTheme };
export { isColorTheme, sanitizeAppSettings };
