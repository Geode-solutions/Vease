// oxlint-disable promise/prefer-await-to-callbacks

// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { BrowserWindow, app, safeStorage, shell, utilityProcess } from "electron";
import {
  getAvailablePort,
  waitForReady,
} from "@geode/opengeodeweb-front/app/utils/local/scripts.js";

// Isolate userData folder for concurrent Playwright workers during E2E tests
if (process.env.CI === "e2e") {
  const workerIndex = process.env.TEST_WORKER_INDEX || "0";
  const defaultUserDataPath = app.getPath("userData");
  app.setPath("userData", `${defaultUserDataPath}-e2e-worker-${workerIndex}`);
}
console.log(`[Electron] userData path: ${app.getPath("userData")}`);

// Local constants
const __dirname = import.meta.dirname;
const MIN_WINDOW_WIDTH = 1000;
const MIN_WINDOW_HEIGHT = 700;

function setupBrowserWindow() {
  const window = new BrowserWindow({
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
  window.setMenuBarVisibility(false);
  window.maximize();
  window.setMinimumSize(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT);

  window.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
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

  window.webContents.session.clearStorageData();
  window.webContents.session.clearData(["cache"]);
  window.webContents.session.clearCache(() => {
    console.log("Vease cache cleared!");
  });

  window.webContents.on("console-message", (...args) => {
    const [_event, level, message, line, sourceId] = args;
    // Map log levels to readable names
    const logLevels = ["VERBOSE", "INFO", "ERROR"];
    const logLevel = logLevels[level] || "UNKNOWN";
    // Print the console message to the terminal
    console.log(`[${logLevel}] ${message} (Source: ${sourceId}, Line: ${line})`);
  });
  return window;
}

async function createServer() {
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

  server.stdout.on("data", (data) => {
    console.log(`[NITRO] ${data.toString()}`);
  });
  server.stderr.on("data", (data) => {
    console.log(`[NITRO] ${data.toString()}`);
  });
  return { server, PORT };
}

async function createNewWindow() {
  const window = setupBrowserWindow();

  // oxlint-disable-next-line eslint/func-names, eslint/func-style, unicorn/consistent-function-scoping
  let cleanup = function () {
    console.log("No cleanup function defined");
  };

  console.log("app.isPackaged", app.isPackaged);

  if (app.isPackaged) {
    const { server, PORT } = await createServer();

    const controller = new AbortController();
    const expectedResponse = `Listening on http://[::]:${PORT}`;
    await waitForReady(server, expectedResponse, controller.signal);
    window.loadURL(`http://localhost:${PORT}`);

    // oxlint-disable-next-line eslint/func-names
    cleanup = function () {
      console.log("Killing server process", { PORT });
      return fetch(`http://localhost:${PORT}/api/app/kill`, { method: "POST" });
    };
  } else {
    console.log("VITE_DEV_SERVER_URL", process.env.VITE_DEV_SERVER_URL);
    window.loadURL(process.env.VITE_DEV_SERVER_URL);
    window.on("ready-to-show", () => {
      window.webContents.openDevTools();
    });
  }

  return { window, cleanup };
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
