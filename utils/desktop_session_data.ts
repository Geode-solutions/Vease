// Node imports
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Third party imports
import { app } from "electron";
import { consola } from "consola";

// Chromium storage (cache, IndexedDB, quota database...) lives in sessionData, by default the shared userData folder.
// A second Vease instance cannot open it while the first one runs (locked on Windows) and its window stays blank.
// The storage is cleared on every launch anyway: each instance gets its own folder, removed on quit.
const SESSION_DATA_PREFIX = "vease-session-";
const sessionDataRoot = os.tmpdir();

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM: the process exists but belongs to another user
    return error instanceof Error && "code" in error && error.code === "EPERM";
  }
}

function removeFolder(folderPath: string): void {
  try {
    fs.rmSync(folderPath, { recursive: true, force: true, maxRetries: 3 });
  } catch (error) {
    consola.warn(`[Electron] Failed to remove session data ${folderPath}`, error);
  }
}

// Folders left by instances that did not quit cleanly (crash, killed process)
function removeStaleSessionData(): void {
  for (const entry of fs.readdirSync(sessionDataRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith(SESSION_DATA_PREFIX)) {
      const pid = Number(entry.name.slice(SESSION_DATA_PREFIX.length));
      if (Number.isInteger(pid) && pid !== process.pid && !isProcessAlive(pid)) {
        removeFolder(path.join(sessionDataRoot, entry.name));
      }
    }
  }
}

// Must run before the app is ready
function isolateInstanceSessionData(): void {
  try {
    removeStaleSessionData();
  } catch (error) {
    consola.warn("[Electron] Failed to remove stale session data", error);
  }
  const sessionDataPath = path.join(sessionDataRoot, `${SESSION_DATA_PREFIX}${process.pid}`);
  fs.mkdirSync(sessionDataPath, { recursive: true });
  app.setPath("sessionData", sessionDataPath);
  consola.info(`[Electron] sessionData path: ${sessionDataPath}`);
  app.on("quit", () => {
    removeFolder(sessionDataPath);
  });
}

export { isolateInstanceSessionData };
