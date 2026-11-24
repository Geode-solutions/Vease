// Settings of Vease kept by the desktop app in settings.json (userData folder): its browser storage is cleared
// On every launch. Pure helpers and IPC types, free of Electron imports so they can be unit tested and shared with
// The renderer. The browser keeps them in its local storage (see app/composables/app_setting.ts).

type ColorTheme = "light" | "dark";

// A CRS as the back lists it, kept for the favorites and the history of the CRS selector
interface CrsEntry {
  authority: string;
  code: string;
  name: string;
}

interface AppSettings {
  colorTheme?: ColorTheme;
  crsFavorites?: CrsEntry[];
  crsHistory?: CrsEntry[];
}

const CRS_LIST_KEYS = ["crsFavorites", "crsHistory"] as const;

function isColorTheme(value: unknown): value is ColorTheme {
  return value === "light" || value === "dark";
}

function isCrsEntry(value: unknown): value is CrsEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return ["authority", "code", "name"].every(
    (field) => typeof Reflect.get(value, field) === "string",
  );
}

// The valid entries of a CRS list, with their three fields only; undefined when it is not a list
function sanitizeCrsList(raw: unknown): CrsEntry[] | undefined {
  if (!Array.isArray(raw)) {
    return undefined;
  }
  return raw
    .filter((entry) => isCrsEntry(entry))
    .map(({ authority, code, name }) => ({ authority, code, name }));
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
  for (const key of CRS_LIST_KEYS) {
    const list = sanitizeCrsList(Reflect.get(raw, key));
    if (list !== undefined) {
      settings[key] = list;
    }
  }
  return settings;
}

export type { AppSettings, ColorTheme, CrsEntry };
export { isColorTheme, sanitizeAppSettings };
