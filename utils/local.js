// Node.js imports
import fs from "fs";
import path from "path";
import child_process from "child_process";
import { spawn } from "child_process";
import os from "os";

// Third party imports
import pkg from "electron";
const { app, dialog } = pkg;
import { getPort } from "get-port-please";
import pidtree from "pidtree";
import isElectron from "is-electron";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Global variables
var processes = [];

function venv_script_path(root_path, microservice_path) {
  const venv_path = path.join(root_path, microservice_path, "venv");
  var script_path;
  if (process.platform === "win32") {
    script_path = path.join(venv_path, "Scripts");
  } else {
    script_path = path.join(venv_path, "bin");
  }
  return script_path;
}

function executable_path(microservice_path) {
  if (isElectron()) {
    if (app.isPackaged) {
      return process.resourcesPath;
    } else {
      return venv_script_path(app.getAppPath(), microservice_path);
    }
  } else {
    return venv_script_path(process.cwd(), microservice_path);
  }
}

function executable_name(name) {
  if (process.platform === "win32") {
    return name + ".exe";
  }
  return name;
}

function create_path(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    console.log(`${path} directory created successfully!`);
  }
  return path;
}

async function get_available_port(port) {
  const available_port = await getPort({
    random: true,
    port,
    host: "localhost",
  });
  console.log("available_port", available_port);
  return available_port;
}

async function kill_processes() {
  console.log("kill_processes", processes);
  await processes.forEach(async function (proc) {
    console.log(`Process ${proc} will be killed!`);
    try {
      process.kill(proc);
    } catch (error) {
      console.log(`${error} Process ${proc} could not be killed!`);
    }
  });
}

function register_children_processes(proc) {
  pidtree(proc.pid, { root: true }, function (err, pids) {
    if (err) console.log("err", err);
    processes.push(...pids);
  });
}

async function run_script(
  command,
  args,
  expected_response,
  timeout_seconds = 30
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Timed out after " + timeout_seconds + " seconds");
    }, timeout_seconds * 1000);
    const child = child_process.spawn(command, args, {
      encoding: "utf8",
      shell: true,
    });
    register_children_processes(child);

    // You can also use a variable to save the output for when the script closes later
    child.stderr.setEncoding("utf8");
    child.on("error", (error) => {
      dialog.showMessageBox({
        title: "Title",
        type: "warning",
        message: "Error occured.\r\n" + error,
      });
    });
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (data) => {
      //Here is the output
      data = data.toString();
      if (data.includes(expected_response)) {
        register_children_processes(child);
        resolve(child);
      }
      console.log(data);
    });

    child.stderr.on("data", (data) => {
      console.log(data);
    });

    child.on("close", (_code) => {
      //Here you can get the exit code of the script
      console.log("Child Process exited with code " + _code);
    });
    child.on("kill", () => {
      console.log("Child Process killed");
    });
    child.name = command.replace(/^.*[\\/]/, "");
    return child;
  });
}

async function run_back(port, project_folder_path) {
  return new Promise(async (resolve, reject) => {
    const back_command = path.join(
      executable_path(path.join("microservices", "back")),
      executable_name("vease-back")
    );
    const back_port = await get_available_port(port);
    const back_args = [
      "--port " + back_port,
      "--data_folder_path " + project_folder_path,
      "--upload_folder_path " + path.join(project_folder_path, "uploads"),
      "--allowed_origin http://localhost:*",
      "--timeout " + 0,
    ];
    await run_script(back_command, back_args, "Serving Flask app");
    resolve(back_port);
  });
}

async function run_viewer(port, data_folder_path) {
  return new Promise(async (resolve, reject) => {
    const viewer_command = path.join(
      executable_path(path.join("microservices", "viewer")),
      executable_name("vease-viewer")
    );
    const viewer_port = await get_available_port(port);
    const viewer_args = [
      "--port " + viewer_port,
      "--data_folder_path " + data_folder_path,
      "--timeout " + 0,
    ];
    await run_script(viewer_command, viewer_args, "Starting factory");
    resolve(viewer_port);
  });
}

function delete_folder_recursive(data_folder_path) {
  if (!fs.existsSync(data_folder_path)) {
    console.log(`Folder ${data_folder_path} does not exist.`);
    return;
  }
  try {
    fs.rmSync(data_folder_path, { recursive: true, force: true });
    console.log(`Deleted folder: ${data_folder_path}`);
  } catch (err) {
    console.error(`Error deleting folder ${data_folder_path}:`, err);
  }
}

async function run_browser(script_name) {
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
  process.on("SIGINT", async () => {
    await kill_processes();
    console.log("Quitting Vease...");
    process.exit(0);
  });

  console.log("process.argv", process.argv);

  const nuxt_port = await get_available_port();
  console.log("nuxt_port", nuxt_port);
  return new Promise((resolve, reject) => {
    process.env.NUXT_PORT = nuxt_port;
    const nuxt_process = spawn("npm", ["run", script_name], {
      shell: true,
    });
    nuxt_process.stdout.on("data", function (data) {
      const output = data.toString();
      console.log("NUXT OUTPUT", output);
      const portMatch = output.match(
        /Accepting\ connections\ at\ http:\/\/localhost:(\d+)/
      );
      if (portMatch) {
        resolve(portMatch[1]);
        return;
      }
    });
  });
}

export {
  create_path,
  delete_folder_recursive,
  executable_name,
  executable_path,
  get_available_port,
  kill_processes,
  register_children_processes,
  run_script,
  run_back,
  run_viewer,
  run_browser,
};
