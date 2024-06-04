import { app, BrowserWindow, ipcMain } from "electron";
import { updateElectronApp } from "update-electron-app";
import child_process from "child_process";
import path from "path";

const { getPort } = require("get-port-please");

// Checks for updates
updateElectronApp();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

async function getAvailablePort(port) {
  console.log("getAvailablePort", port);
  const available_port = await getPort({ port });
  console.log("available_port", available_port);

  return available_port;
}

function run_script(command, args, callback) {
  console.log("run_script", command, args);
  var child = child_process.spawn(command, args, {
    encoding: "utf8",
    shell: true,
  });
  // You can also use a variable to save the output for when the script closes later
  // child.on("error", (error) => {
  //   dialog.showMessageBox({
  //     title: "Title",
  //     type: "warning",
  //     message: "Error occured.\r\n" + error,
  //   });
  // });

  // child.stdout.setEncoding("utf8");
  // child.stdout.on("data", (data) => {
  //   //Here is the output
  //   data = data.toString();
  //   console.log(data);
  // });

  // child.stderr.setEncoding("utf8");
  // child.stderr.on("data", (data) => {
  //   // Return some data to the renderer process with the mainprocess-response ID
  //   mainWindow.webContents.send("mainprocess-response", data);
  //   //Here is the output from the command
  //   console.log(data);
  // });

  // child.on("close", (code) => {
  //   //Here you can get the exit code of the script
  //   switch (code) {
  //     case 0:
  //       dialog.showMessageBox({
  //         title: "Title",
  //         type: "info",
  //         message: "End process.\r\n",
  //       });
  //       break;
  //   }
  // });
  if (typeof callback === "function") callback();
}

app.whenReady().then(() => {
  ipcMain.handle("run_back", async (event, ...args) => {
    console.log("HANDLE", args);
    const port = await getAvailablePort(args[0]);
    console.log("RESULT FROM MAIN", port);

    run_script("npm run install_back", [], () => {
      console.log("DONE 1");
    });
    run_script("geodeapp_server", ["--port " + port], () => {
      console.log("DONE 2");
    });

    return port;
  });

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
