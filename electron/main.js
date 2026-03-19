// Standard library imports

// Third party imports
import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { cleanupBackend } from "@geode/opengeodeweb-front/app/utils/local/microservices.js";

// Local imports
// oxlint-disable-next-line import/no-relative-parent-imports
import { create_new_window } from "../utils/desktop.js";

autoUpdater.checkForUpdatesAndNotify();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
let projectFolderPath = "";
let _mainWindow = undefined;

ipcMain.handle("new_window", () => {
  create_new_window();
});

ipcMain.handle("project_folder_path", (_event, args) => {
  ({ projectFolderPath } = args);
  console.log(`[Electron] Updated projectFolderPath: ${projectFolderPath}`);
});

// oxlint-disable promise/always-return, promise/prefer-await-to-then, promise/catch-or-return, unicorn/prefer-top-level-await
app.whenReady().then(async function onReady() {
  _mainWindow = await create_new_window();
});

let cleaned = false;

async function clean_up() {
  console.log("Shutting down microservices");
  await cleanupBackend(projectFolderPath);
  cleaned = true;
  console.log("end clean");
}

app.on("before-quit", async function onBeforeQuit(event) {
  if (!cleaned) {
    event.preventDefault();
    try {
      await clean_up();
      app.quit();
    } catch (error) {
      console.error("Cleanup failed", error);
      // oxlint-disable-next-line no-process-exit
      process.exit(1);
    }
  }
});

app.on("window-all-closed", () => {
  console.log("All windows are closed");
  app.quit();
});

app.on("quit", () => {
  console.log("Quitting Vease...");
});
