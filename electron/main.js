import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import path from "path";
import {
  executable_path,
  create_path,
  get_available_port,
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
  const port = await get_available_port(args[0]);
  const command = executable_path("vease", "back");
  console.log("run_back", port, command);
  const process = await run_script(
    mainWindow,
    command,
    [
      "--port " + port,
      "--data_folder_path " + data_folder_path,
      "--desktop",
      "--allowed_origin ",
      "" * "",
    ],
    "Serving Flask app"
  );
  processes.push(process);
  return port;
});

ipcMain.handle("run_viewer", async (event, ...args) => {
  const port = await get_available_port(args[0]);
  const command = executable_path("vease", "viewer");
  console.log("run_viewer", port, command);
  const process = await run_script(
    mainWindow,
    command,
    ["--port " + port, "--data_folder_path " + data_folder_path],
    "Starting factory"
  );
  processes.push(process);
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
