// oxlint-disable max-dependencies
// Node imports
import child_process from "node:child_process";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { ChildProcessByStdio } from "node:child_process";
import type { Readable } from "node:stream";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Third party imports
import { consola } from "consola";

// Local imports
import { getAvailablePort, waitForReady } from "@ogw_server/utils/scripts";
import { ensureLlamaExtracted } from "@vease_server/utils/llama_cpp_archive";

interface RunningLlamaServer {
  child: ChildProcessByStdio<null, Readable, Readable>;
  apiKey: string;
  port: number;
  model: string;
}

interface LlamaServerHandle {
  port: number;
  apiKey: string;
  model: string;
}

const LLAMA_HOST = "127.0.0.1";
const DEFAULT_MODEL = "ggml-org/Qwen3.5-0.8B-GGUF:Q4_0";
const CONTEXT_SIZE = "20000";
const PARALLEL_SLOTS = "1";
const GPU_LAYERS = "99";
const MCP_TOOLS = "read_file,file_glob_search,get_info";
const READY_TIMEOUT_SECONDS = 600;
const MILLISECONDS_PER_SECOND = 1000;
const VERBOSITY = "3";

const dirname = path.dirname(new URL(import.meta.url).pathname);

let runningServer: RunningLlamaServer | undefined = undefined;
let startingServer: Promise<LlamaServerHandle> | undefined = undefined;

async function llamaServeArgs(
  model: string,
  apiKey: string,
): Promise<{ args: string[]; port: number }> {
  const port = await getAvailablePort();
  consola.info(`Starting llama.cpp server on http://${LLAMA_HOST}:${port} with model ${model}`);
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
    String(port),
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
  return { args, port };
}

async function startLlamaServer(model: string): Promise<LlamaServerHandle> {
  const nuxtRootPath = path.join(dirname, "..", "..");

  const command = await ensureLlamaExtracted(nuxtRootPath);
  const apiKey = randomUUID();
  const { args, port } = await llamaServeArgs(model, apiKey);

  const child = child_process.spawn(command, args, {
    stdio: ["ignore", "pipe", "pipe"] as const,
  });
  child.on("spawn", () => {
    consola.info(`[llama] spawned, pid=${child.pid}`);
  });
  child.on("exit", () => {
    if (runningServer?.child === child) {
      runningServer = undefined;
    }
  });

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, READY_TIMEOUT_SECONDS * MILLISECONDS_PER_SECOND);
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

  runningServer = { child, apiKey, port, model };
  return { port, apiKey, model };
}

async function runLlamaServer({
  model = DEFAULT_MODEL,
}: { model?: string } = {}): Promise<LlamaServerHandle> {
  consola.debug("runLlamaServer", { model });
  if (runningServer && !runningServer.child.killed) {
    return { port: runningServer.port, apiKey: runningServer.apiKey, model: runningServer.model };
  }

  if (startingServer) {
    return startingServer;
  }

  startingServer = startLlamaServer(model);
  try {
    return await startingServer;
  } catch (error) {
    startingServer = undefined;
    throw error;
  }
}

function stopLlamaServer(): void {
  if (runningServer) {
    runningServer.child.kill();
    runningServer = undefined;
  }
}

function getLlamaStatus(): { running: false } | { running: true; port: number; apiKey: string } {
  if (!runningServer) {
    return { running: false };
  }
  return { running: true, port: runningServer.port, apiKey: runningServer.apiKey };
}

export { getLlamaStatus, runLlamaServer, stopLlamaServer };
