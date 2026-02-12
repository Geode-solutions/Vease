// Standard library imports

// Third party imports
import { runExtensions } from "@geode/opengeodeweb-front/app/utils/extension.js"

// Local imports
import { run_browser_wrapper } from "../utils/local.js"

const projectName = "vease"
await runExtensions(projectName)
await run_browser_wrapper(process.argv[2])
