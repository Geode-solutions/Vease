import { app, ipcMain } from "electron"
import { autoUpdater } from "electron-updater"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import {
  create_path,
  delete_folder_recursive,
} from "@geode/opengeodeweb-front/app/utils/local.js"
import { create_new_window } from "/utils/desktop.js"
import { get_microservices_config } from "/utils/local.js"

import os from "os"

autoUpdater.checkForUpdatesAndNotify()
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
const uuid_project_folder = uuidv4()
const project_folder_path = path.join(os.tmpdir(), "vease", uuid_project_folder)
create_path(project_folder_path)

let mainWindow = null

const microservice_ports = new Map()
// Generic microservice registration
function registerMicroserviceHandlers(microservices_config) {
  microservices_config.forEach(({ name, runner_name, config_getter, runner_function, killer_function }) => {
    ipcMain.handle(runner_name, async (_event) => {
      const config = config_getter()
      const port = await runner_function(config.name, config.path, {
        project_folder_path: project_folder_path,
      })
      microservice_ports.set(name, { port, killer: killer_function })
      return port
    })
  })
}

// Register all microservices
const microservices_config = get_microservices_config()
registerMicroserviceHandlers(microservices_config)


ipcMain.handle("new_window", async (_event) => {
  const _new_window = create_new_window()
})

app.whenReady().then(() => {
  mainWindow = create_new_window()
})

let cleaned = false

async function clean_up() {
  return new Promise((resolve) => {
    console.log("Shutting down microservices")
    const kill_promises = []
    
    // Kill all registered microservices
    for (const [name, { port, killer }] of microservice_ports.entries()) {
      console.log(`Killing microservice: ${name} on port ${port}`)
      kill_promises.push(killer(port))
    }
    
    Promise.all(kill_promises).then(() => {
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
