// run microservies
// setup env
// run nuxt
// on ctrl+C KILL

import { create_path, run_back, run_viewer } from "../utils/local.js";
import { spawn } from "child_process";
import path from "path";
import os from "os";

const data_folder_path = create_path(path.join(os.tmpdir(), "vease"));

async function run_microservices() {
  const back_port = await run_back(5000, data_folder_path);
  const viewer_port = await run_viewer(1234, data_folder_path);
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

// child;

// child.webContents.session.webRequest.onBeforeSendHeaders(
//   (details, callback) => {
//     callback({
//       responseHeaders: {
//         "Access-Control-Allow-Origin": ["*"],
//         "Access-Control-Allow-Methods": ["*"],
//         // We use this to bypass headers
//         "Access-Control-Allow-Headers": ["*"],
//         ...details.responseHeaders,
//       },
//     });
//   }
// );

child.on("close", async (code) => {
  await kill_processes();
  console.log(`child process exited with code ${code}`);
});
