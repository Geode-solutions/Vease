#!/usr/bin/env node
// Bridges Claude's local stdio MCP transport to Vease's HTTP /mcp endpoint
// (served by @nuxtjs/mcp-toolkit inside the running Nuxt/Nitro app) using
// the mcp-remote proxy under the hood.

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createWriteStream } from "node:fs";

const require = createRequire(import.meta.url);

const errLog = createWriteStream("/tmp/vease-mcp-bridge.log", { flags: "a" });
errLog.write(`\n--- run at ${new Date().toISOString()} ---\n`);

// Default to the local dev server; override with VEASE_MCP_URL if Vease
// is running elsewhere (a different port, the packaged desktop build, etc).
const VEASE_MCP_URL = process.env.VEASE_MCP_URL || "http://localhost:3000/mcp";

const mcpRemoteBin = require.resolve("mcp-remote/dist/proxy.js");

const child = spawn(process.execPath, [mcpRemoteBin, VEASE_MCP_URL], {
  stdio: ["inherit", "inherit", "pipe"],
  env: process.env,
});

child.stderr.pipe(errLog);
child.stderr.pipe(process.stderr);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

child.on("error", (err) => {
  console.error(`Failed to start mcp-remote bridge: ${err.message}`);
  process.exit(1);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    child.kill(sig);
  });
}