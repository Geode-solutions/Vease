//oxlint-disable unicorn/prefer-module
// oxlint-disable-next-line import/no-commonjs
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  project_folder_path: (args) => {
    ipcRenderer.invoke("project_folder_path", args);
  },
  new_window: (args) => {
    ipcRenderer.invoke("new_window", args);
  },
  save_credentials: (args) => ipcRenderer.invoke("save_credentials", args),
  get_credentials: () => ipcRenderer.invoke("get_credentials"),
  delete_credentials: () => ipcRenderer.invoke("delete_credentials"),
});
