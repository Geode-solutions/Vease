import { app, BrowserWindow } from "electron";
import { updateElectronApp } from "update-electron-app";
import path from "path";

updateElectronApp();

process.env.ROOT = path.join(__dirname, "..");
console.log("ROOT", process.env.ROOT);
process.env.DIST = path.join(process.env.ROOT, "dist-electron");
console.log("DIST", process.env.DIST);
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, "public")
  : path.join(process.env.ROOT, ".output/public");

console.log("VITE_PUBLIC", process.env.VITE_PUBLIC);

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
  // win.removeMenu();
  // win.webContents.openDevTools();
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log("VITE_DEV_SERVER_URL", process.env.VITE_DEV_SERVER_URL);
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    console.log("LOAD FILE");
    // win.loadFile(path.join(process.env.VITE_PUBLIC, "index.html"));
    win.loadFile("file://./index.html");
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});
