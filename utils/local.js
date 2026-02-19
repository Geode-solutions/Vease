// Standard library imports
import os from "node:os"
import path from "node:path"
import { v4 as uuidv4 } from "uuid"
// Third party imports
import {
  create_path,
  executable_name,
  executable_path,
  run_browser,
} from "@geode/opengeodeweb-front/app/utils/local.js"
import { runExtensions } from "@geode/opengeodeweb-front/app/utils/extension.js"

// Local constants
const projectName = "vease"

async function back_microservice() {
  const back_path = await executable_path(path.join("microservices", "back"))
  const back_name = executable_name("vease-back")
  return { back_name, back_path }
}

async function viewer_microservice() {
  const viewer_path = await executable_path(
    path.join("microservices", "viewer"),
  )
  const viewer_name = executable_name("vease-viewer")
  return { viewer_name, viewer_path }
}

async function run_browser_wrapper(script_name) {
  const project_folder_path = create_path(
    path.join(os.tmpdir(), "vease", uuidv4()),
  )
  console.log("project_folder_path", project_folder_path)
  const { back_name, back_path } = await back_microservice()
  console.log("back_command", back_path, back_name)
  const { viewer_name, viewer_path } = await viewer_microservice()
  console.log("viewer_command", viewer_path, viewer_name)

  const extensions_folder_path = path.join(project_folder_path, "extensions")
  await runExtensions(projectName, extensions_folder_path)

  return run_browser(script_name, {
    back: {
      executable_name: back_name,
      executable_path: back_path,
      args: {
        project_folder_path,
        upload_folder_path: path.join(project_folder_path, "upload"),
      },
    },
    viewer: {
      executable_name: viewer_name,
      executable_path: viewer_path,
      args: { project_folder_path },
    },
  })
}

export { run_browser_wrapper, back_microservice, viewer_microservice }
