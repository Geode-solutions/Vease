// Standard library imports
import os from "os"
import path from "path"
import { v4 as uuidv4 } from "uuid"
// Third party imports

// Local imports
import {
  create_path,
  executable_name,
  executable_path,
  run_browser,
} from "@geode/opengeodeweb-front/utils/local.js"

function back_microservice() {
  const back_path = executable_path(path.join("microservices", "back"))
  const back_bin = executable_name("vease-back")
  const back_full_path = path.join(back_path, back_bin)
  return { back_name: back_full_path, back_path: "" }
}

function viewer_microservice() {
  const viewer_path = executable_path(path.join("microservices", "viewer"))
  const viewer_bin = executable_name("vease-viewer")
  const viewer_full_path = path.join(viewer_path, viewer_bin)
  return { viewer_name: viewer_full_path, viewer_path: "" }
}

function run_browser_wrapper(script_name) {
  const project_folder_path = create_path(
    path.join(os.tmpdir(), "vease", uuidv4()),
  )
  console.log("project_folder_path", project_folder_path)
  const { back_name, back_path } = back_microservice()
  console.log("back_command", back_path, back_name)
  const { viewer_name, viewer_path } = viewer_microservice()
  console.log("viewer_command", viewer_path, viewer_name)
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
