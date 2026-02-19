// Standard library imports
import os from "node:os"
import path from "node:path"

// Third party imports
import { app, ipcMain } from "electron"
import { autoUpdater } from "electron-updater"
import { v4 as uuidv4 } from "uuid"
import {
  create_path,
  delete_folder_recursive,
  kill_back,
  kill_viewer,
  run_back,
  run_viewer,
} from "@geode/opengeodeweb-front/app/utils/local.js"
import { killExtensionMicroservices } from "@geode/opengeodeweb-front/app/utils/extension.js"

// Local imports
/* eslint-disable-next-line import/no-absolute-path */
import { create_new_window } from "/utils/desktop.js"
/* eslint-disable-next-line import/no-absolute-path */
import { back_microservice, viewer_microservice } from "/utils/local.js"

const projectName = "vease"

let back_port = 0
let viewer_port = 0

autoUpdater.checkForUpdatesAndNotify()
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
const uuid_project_folder = uuidv4()
const project_folder_path = path.join(os.tmpdir(), "vease", uuid_project_folder)
create_path(project_folder_path)

let _mainWindow = null

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

/* eslint-disable promise/always-return, promise/prefer-await-to-then, promise/catch-or-return */
app.whenReady().then(function onReady() {
  _mainWindow = create_new_window()
})

let cleaned = false

async function clean_up() {
  console.log("Shutting down microservices")

  await Promise.all([
    kill_back(back_port),
    kill_viewer(viewer_port),
    ...killExtensionMicroservices(),
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
