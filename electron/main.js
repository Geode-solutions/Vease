import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import {
  executable_path,
  create_path,
  create_new_window,
  run_script,
} from "../utils/desktop";

const os = require("os");

autoUpdater.checkForUpdatesAndNotify();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const data_folder_path = path.join(os.tmpdir(), "vease");
create_path(data_folder_path);

var processes = [];
var mainWindow = null;

ipcMain.handle("run_back", async (event, ...args) => {
  const port = await getAvailablePort(args[0]);
  console.log("BACK PORT", port);
  const command = executable_path("vease", "back");
  console.log("command", command);
  await run_script(
    win,
    command,
    [
      "--port " + port,
      "--data_folder_path " + data_folder_path,
      "--allowed_origin ",
      "" * "",
      "--timeout " + 0,
    ],
    "Serving Flask app"
  );
  return port;
});

ipcMain.handle("run_viewer", async (event, ...args) => {
  const port = await getAvailablePort(args[0]);
  console.log("VIEWER PORT", port);
  const command = executable_path("vease", "viewer");
  console.log("command", command);
  await run_script(
    win,
    command,
    [
      "--port " + port,
      "--data_folder_path " + data_folder_path,
      "--timeout " + 0,
    ],
    "Starting factory"
  );
  return port;
});

ipcMain.handle("new_window", async (event, ...args) => {
  const new_window = create_new_window();
});

app.whenReady().then(() => {
  mainWindow = create_new_window();
});

app.on("before-quit", function () {
  processes.forEach(function (proc) {
    console.log("Process %s has been killed!", proc.name);
    proc.kill();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
