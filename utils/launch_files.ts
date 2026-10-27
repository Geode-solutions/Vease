// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { consola } from "consola";
import { getIsAppReady } from "@geode/opengeodeweb-front/shared/scripts.js";

// Local constants
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const READY_TIMEOUT_MINUTES = 5;
const READY_TIMEOUT_MS = READY_TIMEOUT_MINUTES * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
const READY_POLL_INTERVAL_MS = MILLISECONDS_IN_SECOND;

function isAppReadyResponse(value: unknown): boolean {
  return (
    typeof value === "object" && value !== null && "isReady" in value && value.isReady === true
  );
}

async function sleep(delayMs: number): Promise<void> {
  // oxlint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

// The renderer marks the app ready once its back and viewer are connected
async function waitForAppReady(baseUrl: string, timeoutMs = READY_TIMEOUT_MS): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    try {
      // oxlint-disable-next-line no-await-in-loop -- polling: each check waits for the previous one
      if (isAppReadyResponse(await getIsAppReady(baseUrl))) {
        return;
      }
    } catch (error) {
      consola.debug("[Electron] App not reachable yet", error);
    }
    // oxlint-disable-next-line no-await-in-loop -- polling interval
    await sleep(READY_POLL_INTERVAL_MS);
  }
  throw new Error(`App not ready after ${READY_TIMEOUT_MINUTES} min`);
}

interface LoadedData {
  id: string;
  name: string;
  geode_object_type: string;
}

// Same route as the Vease controller clients: upload, pick the type and display the data
async function loadFile(baseUrl: string, filePath: string): Promise<LoadedData> {
  const form = new FormData();
  form.append("file", await fs.openAsBlob(filePath), path.basename(filePath));
  const response = await fetch(`${baseUrl}/api/controller/data/load`, {
    method: "POST",
    body: form,
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${String(response.status)} ${body}`);
  }
  // oxlint-disable-next-line no-unsafe-type-assertion -- trusted API boundary, shape given by the controller load schema
  return (JSON.parse(body) as { response: LoadedData }).response;
}

function isFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

// Files given on the command line, relative to the folder Vease was launched from
async function loadLaunchFiles(baseUrl: string, files: readonly string[]): Promise<void> {
  // The AppImage runtime gives the caller's folder in OWD
  const launchFolder = process.env.OWD ?? process.cwd();
  const filePaths = files
    .map((file) => path.resolve(launchFolder, file))
    .filter((filePath) => {
      if (isFile(filePath)) {
        return true;
      }
      consola.warn(`[Electron] Skipping ${filePath}: not a file`);
      return false;
    });
  if (filePaths.length === 0) {
    return;
  }
  consola.info("[Electron] Waiting for the app to be ready to load files");
  try {
    await waitForAppReady(baseUrl);
  } catch (error) {
    consola.error("[Electron] Files not loaded", error);
    return;
  }
  for (const filePath of filePaths) {
    try {
      // oxlint-disable-next-line no-await-in-loop -- files are loaded one after another
      const data = await loadFile(baseUrl, filePath);
      consola.success(`[Electron] Loaded ${filePath} as ${data.geode_object_type} (${data.id})`);
    } catch (error) {
      consola.error(`[Electron] Failed to load ${filePath}`, error);
    }
  }
}

export { loadFile, loadLaunchFiles, waitForAppReady };
