// Standard library imports

// Third party imports
import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { cleanupBackend } from "@geode/opengeodeweb-front/server/utils/cleanup.js";

// Local imports
import {
  createNewWindow,
  deleteCredentials,
  getCredentials,
  parseArgs,
  saveCredentials,
  // oxlint-disable-next-line import/no-relative-parent-imports
} from "../utils/desktop";

const appArgs = parseArgs();
console.log(`App launched with args: ${JSON.stringify(appArgs)}`);
if (!appArgs.flags.includes("--no-update")) {
  void autoUpdater.checkForUpdatesAndNotify();
}

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let serverCleanup: (() => unknown) | undefined = undefined;
let projectFolderPath = "";

ipcMain.handle("new_window", () => {
  void createNewWindow();
});

ipcMain.handle("project_folder_path", (_event, args: { projectFolderPath: string }) => {
  ({ projectFolderPath } = args);
  console.log(`[Electron] Updated projectFolderPath: ${projectFolderPath}`);
});

ipcMain.handle("save_credentials", (_event, args: { email: string; password: string }) => {
  const { email, password } = args;
  return saveCredentials(email, password);
});

ipcMain.handle("get_credentials", () => {
  console.log("Getting credentials");
  const credentials = getCredentials();
  return credentials;
});

ipcMain.handle("delete_credentials", () => {
  console.log("Deleting credentials");
  return deleteCredentials();
});

// oxlint-disable promise/always-return, promise/prefer-await-to-then, promise/catch-or-return, unicorn/prefer-top-level-await
void app.whenReady().then(async () => {
  const { cleanup } = await createNewWindow();
  serverCleanup = cleanup;
});

let cleaned = false;

async function clean_up(): Promise<void> {
  console.log("Shutting down microservices");
  await cleanupBackend(projectFolderPath);
  if (serverCleanup) {
    serverCleanup();
  }
  cleaned = true;
  console.log("end clean");
}

app.on("before-quit", (event) => {
  if (!cleaned) {
    event.preventDefault();
    void (async (): Promise<void> => {
      try {
        await clean_up();
        app.quit();
      } catch (error) {
        console.error("Cleanup failed", error);
        // oxlint-disable-next-line no-process-exit
        process.exit(1);
      }
    })();
  }
});

app.on("window-all-closed", () => {
  console.log("All windows are closed");
  app.quit();
});

app.on("quit", () => {
  console.log("Quitting Vease...");
});
