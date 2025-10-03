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

const data_folder_path = create_path(path.join(os.tmpdir(), "vease"))
const back_command = path.join(
  executable_path(path.join("microservices", "back")),
  executable_name("vease-back"),
)

const viewer_command = path.join(
  executable_path(path.join("microservices", "viewer")),
  executable_name("vease-viewer"),
)
await run_browser(process.argv[2], {
  back: { command: back_command, args: { port: 5000, data_folder_path } },
  viewer: { command: viewer_command, args: { port: 1234, data_folder_path } },
})
