import { app, BrowserWindow, ipcMain } from "electron";
import { updateElectronApp } from "update-electron-app";
import path from "path";

const { getPort } = require("get-port-please");
updateElectronApp();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

async function getAvailablePort(port) {
  console.log("getAvailablePort", port);
  const available_port = await getPort({ port });
  console.log("available_port", available_port);

  return available_port;
}

app.whenReady().then(() => {
  ipcMain.handle("run_back", async (event, ...args) => {
    console.log("HANDLE", args);
    const port = await getAvailablePort(args[0]);
    console.log("RESULT FROM MAIN", port);
    return result;
  });

  const win = new BrowserWindow({
    title: "Vease - New project",
    icon: "public/favicon.ico",
    center: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  if (app.isPackaged) {
    win.loadFile("../index.html");
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});
