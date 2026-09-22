import { contextBridge, ipcRenderer } from "electron";

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
});
