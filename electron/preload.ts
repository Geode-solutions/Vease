// Electron's sandboxed preload scripts only support CommonJS
// oxlint-disable-next-line typescript/no-require-imports
import electron = require("electron");
import type { UpdateSettings } from "./updater_utils";

const { contextBridge, ipcRenderer } = electron;

contextBridge.exposeInMainWorld("electronAPI", {
  project_folder_path: async (args: { projectFolderPath: string }): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("project_folder_path", args)) as unknown;
    return result;
  },
  new_window: async (args: unknown): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("new_window", args)) as unknown;
    return result;
  },
  save_credentials: async (args: { email: string; password: string }): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("save_credentials", args)) as unknown;
    return result;
  },
  get_credentials: async (): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("get_credentials")) as unknown;
    return result;
  },
  delete_credentials: async (): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("delete_credentials")) as unknown;
    return result;
  },
  updater_get_state: async (): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("updater_get_state")) as unknown;
    return result;
  },
  updater_list_versions: async (): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("updater_list_versions")) as unknown;
    return result;
  },
  updater_set_settings: async (args: UpdateSettings): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("updater_set_settings", args)) as unknown;
    return result;
  },
  updater_check: async (): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("updater_check")) as unknown;
    return result;
  },
  updater_quit_and_install: async (): Promise<unknown> => {
    const result = (await ipcRenderer.invoke("updater_quit_and_install")) as unknown;
    return result;
  },
  on_updater_status: (onStatus: (status: unknown) => void): (() => void) => {
    function listener(_event: unknown, status: unknown): void {
      onStatus(status);
    }
    ipcRenderer.on("updater_status", listener);
    return () => {
      ipcRenderer.removeListener("updater_status", listener);
    };
  },
});
