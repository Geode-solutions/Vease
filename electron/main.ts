// Standard library imports

// Third party imports
import { app, ipcMain } from "electron";
import { cleanupBackend } from "@geode/opengeodeweb-front/server/utils/cleanup.js";
import { consola } from "consola";

// Local imports
import {
  createNewWindow,
  deleteCredentials,
  getCredentials,
  parseArgs,
  saveCredentials,
  // oxlint-disable-next-line import/no-relative-parent-imports
} from "../utils/desktop";
import { initUpdater } from "./updater";
// oxlint-disable-next-line import/no-relative-parent-imports
import { loadLaunchFiles } from "../utils/launch_files";

const appArgs = parseArgs();
consola.info(`App launched with args: ${JSON.stringify(appArgs)}`);

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
// Lets globalShortcut work on Wayland through the desktop portal
app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");
let serverCleanup: (() => unknown) | undefined = undefined;
let projectFolderPath = "";

ipcMain.handle("new_window", () => {
  void createNewWindow();
});

ipcMain.handle("project_folder_path", (_event, args: { projectFolderPath: string }) => {
  ({ projectFolderPath } = args);
  consola.info(`[Electron] Updated projectFolderPath: ${projectFolderPath}`);
});

ipcMain.handle("save_credentials", (_event, args: { email: string; password: string }) => {
  const { email, password } = args;
  return saveCredentials(email, password);
});

ipcMain.handle("get_credentials", () => {
  consola.info("Getting credentials");
  const credentials = getCredentials();
  return credentials;
});

ipcMain.handle("delete_credentials", () => {
  consola.info("Deleting credentials");
  return deleteCredentials();
});

// oxlint-disable promise/always-return, promise/prefer-await-to-then, promise/catch-or-return, unicorn/prefer-top-level-await
void app.whenReady().then(async () => {
  const { cleanup, baseUrl } = await createNewWindow();
  serverCleanup = cleanup;
  if (appArgs.files.length > 0) {
    void loadLaunchFiles(baseUrl, appArgs.files);
  }
});

let cleaned = false;

async function clean_up(): Promise<void> {
  consola.info("Shutting down microservices");
  await cleanupBackend(projectFolderPath);
  if (serverCleanup) {
    serverCleanup();
  }
  cleaned = true;
  consola.info("end clean");
}

initUpdater({ autoCheck: !appArgs.flags.includes("--no-update"), beforeInstall: clean_up });

app.on("before-quit", (event) => {
  if (!cleaned) {
    event.preventDefault();
    void (async (): Promise<void> => {
      try {
        await clean_up();
        app.quit();
      } catch (error) {
        consola.error("Cleanup failed", error);
        // oxlint-disable-next-line no-process-exit
        process.exit(1);
      }
    })();
  }
});

app.on("window-all-closed", () => {
  consola.info("All windows are closed");
  app.quit();
});

app.on("quit", () => {
  consola.info("Quitting Vease...");
});
