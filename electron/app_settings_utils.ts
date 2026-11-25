// Settings of Vease kept by the desktop app in settings.json (userData folder): its browser storage is cleared
// On every launch. Pure helpers and IPC types, free of Electron imports so they can be unit tested and shared with
// The renderer. The main process stores any setting as is: the renderer declares and checks each one
// (see @ogw_front/composables/user_setting). The browser keeps them in its local storage.

type AppSettings = Record<string, unknown>;

// The settings of a parsed settings.json (or of an IPC message): an object, anything else gives no settings
function sanitizeAppSettings(raw: unknown): AppSettings {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {};
  }
  return { ...raw };
}

export type { AppSettings };
export { sanitizeAppSettings };
