// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { consola } from "consola";

// On Windows, Chromium keeps the safeStorage encryption key (os_crypt.encrypted_key, protected by DPAPI)
// In the "Local State" file of the sessionData folder. Each Vease instance gets its own sessionData folder,
// Removed on quit, so the key has to be kept in userData or saved credentials can't be decrypted at next launch.
// On Linux and macOS the key comes from the system keyring and this file holds no key.
const LOCAL_STATE_FILE = "Local State";

function hasEncryptionKey(localStatePath: string): boolean {
  try {
    const content: unknown = JSON.parse(fs.readFileSync(localStatePath, "utf8"));
    return (
      typeof content === "object" &&
      content !== null &&
      "os_crypt" in content &&
      typeof content.os_crypt === "object" &&
      content.os_crypt !== null &&
      "encrypted_key" in content.os_crypt &&
      typeof content.os_crypt.encrypted_key === "string" &&
      content.os_crypt.encrypted_key !== ""
    );
  } catch {
    return false;
  }
}

// Must run before the app is ready: Chromium reads "Local State" during its early initialization
function restoreLocalState(userDataPath: string, sessionDataPath: string): void {
  const source = path.join(userDataPath, LOCAL_STATE_FILE);
  if (!hasEncryptionKey(source)) {
    return;
  }
  try {
    fs.copyFileSync(source, path.join(sessionDataPath, LOCAL_STATE_FILE));
  } catch (error) {
    consola.warn("[Electron] Failed to restore Local State", error);
  }
}

// Chromium writes the key a few seconds after startup: only keep a file that already holds it,
// And never replace the persistent key, used by the credentials saved by previous launches
function persistLocalState(userDataPath: string, sessionDataPath: string): void {
  const source = path.join(sessionDataPath, LOCAL_STATE_FILE);
  const target = path.join(userDataPath, LOCAL_STATE_FILE);
  if (hasEncryptionKey(target) || !hasEncryptionKey(source)) {
    return;
  }
  try {
    fs.mkdirSync(userDataPath, { recursive: true });
    fs.copyFileSync(source, target);
  } catch (error) {
    consola.warn("[Electron] Failed to persist Local State", error);
  }
}

export { LOCAL_STATE_FILE, persistLocalState, restoreLocalState };
