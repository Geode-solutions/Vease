// Node imports
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Local imports
import { getAvailablePort, waitForReady } from "@geode/opengeodeweb-front/server/utils/scripts.js";
import { appMode } from "@geode/opengeodeweb-front/shared/app_mode.js";
import { executableName } from "@geode/opengeodeweb-front/server/utils/path.js";
import { unzipFile } from "@geode/opengeodeweb-front/server/utils/server.js";

const LLAMA_HOST = "127.0.0.1";
let LLAMA_PORT = undefined;
const DEFAULT_MODEL = "ggml-org/Qwen3.5-0.8B-GGUF:Q4_0";
const CONTEXT_SIZE = "20000";
const PARALLEL_SLOTS = "1";
const GPU_LAYERS = "99";
const MCP_TOOLS = "read_file,file_glob_search,get_info";
const EXECUTABLE_MODE = "755";
const READY_TIMEOUT_SECONDS = 600;
const MILLISECONDS_PER_SECOND = 1000;
const VERBOSITY = 3;

const EXTRACT_CACHE_DIR = path.join(os.homedir(), ".vease", "llama_cpp");
const dirname = path.dirname(new URL(import.meta.url).pathname);

let runningServer = undefined;
let startingServer = undefined;

function platformDirName() {
  if (process.platform === "win32") {
    return "win-x64";
  }
  if (process.platform === "linux") {
    return "ubuntu-x64";
  }
  throw new Error(`Unsupported platform for bundled llama.cpp: ${process.platform}`);
}

function platformArchiveExtension() {
  if (process.platform === "win32") {
    return "zip";
  }
  if (process.platform === "linux") {
    return "tar.gz";
  }
  throw new Error(`Unsupported platform for bundled llama.cpp: ${process.platform}`);
}

function archiveFileName() {
  return `llama-b10809-bin-${platformDirName()}.${platformArchiveExtension()}`;
}

function resolveArchivePath(nuxtRootPath) {
  const mode = process.env.MODE;
  const nodeEnv = process.env.NODE_ENV;
  if (mode === appMode.DESKTOP && nodeEnv === "production") {
    return path.join(process.env.RESOURCES_PATH, "llama_cpp", archiveFileName());
  }

  return path.join(nuxtRootPath, "third_parties", "llama_cpp", archiveFileName());
}

function findExecutable(dir, executableFileName) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findExecutable(fullPath, executableFileName);
      if (found) {
        return found;
      }
    } else if (entry.name === executableFileName) {
      return fullPath;
    }
  }
  return undefined;
}

async function ensureLlamaExtracted(nuxtRootPath) {
  const extractDir = path.join(EXTRACT_CACHE_DIR, platformDirName());
  const executableFileName = executableName("llama");
  let executablePath = fs.existsSync(extractDir)
    ? findExecutable(extractDir, executableFileName)
    : undefined;
  if (executablePath) {
    return executablePath;
  }

  const archivePath = resolveArchivePath(nuxtRootPath);
  console.log(`Extracting bundled llama.cpp from ${archivePath} to ${extractDir}`);
  await unzipFile(archivePath, extractDir);
  executablePath = findExecutable(extractDir, executableFileName);
  if (!executablePath) {
    throw new Error(`Could not find ${executableFileName} after extracting ${archivePath}`);
  }
  if (process.platform !== "win32") {
    fs.chmodSync(executablePath, EXECUTABLE_MODE);
  }
  return executablePath;
}

async function llamaServeArgs(model, apiKey) {
  LLAMA_PORT = await getAvailablePort();
  console.log(
    `Starting llama.cpp server on http://${LLAMA_HOST}:${LLAMA_PORT} with model ${model}`,
  );
  const args = [
    "serve",
    "-hf",
    model,
    "--jinja",
    "-c",
    CONTEXT_SIZE,
    "-np",
    PARALLEL_SLOTS,
    "-lv",
    VERBOSITY,
    "--api-key",
    apiKey,
    "--host",
    LLAMA_HOST,
    "--no-mmproj",
    "-ngl",
    GPU_LAYERS,
    "--port",
    String(LLAMA_PORT),
    "--ui-mcp-proxy",
    "--ui-config",
    JSON.stringify({
      mcpServers: JSON.stringify([
        {
          id: "vease",
          enabled: true,
          name: "Vease",
          url: "http://localhost:3000/mcp",
          requestTimeoutSeconds: 300,
          useProxy: true,
        },
      ]),
    }),

    "--tools",
    MCP_TOOLS,
  ];
  return { args, port: LLAMA_PORT };
}

async function startLlamaServer(model) {
  const nuxtRootPath = path.join(dirname, "..", "..");

  const command = await ensureLlamaExtracted(nuxtRootPath);
  const apiKey = randomUUID();
  const { args, port } = await llamaServeArgs(model, apiKey);
  console.log("runLlamaServer", command, args);

  const child = child_process.spawn(command, args, {
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.name = "llama";
  child.on("spawn", () => {
    console.log(`[${child.name}] spawned, pid=${child.pid}`);
  });
  child.on("exit", () => {
    if (runningServer?.child === child) {
      runningServer = undefined;
    }
  });

  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    READY_TIMEOUT_SECONDS * MILLISECONDS_PER_SECOND,
  );
  if (typeof timer.unref === "function") {
    timer.unref();
  }
  try {
    await waitForReady(child, "listening on", controller.signal);
    clearTimeout(timer);
  } catch (error) {
    clearTimeout(timer);
    child.kill();
    throw error;
  }

  runningServer = { child, apiKey, port };
  return { port, apiKey };
}

async function runLlamaServer({ model = DEFAULT_MODEL } = {}) {
  console.log("runLlamaServer", { model });
  if (runningServer && !runningServer.child.killed) {
    return { port: runningServer.port, apiKey: runningServer.apiKey, model };
  }

  if (startingServer) {
    console.log("runLlamaServer", { startingServer });
    return startingServer;
  }

  try {
    startingServer = await startLlamaServer(model);
    return startingServer;
  } catch (error) {
    startingServer = undefined;
    throw error;
  }
}

function stopLlamaServer() {
  if (runningServer) {
    runningServer.child.kill();
    runningServer = undefined;
  }
}

function getLlamaStatus() {
  if (!runningServer) {
    return { running: false };
  }
  return { running: true, port: runningServer.port, apiKey: runningServer.apiKey };
}

export { getLlamaStatus, runLlamaServer, stopLlamaServer };
