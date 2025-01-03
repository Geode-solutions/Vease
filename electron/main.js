import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import child_process from "child_process";
import path from "path";
import fs from "fs";

const { getPort } = require("get-port-please");
const os = require("os");

// Checks for updates
autoUpdater.checkForUpdatesAndNotify();
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

function executable_path(app_name, microservice_name) {
  const executable = executable_name(app_name + "-" + microservice_name);
  let command;
  if (process.env.NODE_ENV === "development") {
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
  } else {
    command = path.join(resource_path(), executable);
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
const data_folder_path = path.join(os.tmpdir(), "vease");

function createPath(path) {
  if (!fs.existsSync(path)) {
    fs.mkdir(path, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`${path} directory created successfully!`);
    });
  }
}

createPath(data_folder_path);

var processes = [];

async function getAvailablePort(port) {
  const available_port = await getPort({ port, host: "localhost" });
  console.log("available_port", available_port);
  return available_port;
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
    var child = child_process.spawn(command, args, {
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
        resolve();
      }
      console.log(data);
    });

    child.stderr.on("data", (data) => {
      // Return some data to the renderer process with the mainprocess-response ID
      win.webContents.send("mainprocess-response", data);
      //Here is the output from the command
      console.log(data);
    });

    child.on("close", (code) => {
      //Here you can get the exit code of the script
    });
    child.name = command.replace(/^.*[\\/]/, "");
    processes.push(child);
  });
}

app.whenReady().then(() => {
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
  win.maximize();
  win.setMinimumSize(800, 600);

  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
    }
  );

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

  ipcMain.handle("run_back", async (event, ...args) => {
    const port = await getAvailablePort(args[0]);
    console.log("BACK PORT", port);
    const command = executable_path("vease", "back");
    console.log("command", command);
    await run_script(
      win,
      command,
      [
        "--port " + port,
        "--data_folder_path " + data_folder_path,
        "--desktop",
        "--allowed_origin ",
        "" * "",
      ],
      "Serving Flask app"
    );
    return port;
  });

  ipcMain.handle("run_viewer", async (event, ...args) => {
    const port = await getAvailablePort(args[0]);
    console.log("VIEWER PORT", port);
    const command = executable_path("vease", "viewer");
    console.log("command", command);
    await run_script(
      win,
      command,
      ["--port " + port, "--data_folder_path " + data_folder_path],
      "Starting factory"
    );
    return port;
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
    win.webContents.openDevTools();
  }
});

// App close handler
app.on("before-quit", function () {
  processes.forEach(function (proc) {
    console.log("Process %s has been killed!", proc.name);
    proc.kill();
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});
