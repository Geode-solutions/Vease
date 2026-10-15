type UpdateChannel = "master" | "next";

type UpdaterState =
  | "idle"
  | "checking"
  | "available"
  | "not-available"
  | "downloading"
  | "downloaded"
  | "error"
  | "unsupported";

interface UpdaterStatus {
  state: UpdaterState;
  version?: string;
  percent?: number;
  bytesPerSecond?: number;
  transferred?: number;
  total?: number;
  message?: string;
}

interface UpdaterInitialState {
  currentVersion: string;
  channel: UpdateChannel;
  pinnedVersion?: string;
  status: UpdaterStatus;
}

interface DesktopUpdaterAPI {
  updater_get_state: () => Promise<UpdaterInitialState>;
  updater_list_versions: () => Promise<string[]>;
  updater_set_settings: (args: { channel: UpdateChannel; pinnedVersion?: string }) => Promise<void>;
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

async function check(): Promise<void> {
  await getDesktopUpdaterAPI()?.updater_check();
}

async function restart(): Promise<void> {
  await getDesktopUpdaterAPI()?.updater_quit_and_install();
}

// oxlint-disable-next-line max-lines-per-function
const useUpdaterStore = defineStore("Updater", () => {
  const status = ref<UpdaterStatus>({ state: "idle" });
  const currentVersion = ref("");
  const channel = ref<UpdateChannel>("master");
  const pinnedVersion = ref<string | undefined>(undefined);
  const versions = ref<string[]>([]);
  const initialized = ref(false);

  const isAvailable = computed(() => getDesktopUpdaterAPI() !== undefined);

  async function init(): Promise<void> {
    const api = getDesktopUpdaterAPI();
    if (!api || initialized.value) {
      return;
    }
    initialized.value = true;
    api.on_updater_status((newStatus) => {
      status.value = newStatus;
    });
    const state = await api.updater_get_state();
    currentVersion.value = state.currentVersion;
    channel.value = state.channel;
    pinnedVersion.value = state.pinnedVersion;
    status.value = state.status;
  }

  async function loadVersions(): Promise<void> {
    const api = getDesktopUpdaterAPI();
    if (!api) {
      return;
    }
    versions.value = await api.updater_list_versions();
  }

  async function saveSettings(): Promise<void> {
    await getDesktopUpdaterAPI()?.updater_set_settings({
      channel: channel.value,
      pinnedVersion: pinnedVersion.value,
    });
  }

  async function setChannel(newChannel: UpdateChannel): Promise<void> {
    channel.value = newChannel;
    await saveSettings();
  }

  async function pin(version: string | undefined): Promise<void> {
    pinnedVersion.value = version;
    await saveSettings();
  }

  return {
    status,
    currentVersion,
    channel,
    pinnedVersion,
    versions,
    isAvailable,
    init,
    loadVersions,
    setChannel,
    pin,
    check,
    restart,
  };
});

export { useUpdaterStore, type UpdateChannel, type UpdaterState, type UpdaterStatus };
