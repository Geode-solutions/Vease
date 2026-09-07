// Node imports
import child_process from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Local imports
import { appMode } from "@geode/opengeodeweb-front/shared/app_mode.js";
import { executableName } from "@geode/opengeodeweb-front/server/utils/path.js";
import { unzipFile } from "@geode/opengeodeweb-front/server/utils/server.js";
import { waitForReady } from "@geode/opengeodeweb-front/server/utils/scripts.js";

const LLAMA_HOST = "127.0.0.1";

const LLAMA_PORT = 54_321;
const DEFAULT_MODEL = "ggml-org/Qwen3.5-0.8B-GGUF:Q4_0";
const CONTEXT_SIZE = "20000";
const PARALLEL_SLOTS = "1";
const GPU_LAYERS = "99";
const MCP_TOOLS = "read_file,file_glob_search,get_info";
const EXECUTABLE_MODE = "755";
const READY_TIMEOUT_SECONDS = 600;
const MILLISECONDS_PER_SECOND = 1000;

const EXTRACT_CACHE_DIR = path.join(os.homedir(), ".vease", "llama_cpp");
const dirname = path.dirname(new URL(import.meta.url).pathname);

let runningServer = undefined;

function platformDirName() {
  if (process.platform === "win32") {
    return "win-x64";
  }
  if (process.platform === "linux") {
    return "ubuntu-x64";
  }
  throw new Error(`Unsupported platform for bundled llama.cpp: ${process.platform}`);
}


function archiveFileName() {
  return `llama-b10809-bin-${platformDirName()}.zip`;
}

function resolveArchivePath(nuxtRootPath) {
  const mode = process.env.MODE;
  const nodeEnv = process.env.NODE_ENV;
  if (mode === appMode.DESKTOP && nodeEnv === "production") {
    return path.join(process.env.RESOURCES_PATH, "llama_cpp", archiveFileName());
  }
  
  return path.join(nuxtRootPath, "third_parties", "llama_cpp", archiveFileName());
}

async function ensureLlamaExtracted(nuxtRootPath) {
  const extractDir = path.join(EXTRACT_CACHE_DIR, platformDirName());
  const executablePath = path.join(extractDir, executableName("llama"));
  if (fs.existsSync(executablePath)) {
    return executablePath;
  }

  const archivePath = resolveArchivePath(nuxtRootPath);
  console.log(`Extracting bundled llama.cpp from ${archivePath} to ${extractDir}`);
  await unzipFile(archivePath, extractDir);
  if (process.platform !== "win32") {
    fs.chmodSync(executablePath, EXECUTABLE_MODE);
  }
  return executablePath;
}

function llamaServeArgs(model, apiKey) {
  return [
    "serve",
    "-hf",
    model,
    "--jinja",
    "-c",
    CONTEXT_SIZE,
    "-np",
    PARALLEL_SLOTS,
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
    "--tools",
    MCP_TOOLS,
  ];
}

async function runLlamaServer({ model = DEFAULT_MODEL } = {}) {
  if (runningServer && !runningServer.child.killed) {
    return { port: LLAMA_PORT, apiKey: runningServer.apiKey };
  }

  const nuxtRootPath = path.join(dirname, "..", "..")

  const command = await ensureLlamaExtracted(nuxtRootPath);
  const apiKey = randomUUID();
  const args = llamaServeArgs(model, apiKey);
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

  runningServer = { child, apiKey };
  return { port: LLAMA_PORT, apiKey };
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
  return { running: true, port: LLAMA_PORT, apiKey: runningServer.apiKey };
}

export { getLlamaStatus, runLlamaServer, stopLlamaServer };
