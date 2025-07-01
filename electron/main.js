import { app, ipcMain, ipcRenderer } from "electron";
// import { autoUpdater } from "electron-updater";
import path from "path";
import {
  executable_path,
  create_path,
  create_new_window,
  get_available_port,
  run_script,
} from "/app/utils/desktop";

const os = require("os");

// autoUpdater.checkForUpdatesAndNotify();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const data_folder_path = path.join(os.tmpdir(), "vease");
create_path(data_folder_path);

var processes = [];
var mainWindow = null;

ipcMain.handle("run_back", async (_event, ...args) => {
  const port = await get_available_port(args[0]);
  console.log("BACK PORT", port);
  const command = executable_path("vease", "back");
  const back_args = [
    "--port " + port,
    "--data_folder_path " + data_folder_path,
    "--allowed_origin ",
    "" * "",
    "--timeout " + 0,
  ];
  console.log("run_back", command, back_args);
  await run_script(mainWindow, command, back_args, "Serving Flask app");
  return port;
});

ipcMain.handle("run_viewer", async (_event, ...args) => {
  const port = await get_available_port(args[0]);
  console.log("VIEWER PORT", port);
  const command = executable_path("vease", "viewer");
  const viewer_args = [
    "--port " + port,
    "--data_folder_path " + data_folder_path,
    "--timeout " + 0,
  ];
  console.log("run_viewer", command, viewer_args);
  await run_script(mainWindow, command, viewer_args, "Starting factory");
  return port;
});

ipcMain.handle("new_window", async (_event) => {
  const _new_window = create_new_window();
});

ipcMain.handle("microservices_connected", async () => {
  console.log("microservices_connected from main");
  const result = await ipcRenderer.send("microservices_connected");
  console.log("microservices_connected", result);
});

ipcMain.handle("microservices_running", async () => {
  console.log("microservices_running from main");
  // Check if microservices are running
  const microservicesRunning = await checkMicroservicesStatus();
  return microservicesRunning;
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

function sendToRenderer(message) {
  mainWindow.webContents.send("main-to-renderer", message);
}

export default sendToRenderer;
