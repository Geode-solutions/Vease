// oxlint-disable promise/prefer-await-to-callbacks

// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import {
  BrowserWindow,
  type UtilityProcess,
  app,
  safeStorage,
  shell,
  utilityProcess,
} from "electron";
import { getAvailablePort } from "@geode/opengeodeweb-front/server/utils/scripts.js";
import { setAppBaseUrl } from "@geode/opengeodeweb-front/shared/scripts.js";

// Isolate userData folder for concurrent Playwright workers during E2E tests
if (process.env.CI === "e2e") {
  const workerIndex = process.env.TEST_WORKER_INDEX ?? "0";
  const defaultUserDataPath = app.getPath("userData");
  app.setPath("userData", `${defaultUserDataPath}-e2e-worker-${workerIndex}`);
}
console.log(`[Electron] userData path: ${app.getPath("userData")}`);

// Local constants
const __dirname = import.meta.dirname;
const MIN_WINDOW_WIDTH = 1000;
const MIN_WINDOW_HEIGHT = 700;

function setupBrowserWindow(): BrowserWindow {
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
    void shell.openExternal(url);
    return { action: "deny" };
  });

  window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    if (!("Access-Control-Allow-Origin" in responseHeaders)) {
      responseHeaders["Access-Control-Allow-Origin"] = ["*"];
      responseHeaders["Access-Control-Allow-Methods"] = ["*"];
      responseHeaders["Access-Control-Allow-Headers"] = ["*"];
    }
    callback({
      responseHeaders,
    });
  });

  void window.webContents.session.clearStorageData();
  void window.webContents.session.clearData({ dataTypes: ["cache"] });
  void (async (): Promise<void> => {
    try {
      await window.webContents.session.clearCache();
      console.log("Vease cache cleared!");
    } catch (error) {
      console.error("[Electron] Failed to clear cache", error);
    }
  })();

  window.webContents.on("console-message", (...args) => {
    const [_event, level, message, line, sourceId] = args;
    // Map log levels to readable names
    const logLevels = ["VERBOSE", "INFO", "ERROR"];
    const logLevel = logLevels[level] ?? "UNKNOWN";
    // Print the console message to the terminal
    console.log(`[${logLevel}] ${message} (Source: ${sourceId}, Line: ${line})`);
  });
  return window;
}

async function createServer(): Promise<{ server: UtilityProcess; PORT: number }> {
  const serverPath = path.join(process.resourcesPath, "web", "server", "index.mjs");

  console.log(`Starting server ${serverPath}`);

  const PORT = await getAvailablePort();
  const server = utilityProcess.fork(serverPath, [], {
    env: {
      ...process.env,
      MODE: "DESKTOP",
      PORT: String(PORT),
      RESOURCES_PATH: process.resourcesPath,
    },
    stdio: "pipe",
  });

  server.stdout?.on("data", (data: Buffer) => {
    console.log(`[NITRO] ${data.toString()}`);
  });
  server.stderr?.on("data", (data: Buffer) => {
    console.log(`[NITRO] ${data.toString()}`);
  });
  return { server, PORT };
}

// oxlint-disable-next-line eslint/require-await
async function waitForServerReady(
  server: Readonly<UtilityProcess>,
  expectedResponse: string,
  signal: AbortSignal,
): Promise<void> {
  // oxlint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const subscriptions: (() => void)[] = [];
    function cleanup(): void {
      for (const unsubscribe of subscriptions) {
        unsubscribe();
      }
    }
    function onData(data: Buffer): void {
      if (data.toString().includes(expectedResponse)) {
        cleanup();
        resolve();
      }
    }
    function onExit(code: number | null): void {
      cleanup();
      reject(new Error(`Server process exited before becoming ready (code ${String(code)})`));
    }
    function onAbort(): void {
      cleanup();
      reject(new Error("Aborted while waiting for server to be ready"));
    }
    server.stdout?.on("data", onData);
    subscriptions.push(() => {
      server.stdout?.off("data", onData);
    });
    server.stderr?.on("data", onData);
    subscriptions.push(() => {
      server.stderr?.off("data", onData);
    });
    server.on("exit", onExit);
    subscriptions.push(() => {
      server.off("exit", onExit);
    });
    signal.addEventListener("abort", onAbort, { once: true });
    subscriptions.push(() => {
      signal.removeEventListener("abort", onAbort);
    });
  });
}

async function createNewWindow(): Promise<{
  window: BrowserWindow;
  cleanup: () => void | Promise<void>;
}> {
  const window = setupBrowserWindow();

  // oxlint-disable-next-line eslint/func-names, eslint/func-style, unicorn/consistent-function-scoping
  let cleanup: () => void | Promise<void> = function () {
    console.log("No cleanup function defined");
  };

  console.log("app.isPackaged", app.isPackaged);

  if (app.isPackaged) {
    const { server, PORT } = await createServer();

    const controller = new AbortController();
    const expectedResponse = `Listening on http://[::]:${PORT}`;
    await waitForServerReady(server, expectedResponse, controller.signal);
    void window.loadURL(`http://localhost:${PORT}`);
    await setAppBaseUrl(`http://localhost:${PORT}`);

    // oxlint-disable-next-line eslint/func-names
    cleanup = async function (): Promise<void> {
      console.log("Killing server process", { PORT });
      await fetch(`http://localhost:${PORT}/api/local/app/kill`, { method: "POST" });
    };
  } else {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;
    console.log("VITE_DEV_SERVER_URL", devServerUrl);
    if (devServerUrl === undefined || devServerUrl === "") {
      throw new Error("VITE_DEV_SERVER_URL is not set in development mode");
    }
    void window.loadURL(devServerUrl);
    window.on("ready-to-show", () => {
      window.webContents.openDevTools();
    });
    await setAppBaseUrl(devServerUrl);
  }

  return { window, cleanup };
}

const credentialsFilePath = path.join(app.getPath("userData"), "credentials.dat");

interface CredentialsPayload {
  email: string;
  password: string;
}

interface OperationResult {
  success: boolean;
  error?: string;
}

interface CredentialsResult extends OperationResult {
  credentials?: CredentialsPayload;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isCredentialsPayload(value: unknown): value is CredentialsPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "email" in value &&
    "password" in value &&
    typeof value.email === "string" &&
    typeof value.password === "string"
  );
}

function saveCredentials(email: string, password: string): OperationResult {
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
    return { success: false, error: errorMessage(error) };
  }
}

function getCredentials(): CredentialsResult {
  if (!fs.existsSync(credentialsFilePath)) {
    return { success: true, credentials: undefined };
  }
  try {
    const encrypted = fs.readFileSync(credentialsFilePath);
    const payload = safeStorage.decryptString(encrypted);
    const parsed: unknown = JSON.parse(payload);
    if (!isCredentialsPayload(parsed)) {
      return { success: false, error: "Stored credentials are corrupted" };
    }
    return { success: true, credentials: parsed };
  } catch (error) {
    console.error("[Electron] Failed to read credentials", error);
    return { success: false, error: errorMessage(error) };
  }
}

function deleteCredentials(): OperationResult {
  try {
    if (fs.existsSync(credentialsFilePath)) {
      fs.unlinkSync(credentialsFilePath);
    }
    return { success: true };
  } catch (error) {
    console.error("[Electron] Failed to delete credentials", error);
    return { success: false, error: errorMessage(error) };
  }
}

interface ParsedArgs {
  flags: string[];
  files: string[];
  raw: string[];
}

function parseArgs(): ParsedArgs {
  const args = app.isPackaged ? process.argv.slice(1) : process.argv.slice(2);
  return {
    flags: args.filter((argument) => argument.startsWith("--")),
    files: args.filter((argument) => !argument.startsWith("-")),
    raw: args,
  };
}

export { createNewWindow, parseArgs, saveCredentials, getCredentials, deleteCredentials };
