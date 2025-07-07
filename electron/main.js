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
import fkill from "fkill";

var pidtree = require("pidtree");

const os = require("os");

// autoUpdater.checkForUpdatesAndNotify();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const data_folder_path = path.join(os.tmpdir(), "vease");
create_path(data_folder_path);

var processes = [];
var mainWindow = null;

ipcMain.handle("run_back", async (_event, ...args) => {
  const port = await get_available_port(args[0]);
  // return port;
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
  const microservice = await run_script(
    mainWindow,
    command,
    back_args,
    "Serving Flask app"
  );
  processes.push(microservice);
  console.log("processes.length", processes.length);
  return port;
});

ipcMain.handle("run_viewer", async (_event, ...args) => {
  const port = await get_available_port(args[0]);
  // return port;
  console.log("VIEWER PORT", port);
  const command = executable_path("vease", "viewer");
  const viewer_args = [
    "--port " + port,
    "--data_folder_path " + data_folder_path,
    "--timeout " + 0,
  ];
  console.log("run_viewer", command, viewer_args);
  const microservice = await run_script(
    mainWindow,
    command,
    viewer_args,
    "Starting factory"
  );
  processes.push(microservice);
  console.log("processes.length", processes.length);
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

app.on("before-quit", async function () {
  console.log("ELECTRON before-quit");
  await processes.forEach(async function (proc) {
    console.log(`Process ${proc.name} and its children will be killed!`);
    pidtree(proc.pid, { root: true }, function (err, pids) {
      if (err) throw console.log("err", err);
      console.log(`Processes ${pids} will be killed!`);
      fkill(pids);
      console.log(`Processes ${pids} have been killed!`);
    });
  });
});

app.on("window-all-closed", async () => {
  console.log("ELECTRON window-all-closed");
  await app.quit();
  console.log("ELECTRON window-all-closed end");
});

// app.on("will-quit", () => {
//   console.log("ELECTRON will-quit");
//   app.quit();
// });

app.on("quit", () => {
  console.log("ELECTRON quit");
  // app.quit();
});
