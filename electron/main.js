import { app, BrowserWindow } from "electron";
import { updateElectronApp } from "update-electron-app";
import path from "path";

updateElectronApp();

process.env.ROOT = path.join(__dirname, "..", "..");
process.env.DIST = path.join(process.env.ROOT, "dist-electron");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, "public")
  : path.join(process.env.ROOT, ".output/public");

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const preload = path.join(process.env.DIST, "preload.js");

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: "Vease - New project",
    icon: "public/favicon.ico",
    center: true,
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  if (app.isPackaged) {
    win.loadFile("../public/index.html");
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});
