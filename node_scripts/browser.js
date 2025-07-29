// run microservies
// setup env
// run nuxt
// on ctrl+C KILL

import { run_back, run_viewer } from "../utils/local.js";
import { spawn } from "child_process";

async function run_microservices() {
  const back_port = await run_back();
  const viewer_port = await run_viewer();
  process.env.GEODE_PORT = back_port;
  process.env.VIEWER_PORT = viewer_port;
}
console.log("before run_microservices");
await run_microservices();
console.log("after run_microservices");
console.log("process.env.GEODE_PORT", process.env.GEODE_PORT);
console.log("process.env.VIEWER_PORT", process.env.VIEWER_PORT);
process.env.BROWSER = true;

const child = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
});

child.webContents.session.webRequest.onBeforeSendHeaders(
  (details, callback) => {
    callback({
      responseHeaders: {
        "Access-Control-Allow-Origin": ["*"],
        "Access-Control-Allow-Methods": ["*"],
        // We use this to bypass headers
        "Access-Control-Allow-Headers": ["*"],
        ...details.responseHeaders,
      },
    });
  }
);

child.on("close", async (code) => {
  await kill_processes();
  console.log(`child process exited with code ${code}`);
});
