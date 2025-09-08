import { app, BrowserWindow } from "electron";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

function create_new_window() {
  const win = new BrowserWindow({
    title: "Vease - New project",
    icon: process.platform === "win32" ? "public/logo.ico" : "public/logo.png",
    center: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMenuBarVisibility(false);
  win.maximize();
  win.setMinimumSize(1000, 700);

  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
    }
  );

  win.webContents.setWindowOpenHandler(({ url }) => {
    require("electron").shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        "Access-Control-Allow-Origin": ["*"],
        "Access-Control-Allow-Methods": ["*"],
        // We use this to bypass headers
        "Access-Control-Allow-Headers": ["*"],
        ...details.responseHeaders,
      },
    });
  });
  if (app.isPackaged) {
    const app_path = path.join(
      app.getAppPath(),
      ".output",
      "public",
      "index.html"
    );
    console.log("APP_PATH", app_path);
    win.loadFile(app_path);
  } else {
    console.log("VITE_DEV_SERVER_URL", process.env.VITE_DEV_SERVER_URL);
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.on("ready-to-show", () => {
      win.webContents.openDevTools();
      // win.webContents.openDevTools({ mode: "detach" });
    });
  }

  win.webContents.session.clearStorageData();
  win.webContents.session.clearData(["cache"]);
  win.webContents.session.clearCache(function () {
    console.log("Vease cache cleared!");
  });

  win.webContents.on(
    "console-message",
    (event, level, message, line, sourceId) => {
      // Map log levels to readable names
      const logLevels = ["VERBOSE", "INFO", "ERROR"]; // "WARNING",
      const logLevel = logLevels[level] || "UNKNOWN";
      // Print the console message to the terminal
      console.log(
        `[${logLevel}] ${message} (Source: ${sourceId}, Line: ${line})`
      );
    }
  );
  return win;
}

export { create_new_window };
