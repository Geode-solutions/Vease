import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  run_back: async (port) => {
    const result = await ipcRenderer.invoke("run_back", port);
    return result;
  },
  run_viewer: async (port) => {
    const result = await ipcRenderer.invoke("run_viewer", port);
    return result;
  },
  new_window: async (args) => {
    console.log("PRELOAD new_window", args);
    ipcRenderer.invoke("new_window", args);
  },
});
