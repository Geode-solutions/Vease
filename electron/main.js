// Standard library imports

// Third party imports
import { app, ipcMain } from "electron"
import { autoUpdater } from "electron-updater"
import {
  delete_folder_recursive,
  kill_back,
  kill_viewer,
} from "@geode/opengeodeweb-front/app/utils/local.js"
import { killExtensionMicroservices } from "@geode/opengeodeweb-front/app/utils/extension.js"

// Local imports
/* eslint-disable-next-line import/no-absolute-path */
import { create_new_window } from "../utils/desktop.js"
/* eslint-disable-next-line import/no-absolute-path */

autoUpdater.checkForUpdatesAndNotify()
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
let project_folder_path = ""
let _mainWindow = null

ipcMain.handle("new_window", () => {
  create_new_window()
})

ipcMain.handle("project_folder_path", (_event, args) => {
  project_folder_path = args.project_folder_path
  return
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
      process.exit(1)
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
