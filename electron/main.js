import { app, BrowserWindow } from "electron";
import { updateElectronApp } from "update-electron-app";

updateElectronApp();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: "Vease - New project",
    icon: "public/favicon.ico",
    center: true,
    webPreferences: {
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
