// oxlint-disable promise/prefer-await-to-callbacks

// Node imports
import { fileURLToPath } from "node:url"
import path from "node:path"
import { spawn } from "node:child_process"

// Third party imports
import { BrowserWindow, app, shell } from "electron"
import { getAvailablePort } from "@geode/opengeodeweb-front/app/utils/local/microservices.js"

// Local constants
const PROCESS_WIN32_TIMEOUT = 4000
const PROCESS_LINUX_TIMEOUT = 1000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MIN_WINDOW_WIDTH = 1000
const MIN_WINDOW_HEIGHT = 700

async function create_new_window() {
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
  })
  win.setMenuBarVisibility(false)
  win.maximize()
  win.setMinimumSize(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT)

  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } })
    },
  )

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        "Access-Control-Allow-Origin": ["*"],
        "Access-Control-Allow-Methods": ["*"],
        // We use this to bypass headers
        "Access-Control-Allow-Headers": ["*"],
        ...details.responseHeaders,
      },
    })
  })
  console.log("app.isPackaged", app.isPackaged)
  if (app.isPackaged) {
    const serverPath = path.join(
      process.resourcesPath,
      "web",
      "server",
      "index.mjs",
    )

    console.log(`starting server ${serverPath}`)

    const PORT = await getAvailablePort()
    const portPrefix =
      process.platform === "win32" ? `set PORT=${PORT} &` : `PORT=${PORT}`
    const command = `${portPrefix} node ${serverPath}`
    console.log("command", command)
    const server = spawn(command, {
      encoding: "utf8",
      env: {
        ...process.env,
        RESOURCES_PATH: process.resourcesPath,
      },
      shell: true,
    })

    server.stdout.on("data", (data) =>
      console.log(`[NITRO] ${data.toString()}`),
    )
    server.stderr.on("data", (data) =>
      console.log(`[NITRO] ${data.toString()}`),
    )

    await setTimeout(
      () => {
        win.loadURL(`http://localhost:${PORT}`)
      },
      process.platform === "win32"
        ? PROCESS_WIN32_TIMEOUT
        : PROCESS_LINUX_TIMEOUT,
    )
    app.on("before-quit", async () => {
      console.log("Killing server process", { PORT })
      await fetch(`http://localhost:${PORT}/api/app/kill`, { method: "POST" })
    })
  } else {
    console.log("VITE_DEV_SERVER_URL", process.env.VITE_DEV_SERVER_URL)
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.on("ready-to-show", () => {
      win.webContents.openDevTools()
    })
  }

  win.webContents.session.clearStorageData()
  win.webContents.session.clearData(["cache"])
  win.webContents.session.clearCache(function afterClear() {
    console.log("Vease cache cleared!")
  })

  win.webContents.on("console-message", (...args) => {
    const [_event, level, message, line, sourceId] = args
    // Map log levels to readable names
    const logLevels = ["VERBOSE", "INFO", "ERROR"]
    const logLevel = logLevels[level] || "UNKNOWN"
    // Print the console message to the terminal
    console.log(`[${logLevel}] ${message} (Source: ${sourceId}, Line: ${line})`)
  })
  return win
}

export { create_new_window }
