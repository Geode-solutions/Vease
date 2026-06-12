//oxlint-disable unicorn/prefer-module
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  project_folder_path: (args) => {
    ipcRenderer.invoke("project_folder_path", args);
  },
  new_window: (args) => {
    ipcRenderer.invoke("new_window", args);
  },
  save_credentials: (args) => {
    return ipcRenderer.invoke("save_credentials", args);
  },
  get_credentials: () => {
    const credentials = ipcRenderer.invoke("get_credentials");
    console.log("Credentials in preload", credentials);
    return credentials;
  },
  delete_credentials: () => {
    return ipcRenderer.invoke("delete_credentials");
  },
});
