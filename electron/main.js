import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import {
  executable_path,
  create_path,
  create_new_window,
  registerChildProcesses,
  killProcesses,
  get_available_port,
  run_script,
} from "/app/utils/desktop";

const os = require("os");

autoUpdater.checkForUpdatesAndNotify();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const uuid_project = uuidv4();
const project_folder_path = path.join(os.tmpdir(), "vease", uuid_project);
create_path(project_folder_path);


var processes = [];
var mainWindow = null;

// Fonction pour obtenir ou créer un UUID de projet
function getOrCreateProjectUuid() {
  // Vous pouvez stocker l'UUID dans une variable globale ou le récupérer d'une autre manière
  if (!global.currentProjectUuid) {
    global.currentProjectUuid = uuidv4();
  }
  return global.currentProjectUuid;
}

ipcMain.handle("run_back", async (_event, ...args) => {
  const port = await get_available_port(args[0]);
  console.log("BACK PORT", port);
  const command = executable_path("vease", "back");
  
  // Utiliser l'UUID du projet pour le chemin des données
  const projectUuid = getOrCreateProjectUuid();
  const project_folder_path = path.join(os.tmpdir(), "vease", projectUuid);
  const data_folder_path = path.join(project_folder_path, "data_project");
  
  create_path(project_folder_path);
  create_path(data_folder_path);
  
  const back_args = [
    "--port " + port,
    "--data_folder_path " + data_folder_path,
    "--upload_folder_path " + path.join(project_folder_path, "uploads"),
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
  processes = registerChildProcesses(microservice, processes);
  return port;
});

ipcMain.handle("run_viewer", async (_event, ...args) => {
  const port = await get_available_port(args[0]);
  console.log("VIEWER PORT", port);
  const command = executable_path("vease", "viewer");
  
  const projectUuid = getOrCreateProjectUuid();
  const project_folder_path = path.join(os.tmpdir(), "vease", projectUuid);
  const data_folder_path = path.join(project_folder_path, "data_project");
  
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
  processes = registerChildProcesses(microservice, processes);
  return port;
});

ipcMain.handle("new_window", async (_event) => {
  const _new_window = create_new_window();
});

app.whenReady().then(() => {
  mainWindow = create_new_window();
});

app.on("before-quit", async () => {
  try {
    await killProcesses(processes);
    fs.rmSync(project_folder_path, { recursive: true, force: true });
    console.log("[before-quit] Deleted project folder:", project_folder_path);
  } catch (err) {
    console.error("[before-quit] Failed to delete project folder:", err);
  }
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("quit", () => {
  console.log("Quitting Vease...");
});
