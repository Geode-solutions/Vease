// Standard imports

// Third party imports
import { expect, test } from "@playwright/test"
import { isWindows } from "std-env"

// Local imports
import { run_browser_wrapper } from "../../../utils/local"

test.beforeEach(async ({ page }) => {
  const ports = await run_browser_wrapper(`preview:browser`)
  console.log("ports", ports)
  const { geode_port, viewer_port, nuxt_port } = ports
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))
  await page.goto(
    `http://localhost:${nuxt_port}?geode_port=${geode_port}&viewer_port=${viewer_port}`,
  )
  console.log("Navigated to", page.url())
  await page.setViewportSize({ width: 1200, height: 800 })
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout((isWindows ? 10 : 5) * 1000)
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
