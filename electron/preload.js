//oxlint-disable unicorn/prefer-module
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  project_folder_path: async (args) => {
    await ipcRenderer.invoke("project_folder_path", args);
  },
  new_window: (args) => {
    console.log("PRELOAD new_window", args);
    ipcRenderer.invoke("new_window", args);
  },
});
