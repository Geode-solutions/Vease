import { app, BrowserWindow, ipcMain } from "electron";
import { updateElectronApp } from "update-electron-app";
import child_process from "child_process";
import path from "path";

const { getPort } = require("get-port-please");

// Checks for updates
updateElectronApp();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

async function getAvailablePort(port) {
  const available_port = await getPort({ port });
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
      switch (code) {
        case 0:
          dialog.showMessageBox({
            title: "Title",
            type: "info",
            message: "End process.\r\n",
          });
          break;
      }
    });
  });
}

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: "Vease - New project",
    icon: "public/favicon.ico",
    center: true,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setMinimumSize(800, 600);

  ipcMain.handle("run_back", async (event, ...args) => {
    const port = await getAvailablePort(args[0]);
    console.log("BACK PORT", port);
    await run_script(
      win,
      "./dist_back/geodeapp_back",
      ["--port " + port],
      "Serving Flask app"
    );
    return port;
  });

  ipcMain.handle("run_viewer", async (event, ...args) => {
    const port = await getAvailablePort(args[0]);
    console.log("VIEWER PORT", port);
    await run_script(
      win,
      "./dist_viewer/geodeapp_viewer",
      ["--port " + port],
      "Starting factory"
    );
    return port;
  });

  if (app.isPackaged) {
    win.loadFile("../index.html");
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});
