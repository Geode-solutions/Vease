// Node imports
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Third party imports
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Local imports
import {
  LOCAL_STATE_FILE,
  persistLocalState,
  restoreLocalState,
} from "~~/utils/desktop_local_state";

vi.setConfig({ testTimeout: 10_000 });

const PERSISTENT_KEY = "persistent-key";
const INSTANCE_KEY = "instance-key";

function localStateContent(encryptedKey?: string): string {
  const content: Record<string, unknown> = { browser: { enabled_labs_experiments: [] } };
  if (encryptedKey !== undefined) {
    content.os_crypt = { encrypted_key: encryptedKey };
  }
  return JSON.stringify(content);
}

describe("desktop Local State (electron main process) utils", () => {
  let tmpDir = "";
  let userDataPath = "";
  let sessionDataPath = "";

  function userDataLocalState(): string {
    return path.join(userDataPath, LOCAL_STATE_FILE);
  }
  function sessionDataLocalState(): string {
    return path.join(sessionDataPath, LOCAL_STATE_FILE);
  }

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vease-local-state-"));
    userDataPath = path.join(tmpDir, "userData");
    sessionDataPath = path.join(tmpDir, "sessionData");
    fs.mkdirSync(userDataPath);
    fs.mkdirSync(sessionDataPath);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("restoreLocalState()", () => {
    test("copies the persistent encryption key into the instance sessionData", () => {
      fs.writeFileSync(userDataLocalState(), localStateContent(PERSISTENT_KEY));
      restoreLocalState(userDataPath, sessionDataPath);
      expect(fs.readFileSync(sessionDataLocalState(), "utf8")).toBe(
        localStateContent(PERSISTENT_KEY),
      );
    });

    test("does nothing when no encryption key was persisted", () => {
      restoreLocalState(userDataPath, sessionDataPath);
      expect(fs.existsSync(sessionDataLocalState())).toBe(false);
    });

    test("ignores a persisted Local State without encryption key", () => {
      fs.writeFileSync(userDataLocalState(), localStateContent());
      restoreLocalState(userDataPath, sessionDataPath);
      expect(fs.existsSync(sessionDataLocalState())).toBe(false);
    });
  });

  describe("persistLocalState()", () => {
    test("keeps the instance encryption key when none was persisted", () => {
      fs.writeFileSync(sessionDataLocalState(), localStateContent(INSTANCE_KEY));
      persistLocalState(userDataPath, sessionDataPath);
      expect(fs.readFileSync(userDataLocalState(), "utf8")).toBe(localStateContent(INSTANCE_KEY));
    });

    test("never replaces an already persisted encryption key", () => {
      fs.writeFileSync(userDataLocalState(), localStateContent(PERSISTENT_KEY));
      fs.writeFileSync(sessionDataLocalState(), localStateContent(INSTANCE_KEY));
      persistLocalState(userDataPath, sessionDataPath);
      expect(fs.readFileSync(userDataLocalState(), "utf8")).toBe(localStateContent(PERSISTENT_KEY));
    });

    test("replaces a persisted Local State without encryption key", () => {
      fs.writeFileSync(userDataLocalState(), localStateContent());
      fs.writeFileSync(sessionDataLocalState(), localStateContent(INSTANCE_KEY));
      persistLocalState(userDataPath, sessionDataPath);
      expect(fs.readFileSync(userDataLocalState(), "utf8")).toBe(localStateContent(INSTANCE_KEY));
    });

    test("waits for Chromium to write the encryption key", () => {
      persistLocalState(userDataPath, sessionDataPath);
      expect(fs.existsSync(userDataLocalState())).toBe(false);

      fs.writeFileSync(sessionDataLocalState(), localStateContent());
      persistLocalState(userDataPath, sessionDataPath);
      expect(fs.existsSync(userDataLocalState())).toBe(false);
    });

    test("ignores a corrupted Local State", () => {
      fs.writeFileSync(sessionDataLocalState(), "{not json");
      persistLocalState(userDataPath, sessionDataPath);
      expect(fs.existsSync(userDataLocalState())).toBe(false);
    });

    test("restores the persisted key at next launch", () => {
      fs.writeFileSync(sessionDataLocalState(), localStateContent(INSTANCE_KEY));
      persistLocalState(userDataPath, sessionDataPath);

      const nextSessionDataPath = path.join(tmpDir, "nextSessionData");
      fs.mkdirSync(nextSessionDataPath);
      restoreLocalState(userDataPath, nextSessionDataPath);
      expect(fs.readFileSync(path.join(nextSessionDataPath, LOCAL_STATE_FILE), "utf8")).toBe(
        localStateContent(INSTANCE_KEY),
      );
    });
  });
});
