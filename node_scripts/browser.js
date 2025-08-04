import {
  create_path,
  kill_processes,
  run_back,
  run_viewer,
} from "../utils/local.js";
import { spawn } from "child_process";
import path from "path";
import os from "os";

const data_folder_path = create_path(path.join(os.tmpdir(), "vease"));

async function run_microservices() {
  const back_promise = run_back(5000, data_folder_path);
  const viewer_promise = run_viewer(1234, data_folder_path);
  const [back_port, viewer_port] = await Promise.all([
    back_promise,
    viewer_promise,
  ]);
  process.env.GEODE_PORT = back_port;
  process.env.VIEWER_PORT = viewer_port;
}
await run_microservices();
process.env.BROWSER = true;

console.log("process.argv", process.argv);
const nuxt_process = spawn("npm", ["run", process.argv[2]], {
  stdio: "inherit",
});

process.on("SIGINT", async () => {
  await kill_processes();
  console.log("Quitting Vease...");
  process.exit(0);
});
