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

function run_browser_wrapper(script_name) {
  const project_folder_path = create_path(
    path.join(os.tmpdir(), "vease", uuidv4())
  )
  console.log("project_folder_path", project_folder_path)
  const back_command = path.join(
    executable_path(path.join("microservices", "back")),
    executable_name("vease-back")
  )
  console.log("back_command", back_command)
  const viewer_command = path.join(
    executable_path(path.join("microservices", "viewer")),
    executable_name("vease-viewer")
  )
  console.log("viewer_command", viewer_command)
  return run_browser(script_name, {
    back: {
      command: back_command,
      args: {
        project_folder_path,
        upload_folder_path: path.join(project_folder_path, "upload"),
      },
    },
    viewer: {
      command: viewer_command,
      args: { project_folder_path },
    },
  })
}

export { run_browser_wrapper }
