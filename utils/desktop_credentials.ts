// Node imports
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { consola } from "consola";
import { safeStorage } from "electron";

// Local imports
import { userDataPath } from "./desktop_user_data";

const credentialsFilePath = path.join(userDataPath, "credentials.dat");

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
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
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
    consola.error("[Electron] Encryption is not available on this system");
    return { success: false, error: "Encryption not available" };
  }

  try {
    const payload = JSON.stringify({ email, password });
    const encrypted = safeStorage.encryptString(payload);
    fs.writeFileSync(credentialsFilePath, encrypted);
    return { success: true };
  } catch (error) {
    consola.error("[Electron] Failed to save credentials", error);
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
    consola.error("[Electron] Failed to read credentials", error);
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
    consola.error("[Electron] Failed to delete credentials", error);
    return { success: false, error: errorMessage(error) };
  }
}

export { saveCredentials, getCredentials, deleteCredentials };
