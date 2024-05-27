const { contextBridge, ipcRenderer } = require("electron");

console.log("_____TEST ELECTRON PRELOAD_______");

contextBridge.exposeInMainWorld("electron", {
  on_viewer_port: (callback) => {
    console.log("bridge on");
    ipcRenderer.on("viewer_port", (_event, value) => callback(value));
  },
});
