import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import {
  create_path,
  kill_processes,
  run_back,
  run_viewer,
} from "/utils/local.js";
import { create_new_window } from "/utils/desktop.js";

import os from "os";

autoUpdater.checkForUpdatesAndNotify();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const data_folder_path = create_path(path.join(os.tmpdir(), "vease"));

let mainWindow = null;

ipcMain.handle("run_back", async (_event, ...args) => {
  return await run_back(data_folder_path);
});
ipcMain.handle("run_viewer", async (_event, ...args) => {
  return await run_viewer(data_folder_path);
});

ipcMain.handle("new_window", async (_event) => {
  const _new_window = create_new_window();
});

app.whenReady().then(() => {
  mainWindow = create_new_window();
});

app.on("before-quit", async function () {
  await kill_processes();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("quit", () => {
  console.log("Quitting Vease...");
});
