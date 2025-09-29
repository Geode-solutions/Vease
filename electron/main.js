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
} from "/utils/local.js"
import { create_new_window } from "/utils/desktop.js"

import os from "os"

autoUpdater.checkForUpdatesAndNotify()
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
const uuid_project_folder = uuidv4()
const project_folder_path = path.join(os.tmpdir(), "vease", uuid_project_folder)
create_path(project_folder_path)

let mainWindow = null

let back_port = 0
let viewer_port = 0

ipcMain.handle("run_back", async (_event, ...args) => {
  back_port = await run_back(args[0], project_folder_path)
  return back_port
})
ipcMain.handle("run_viewer", async (_event, ...args) => {
  viewer_port = await run_viewer(args[0], project_folder_path)
  return viewer_port
})

ipcMain.handle("new_window", async (_event) => {
  const _new_window = create_new_window()
})

app.whenReady().then(() => {
  mainWindow = create_new_window()
})

let cleaned = false

async function clean_up() {
  console.log("Shutting down microservices")
  kill_back(back_port)
  await kill_viewer(viewer_port)
  delete_folder_recursive(project_folder_path)
  cleaned = true
  console.log("end clean")
}

app.on("before-quit", async function (event) {
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
