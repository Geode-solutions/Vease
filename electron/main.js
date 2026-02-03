import { app, ipcMain } from "electron"
import { autoUpdater } from "electron-updater"
import { getPort } from "get-port-please"
import os from "node:os"
import path from "node:path"
/* eslint-disable-next-line import/no-absolute-path */
import { create_new_window } from "/utils/desktop.js"
/* eslint-disable-next-line import/no-absolute-path */
import { back_microservice, viewer_microservice } from "/utils/local.js"
import {
  create_path,
  delete_folder_recursive,
  kill_back,
  kill_viewer,
  run_back,
  run_viewer,
} from "@geode/opengeodeweb-front/app/utils/local.js"
import { once } from "node:events"
import { setTimeout } from "node:timers/promises"
import { spawn } from "node:child_process"
import { v4 as uuidv4 } from "uuid"

const MIN_PORT = 5001
const MAX_PORT = 5999
const KILL_TIMEOUT = 2000

autoUpdater.checkForUpdatesAndNotify()
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
const uuid_project_folder = uuidv4()
const project_folder_path = path.join(os.tmpdir(), "vease", uuid_project_folder)
create_path(project_folder_path)

let _mainWindow = null

let back_port = 0
let viewer_port = 0

ipcMain.handle("run_back", async (_event) => {
  const { back_name, back_path } = await back_microservice()
  back_port = await run_back(back_name, back_path, {
    project_folder_path: project_folder_path,
  })
  return back_port
})
ipcMain.handle("run_viewer", async (_event) => {
  const { viewer_name, viewer_path } = await viewer_microservice()
  viewer_port = await run_viewer(viewer_name, viewer_path, {
    project_folder_path: project_folder_path,
  })
  return viewer_port
})

ipcMain.handle("new_window", () => {
  create_new_window()
})

// Extension microservices management
const extensionProcesses = new Map()

ipcMain.handle(
  "run_extension",
  async (_event, { extensionId, executablePath }) => {
    console.log(`[Electron] Launching extension microservice: ${extensionId}`)
    console.log(`[Electron] Executable path: ${executablePath}`)

    try {
      // Get a free port for the extension microservice
      const port = await getPort({ portRange: [MIN_PORT, MAX_PORT] })
      console.log(`[Electron] Extension ${extensionId} will use port ${port}`)

      // Spawn the microservice process
      const process = spawn(
        executablePath,
        ["--port", port.toString(), "--data_folder_path", project_folder_path],
        {
          stdio: "inherit",
        },
      )

      // Store the process
      extensionProcesses.set(extensionId, { process, port })

      process.on("error", (error) => {
        console.error(
          `[Electron] Extension ${extensionId} process error:`,
          error,
        )
        extensionProcesses.delete(extensionId)
      })

      process.on("exit", (code) => {
        console.log(
          `[Electron] Extension ${extensionId} process exited with code ${code}`,
        )
        extensionProcesses.delete(extensionId)
      })

      return { success: true, port }
    } catch (error) {
      console.error(
        `[Electron] Failed to launch extension ${extensionId}:`,
        error,
      )
      return { success: false, error: error.message }
    }
  },
)


/* eslint-disable promise/always-return, promise/prefer-await-to-then, promise/catch-or-return */
app.whenReady().then(function onReady() {
  _mainWindow = create_new_window()
})

let cleaned = false

async function clean_up() {
  console.log("Shutting down microservices")

  // Kill extension microservices
  const extensionKillPromises = [...extensionProcesses.values()].map(
    async ({ process, _port }) => {
      if (process && !process.killed) {
        process.kill()
        try {
          // Wait for exit or timeout
          await Promise.race([once(process, "exit"), setTimeout(KILL_TIMEOUT)])
        } catch {
          // Ignore errors during kill wait
        }
      }
    },
  )

  await Promise.all([
    kill_back(back_port),
    kill_viewer(viewer_port),
    ...extensionKillPromises,
  ])
  delete_folder_recursive(project_folder_path)
  cleaned = true
  console.log("end clean")
}

app.on("before-quit", async function onBeforeQuit(event) {
  if (!cleaned) {
    event.preventDefault()
    try {
      await clean_up()
      app.quit()
    } catch (error) {
      console.error("Cleanup failed", error)
      app.quit()
    }
  }
})

app.on("window-all-closed", () => {
  console.log("All windows are closed")
  app.quit()
})

app.on("quit", () => {
  console.log("Quitting Vease...")
})
