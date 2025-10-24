// Standard library imports
import os from "os"
import path from "path"
// Third party imports

// Local imports
import {
  create_path,
  executable_name,
  executable_path,
  run_browser,
} from "@geode/opengeodeweb-front/utils/local.js"

function run_browser_wrapper(script_name) {
  const project_folder_path = create_path(path.join(os.tmpdir(), "vease"))
  console.log("project_folder_path", project_folder_path)
  const back_command = path.join(
    executable_path(path.join("microservices", "back")),
    executable_name("vease-back"),
  )
  console.log("back_command", back_command)
  const viewer_command = path.join(
    executable_path(path.join("microservices", "viewer")),
    executable_name("vease-viewer"),
  )
  console.log("viewer_command", viewer_command)
  return new Promise(async (resolve, reject) => {
    const NUXT_PORT = await run_browser(script_name, {
      back: { command: back_command, args: { project_folder_path } },
      viewer: {
        command: viewer_command,
        args: { project_folder_path },
      },
    })
    resolve(NUXT_PORT)
  })
}

export { run_browser_wrapper }
