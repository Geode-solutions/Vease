import { app, ipcMain } from "electron"
import { autoUpdater } from "electron-updater"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import {
  create_path,
  kill_back,
  kill_viewer,
  run_back,
  run_viewer,
  delete_folder_recursive,
} from "@geode/opengeodeweb-front/app/utils/local.js"
import { create_new_window } from "/utils/desktop.js"
import { back_microservice, viewer_microservice } from "/utils/local.js"

import os from "os"

autoUpdater.checkForUpdatesAndNotify()
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
const uuid_project_folder = uuidv4()
const project_folder_path = path.join(os.tmpdir(), "vease", uuid_project_folder)
create_path(project_folder_path)

let mainWindow = null

let back_port = 0
let viewer_port = 0

ipcMain.handle("run_back", async (_event) => {
  const { back_name, back_path } = back_microservice()
  back_port = await run_back(back_name, back_path, {
    project_folder_path: project_folder_path,
  })
  return back_port
})
ipcMain.handle("run_viewer", async (_event) => {
  const { viewer_name, viewer_path } = viewer_microservice()
  viewer_port = await run_viewer(viewer_name, viewer_path, {
    project_folder_path: project_folder_path,
  })
  return viewer_port
})

ipcMain.handle("new_window", async (_event) => {
  const _new_window = create_new_window()
})

// Extension microservices management
const extensionProcesses = new Map()

ipcMain.handle("run_extension", async (_event, { extensionId, executablePath }) => {
  console.log(`[Electron] Launching extension microservice: ${extensionId}`)
  console.log(`[Electron] Executable path: ${executablePath}`)
  
  try {
    const { spawn } = await import("child_process")
    const getPort = (await import("get-port-please")).getPort
    
    // Get a free port for the extension microservice
    const port = await getPort({ portRange: [5001, 5999] })
    console.log(`[Electron] Extension ${extensionId} will use port ${port}`)
    
    // Spawn the microservice process
    const process = spawn(executablePath, ["--port", port.toString(), "--data_folder_path", project_folder_path], {
      stdio: "inherit",
    })
    
    // Store the process
    extensionProcesses.set(extensionId, { process, port })
    
    process.on("error", (error) => {
      console.error(`[Electron] Extension ${extensionId} process error:`, error)
      extensionProcesses.delete(extensionId)
    })
    
    process.on("exit", (code) => {
      console.log(`[Electron] Extension ${extensionId} process exited with code ${code}`)
      extensionProcesses.delete(extensionId)
    })
    
    return { success: true, port }
  } catch (error) {
    console.error(`[Electron] Failed to launch extension ${extensionId}:`, error)
    return { success: false, error: error.message }
  }
})


app.whenReady().then(() => {
  mainWindow = create_new_window()
})

let cleaned = false

async function clean_up() {
  return new Promise((resolve) => {
    console.log("Shutting down microservices")
    
    // Kill extension microservices
    const extensionKillPromises = Array.from(extensionProcesses.values()).map(({ process, port }) => {
      return new Promise((resolveKill) => {
        if (process && !process.killed) {
          process.kill()
        }
        resolveKill()
      })
    })
    
    Promise.all([
      kill_back(back_port),
      kill_viewer(viewer_port),
      ...extensionKillPromises
    ]).then(() => {
      delete_folder_recursive(project_folder_path)
      cleaned = true
      console.log("end clean")
      resolve()
    })
  })
}

app.on("before-quit", function (event) {
  if (!cleaned) {
    event.preventDefault()
    clean_up().then(() => app.quit())
  }
})

app.on("window-all-closed", () => {
  console.log("All windows are closed")
  app.quit()
})

app.on("quit", () => {
  console.log("Quitting Vease...")
})
