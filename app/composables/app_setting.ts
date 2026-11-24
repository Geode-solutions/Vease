import { type AppSettings, sanitizeAppSettings } from "~~/electron/app_settings_utils";
import type { Ref } from "vue";
import { useLocalStorage } from "@vueuse/core";

type SettingKey = keyof AppSettings;
type SettingValue<Key extends SettingKey> = NonNullable<AppSettings[Key]>;

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

// One ref per setting shared by every caller, as the local storage refs are kept in sync in the browser
const desktopSettings = new WeakMap<DesktopSettingsAPI, Map<SettingKey, Ref<unknown>>>();

// The stored value when it is valid for this setting, the fallback otherwise
function sanitizedSetting<Key extends SettingKey>(
  key: Key,
  value: unknown,
  fallback: SettingValue<Key>,
): SettingValue<Key> {
  const settings: AppSettings = sanitizeAppSettings({ [key]: value });
  const sanitized = settings[key];
  return sanitized ?? fallback;
}

// Strings stay raw (the color theme is stored as `dark`), the other values are JSON
function parseStored(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function browserSetting<Key extends SettingKey>(
  key: Key,
  storageKey: string,
  fallback: SettingValue<Key>,
): Ref<SettingValue<Key>> {
  return useLocalStorage<SettingValue<Key>>(storageKey, fallback, {
    serializer: {
      read: (raw: string): SettingValue<Key> => sanitizedSetting(key, parseStored(raw), fallback),
      write: (value: SettingValue<Key>): string => {
        if (typeof value === "string") {
          return value;
        }
        return JSON.stringify(value);
      },
    },
  });
}

// A copy without Vue proxies: toRaw only unwraps the outer one, not the elements a filter or a spread returns
function toPlain(value: unknown): unknown {
  const raw: unknown = toRaw(value);
  if (Array.isArray(raw)) {
    return raw.map((item: unknown) => toPlain(item));
  }
  if (typeof raw === "object" && raw !== null) {
    return Object.fromEntries(
      Object.entries(raw).map(([entryKey, entryValue]) => [entryKey, toPlain(entryValue)]),
    );
  }
  return raw;
}

// The desktop app clears its browser storage on every launch: the settings live in its settings.json, read before
// The page renders and written on every change, nested ones included. The browser keeps them in its local storage.
function useAppSetting<Key extends SettingKey>(
  key: Key,
  storageKey: string,
  fallback: SettingValue<Key>,
): Ref<SettingValue<Key>> {
  const globalScope = globalThis;
  if (!hasDesktopSettingsAPI(globalScope)) {
    return browserSetting(key, storageKey, fallback);
  }
  const api = globalScope.electronAPI;
  let settings = desktopSettings.get(api);
  if (!settings) {
    settings = new Map();
    desktopSettings.set(api, settings);
  }
  const shared = settings.get(key);
  if (shared) {
    // oxlint-disable-next-line no-unsafe-type-assertion -- the map holds the ref created below for this key
    return shared as Ref<SettingValue<Key>>;
  }
  const saved: AppSettings = sanitizeAppSettings(api.app_settings);
  // oxlint-disable-next-line no-unsafe-type-assertion -- ref() unwraps the value type, which a generic setting cannot express
  const setting = ref(saved[key] ?? fallback) as Ref<SettingValue<Key>>;
  // Detached: the first caller's unmount must not stop the saving
  effectScope(true).run(() => {
    watch(
      setting,
      (value) => {
        // Electron cannot send Vue proxies, which a nested value may hold at any depth
        void api.app_settings_write({ [key]: toPlain(value) });
      },
      { deep: true },
    );
  });
  settings.set(key, setting);
  return setting;
}

export { useAppSetting };
