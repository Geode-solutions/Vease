const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  run_back: async () => {
    const result = await ipcRenderer.invoke("run_back")
    return result
  },
  run_viewer: async () => {
    const result = await ipcRenderer.invoke("run_viewer")
    return result
  },
  new_window: async (args) => {
    console.log("PRELOAD new_window", args)
    ipcRenderer.invoke("new_window", args)
  },
})
