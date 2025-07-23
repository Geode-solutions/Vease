// Node.js imports
import fs from "fs";
import path from "path";
import child_process from "child_process";

// Third party imports
import { app, BrowserWindow, dialog } from "electron";
import { getPort } from "get-port-please";
import pidtree from "pidtree";

function executable_path(app_name, microservice_name) {
  const executable = executable_name(app_name + "-" + microservice_name);
  var command;
  if (app.isPackaged) {
    command = path.join(resource_path(), executable);
  } else {
    command = path.join(
      app.getAppPath(),
      "electron-server",
      microservice_name,
      "venv"
    );
    if (process.platform === "win32") {
      command = path.join(command, "Scripts");
    } else {
      command = path.join(command, "bin");
    }
    command = path.join(command, executable);
  }
  return command;
}

function resource_path() {
  if (app.isPackaged) {
    return process.resourcesPath;
  }
  return app.getAppPath();
}

function executable_name(name) {
  if (process.platform === "win32") {
    return name + ".exe";
  }
  return name;
}

function create_path(path) {
  if (!fs.existsSync(path)) {
    fs.mkdir(path, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`${path} directory created successfully!`);
    });
  }
}

async function get_available_port(port) {
  const available_port = await getPort({ port, host: "localhost" });
  console.log("available_port", available_port);
  return available_port;
}

async function killProcesses(processes) {
  console.log("killProcesses", processes);
  await processes.forEach(async function (proc) {
    console.log(`Process ${proc} will be killed!`);
    try {
      process.kill(proc);
    } catch (error) {
      console.log(`${error} Process ${proc} could not be killed!`);
    }
  });
}

function registerChildProcesses(proc, processes) {
  pidtree(proc.pid, { root: true }, function (err, pids) {
    if (err) console.log("err", err);
    processes.push(...pids);
  });
  return processes;
}

function create_new_window() {
  const win = new BrowserWindow({
    title: "Vease - New project",
    icon: process.platform === "win32" ? "public/logo.ico" : "public/logo.png",
    center: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMenuBarVisibility(false);
  win.maximize();
  win.setMinimumSize(1000, 700);

  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
    }
  );

  win.webContents.setWindowOpenHandler(({ url }) => {
    require("electron").shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        "Access-Control-Allow-Origin": ["*"],
        "Access-Control-Allow-Methods": ["*"],
        // We use this to bypass headers
        "Access-Control-Allow-Headers": ["*"],
        ...details.responseHeaders,
      },
    });
  });
  if (app.isPackaged) {
    const app_path = path.join(
      app.getAppPath(),
      ".output",
      "public",
      "index.html"
    );
    console.log("APP_PATH", app_path);
    win.loadFile(app_path);
  } else {
    console.log("VITE_DEV_SERVER_URL", process.env.VITE_DEV_SERVER_URL);
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.on("ready-to-show", () => {
      win.webContents.openDevTools();
      // win.webContents.openDevTools({ mode: "detach" });
    });
  }

  win.webContents.on(
    "console-message",
    (event, level, message, line, sourceId) => {
      // Map log levels to readable names
      const logLevels = ["VERBOSE", "INFO", "WARNING", "ERROR"];
      const logLevel = logLevels[level] || "UNKNOWN";
      // Print the console message to the terminal
      console.log(
        `[${logLevel}] ${message} (Source: ${sourceId}, Line: ${line})`
      );
    }
  );
  return win;
}

async function run_script(
  win,
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
        resolve(child);
      }
      console.log(data);
    });

    child.stderr.on("data", (data) => {
      // Return some data to the renderer process with the mainprocess-response ID
      win.webContents.send("mainprocess-response", data);
      //Here is the output from the command
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

export {
  executable_path,
  resource_path,
  get_available_port,
  executable_name,
  create_path,
  killProcesses,
  registerChildProcesses,
  create_new_window,
  run_script,
};
