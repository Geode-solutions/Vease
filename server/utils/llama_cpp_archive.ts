// Node imports
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Third party imports
import { consola } from "consola";

// Local imports
import { appMode } from "@ogw_shared/app_mode";
import { executableName } from "@ogw_server/utils/path";
import { unzipFile } from "@ogw_server/utils/server";

const EXECUTABLE_MODE = "755";
const EXTRACT_CACHE_DIR = path.join(os.homedir(), ".vease", "llama_cpp");

function platformDirName(): string {
  if (process.platform === "win32") {
    return "win-x64";
  }
  if (process.platform === "linux") {
    return "ubuntu-x64";
  }
  throw new Error(`Unsupported platform for bundled llama.cpp: ${process.platform}`);
}

function platformArchiveExtension(): string {
  if (process.platform === "win32") {
    return "zip";
  }
  if (process.platform === "linux") {
    return "tar.gz";
  }
  throw new Error(`Unsupported platform for bundled llama.cpp: ${process.platform}`);
}

function archiveFileName(): string {
  return `llama-b10809-bin-${platformDirName()}.${platformArchiveExtension()}`;
}

function resolveArchivePath(nuxtRootPath: string): string {
  const mode = process.env.MODE;
  const nodeEnv = process.env.NODE_ENV;
  if (mode === appMode.DESKTOP && nodeEnv === "production") {
    return path.join(process.env.RESOURCES_PATH ?? "", "llama_cpp", archiveFileName());
  }

  return path.join(nuxtRootPath, "third_parties", "llama_cpp", archiveFileName());
}

function findExecutable(dir: string, executableFileName: string): string | undefined {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findExecutable(fullPath, executableFileName);
      if (found !== undefined) {
        return found;
      }
    } else if (entry.name === executableFileName) {
      return fullPath;
    }
  }
  return undefined;
}

async function ensureLlamaExtracted(nuxtRootPath: string): Promise<string> {
  const extractDir = path.join(EXTRACT_CACHE_DIR, platformDirName());
  const executableFileName = executableName("llama");
  let executablePath: string | undefined = undefined;
  if (fs.existsSync(extractDir)) {
    executablePath = findExecutable(extractDir, executableFileName);
  }
  if (executablePath !== undefined) {
    return executablePath;
  }

  const archivePath = resolveArchivePath(nuxtRootPath);
  consola.info(`Extracting bundled llama.cpp from ${archivePath} to ${extractDir}`);
  await unzipFile(archivePath, extractDir);
  executablePath = findExecutable(extractDir, executableFileName);
  if (executablePath === undefined) {
    throw new Error(`Could not find ${executableFileName} after extracting ${archivePath}`);
  }
  if (process.platform !== "win32") {
    fs.chmodSync(executablePath, EXECUTABLE_MODE);
  }
  return executablePath;
}

export { ensureLlamaExtracted };
