// oxlint-disable promise/prefer-await-to-callbacks

// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { BrowserWindow, app, safeStorage, shell, utilityProcess } from "electron";
import { getAvailablePort } from "@geode/opengeodeweb-front/app/utils/local/microservices.js";
import { waitForReady } from "@geode/opengeodeweb-front/app/utils/local/scripts.js";

// Local constants
const __dirname = import.meta.dirname;
const MIN_WINDOW_WIDTH = 1000;
const MIN_WINDOW_HEIGHT = 700;

function setupBrowserWindow() {
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
  win.setMinimumSize(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT);

  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    if ((!"Access-Control-Allow-Origin") in details.responseHeaders) {
      responseHeaders["Access-Control-Allow-Origin"] = ["*"];
      responseHeaders["Access-Control-Allow-Methods"] = ["*"];
      responseHeaders["Access-Control-Allow-Headers"] = ["*"];
    }
    callback({
      responseHeaders,
    });
  });
  return win;
}

async function createNewWindow() {
  const win = setupBrowserWindow();

  console.log("app.isPackaged", app.isPackaged);
  if (app.isPackaged) {
    const serverPath = path.join(process.resourcesPath, "web", "server", "index.mjs");

    console.log(`Starting server ${serverPath}`);

    const PORT = await getAvailablePort();
    const server = utilityProcess.fork(serverPath, {
      encoding: "utf8",
      env: {
        ...process.env,
        MODE: "DESKTOP",
        PORT: String(PORT),
        RESOURCES_PATH: process.resourcesPath,
      },
      stdio: "pipe",
      shell: true,
    });

    server.stdout.on("data", (data) => { console.log(`[NITRO] ${data.toString()}`) });
    server.stderr.on("data", (data) => { console.log(`[NITRO] ${data.toString()}`) });

    const controller = new AbortController();
    const expectedResponse = `Listening on http://[::]:${PORT}`;
    await waitForReady(server, expectedResponse, controller.signal);
    win.loadURL(`http://localhost:${PORT}`);

    app.on("before-quit", async () => {
      console.log("Killing server process", { PORT });
      await fetch(`http://localhost:${PORT}/api/app/kill`, { method: "POST" });
    });
  } else {
    console.log("VITE_DEV_SERVER_URL", process.env.VITE_DEV_SERVER_URL);
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.on("ready-to-show", () => {
      win.webContents.openDevTools();
    });
  }

  win.webContents.session.clearStorageData();
  win.webContents.session.clearData(["cache"]);
  win.webContents.session.clearCache(() => {
    console.log("Vease cache cleared!");
  });

  win.webContents.on("console-message", (...args) => {
    const [_event, level, message, line, sourceId] = args;
    // Map log levels to readable names
    const logLevels = ["VERBOSE", "INFO", "ERROR"];
    const logLevel = logLevels[level] || "UNKNOWN";
    // Print the console message to the terminal
    console.log(`[${logLevel}] ${message} (Source: ${sourceId}, Line: ${line})`);
  });
  return win;
}

const credentialsFilePath = path.join(app.getPath("userData"), "credentials.dat");

function saveCredentials(email, password) {
  if (!safeStorage.isEncryptionAvailable()) {
    console.error("[Electron] Encryption is not available on this system");
    return { success: false, error: "Encryption not available" };
  }

  try {
    const payload = JSON.stringify({ email, password });
    const encrypted = safeStorage.encryptString(payload);
    fs.writeFileSync(credentialsFilePath, encrypted);
    return { success: true };
  } catch (error) {
    console.error("[Electron] Failed to save credentials", error);
    return { success: false, error: error.message };
  }
}

function getCredentials() {
  if (!fs.existsSync(credentialsFilePath)) {
    return { success: true, credentials: undefined };
  }
  try {
    const encrypted = fs.readFileSync(credentialsFilePath);
    const payload = safeStorage.decryptString(encrypted);
    const credentials = JSON.parse(payload);
    console.log("Retrieved credentials", credentials);
    return { success: true, credentials };
  } catch (error) {
    console.error("[Electron] Failed to read credentials", error);
    return { success: false, error: error.message };
  }
}

function deleteCredentials() {
  try {
    if (fs.existsSync(credentialsFilePath)) {
      fs.unlinkSync(credentialsFilePath);
    }
    return { success: true };
  } catch (error) {
    console.error("[Electron] Failed to delete credentials", error);
    return { success: false, error: error.message };
  }
}

function parseArgs() {
  const args = app.isPackaged ? process.argv.slice(1) : process.argv.slice(2);
  return {
    flags: args.filter((argument) => argument.startsWith("--")),
    files: args.filter((argument) => !argument.startsWith("-")),
    raw: args,
  };
}

export { createNewWindow, parseArgs, saveCredentials, getCredentials, deleteCredentials };
