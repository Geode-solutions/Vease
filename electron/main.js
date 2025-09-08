import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  create_path,
  kill_processes,
  run_back,
  run_viewer,
  delete_folder_recursive,
} from "/utils/local.js";
import { create_new_window } from "/utils/desktop.js";

import os from "os";

autoUpdater.checkForUpdatesAndNotify();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const uuid_project_folder = uuidv4();
const project_folder_path = path.join(
  os.tmpdir(),
  "vease",
  uuid_project_folder
);
create_path(project_folder_path);

let mainWindow = null;

ipcMain.handle("run_back", async (_event, ...args) => {
  return await run_back(args[0], project_folder_path);
});
ipcMain.handle("run_viewer", async (_event, ...args) => {
  return await run_viewer(args[0], project_folder_path);
});

ipcMain.handle("new_window", async (_event) => {
  const _new_window = create_new_window();
});

app.whenReady().then(() => {
  mainWindow = create_new_window();
});

app.on("before-quit", async function () {
  await kill_processes();
  delete_folder_recursive(project_folder_path);
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("quit", () => {
  console.log("Quitting Vease...");
});
