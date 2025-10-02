// Standard imports

// Third party imports
import { expect, test } from "@playwright/test"
import { isWindows } from "std-env"

// Local imports
import { run_browser } from "@ogw_f/utils/local.js"
var NUXT_PORT
function getLogs(page) {
  page.on("console", (msg) => {
    console.log(`PAGE LOG: "${msg.text()}"`)
  })
}

test.beforeAll(async () => {
  const data_folder_path = create_path(path.join(os.tmpdir(), "vease"))

  const back_command = path.join(
    executable_path(path.join("microservices", "back")),
    executable_name("vease-back"),
  )

  const viewer_command = path.join(
    executable_path(path.join("microservices", "viewer")),
    executable_name("vease-viewer"),
  )
  NUXT_PORT = await run_browser(`test:browser`, {
    back: { command: back_command, args: { port: 5000, data_folder_path } },
    viewer: { command: viewer_command, args: { port: 1234, data_folder_path } },
  })
})

test.beforeEach(async ({ page }) => {
  getLogs(page)
  await page.goto(`http://localhost:${NUXT_PORT}/`)
  await page.setViewportSize({ width: 1200, height: 800 })
})

test("Window title", async ({ page }) => {
  await expect(page).toHaveTitle("Vease")
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout((isWindows ? 30 : 15) * 1000)
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
