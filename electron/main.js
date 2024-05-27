import { app, BrowserWindow } from "electron";
import { updateElectronApp } from "update-electron-app";
import { getPort } from "get-port-please";

const path = require("path");

updateElectronApp();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const createWindow = async () => {
  const win = new BrowserWindow({
    title: "Vease - New project",
    icon: "public/favicon.ico",
    center: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: false,
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
  setTimeout(async () => {
    console.log("TOTO");
    win.webContents.send("viewer_port", await getPort());
  }, 1000);
};

app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});
