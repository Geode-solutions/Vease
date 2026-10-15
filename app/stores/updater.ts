import type {
  UpdateChannel,
  UpdateSettings,
  UpdaterInitialState,
  UpdaterStatus,
} from "~~/electron/updater_utils";

interface DesktopUpdaterAPI {
  updater_get_state: () => Promise<UpdaterInitialState>;
  updater_list_versions: () => Promise<string[]>;
  updater_set_settings: (args: UpdateSettings) => Promise<void>;
  updater_check: () => Promise<void>;
  updater_quit_and_install: () => Promise<void>;
  on_updater_status: (callback: (status: UpdaterStatus) => void) => () => void;
}

function hasDesktopUpdaterAPI(
  value: typeof globalThis,
): value is typeof globalThis & { electronAPI: DesktopUpdaterAPI } {
  return (
    "electronAPI" in value &&
    typeof value.electronAPI === "object" &&
    value.electronAPI !== null &&
    "updater_get_state" in value.electronAPI
  );
}

function getDesktopUpdaterAPI(): DesktopUpdaterAPI | undefined {
  const globalScope = globalThis;
  return hasDesktopUpdaterAPI(globalScope) ? globalScope.electronAPI : undefined;
}

function isUpdaterAvailable(): boolean {
  return getDesktopUpdaterAPI() !== undefined;
}

const useUpdaterStore = defineStore("Updater", () => {
  const api = getDesktopUpdaterAPI();
  const status = ref<UpdaterStatus>({ state: "idle" });
  const channel = ref<UpdateChannel>("master");
  const pinnedVersion = ref<string | undefined>(undefined);
  // The startup check runs in the background and fails silently; errors are only reported
  // Once the user has asked for an update
  const notifyErrors = ref(false);
  let initialized = false;

  async function init(): Promise<void> {
    if (!api || initialized) {
      return;
    }
    initialized = true;
    api.on_updater_status((newStatus) => {
      status.value = newStatus;
    });
    const state = await api.updater_get_state();
    channel.value = state.channel;
    pinnedVersion.value = state.pinnedVersion;
    status.value = state.status;
  }

  async function listVersions(): Promise<string[]> {
    return (await api?.updater_list_versions()) ?? [];
  }

  async function saveSettings(settings: UpdateSettings): Promise<void> {
    channel.value = settings.channel;
    pinnedVersion.value = settings.pinnedVersion;
    notifyErrors.value = true;
    await api?.updater_set_settings(settings);
  }

  async function check(): Promise<void> {
    notifyErrors.value = true;
    await api?.updater_check();
  }

  async function restart(): Promise<void> {
    await api?.updater_quit_and_install();
  }

  return {
    status,
    channel,
    pinnedVersion,
    notifyErrors,
    init,
    listVersions,
    saveSettings,
    check,
    restart,
  };
});

export { isUpdaterAvailable, useUpdaterStore };
export type { UpdateChannel, UpdaterState, UpdaterStatus } from "~~/electron/updater_utils";
