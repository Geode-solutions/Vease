const { contextBridge, ipcRenderer } = require("electron");

console.log("_____TEST ELECTRON PRELOAD_______");

contextBridge.exposeInMainWorld("electronAPI", {
  run_back: async (port) => {
    console.log("FROM PRELOAD", port);
    const result = await ipcRenderer.invoke("run_back", port);
    console.log("RESULT", result);
    console.log("POST");
  },
});
