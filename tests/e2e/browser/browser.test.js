// Standard imports

// Third party imports
import { expect, test } from "@playwright/test"
import { isWindows } from "std-env"

// Local imports
import { run_browser_wrapper } from "../../../utils/local"

test.beforeEach(async ({ page }) => {
  const NUXT_PORT = await run_browser_wrapper(`internal:browser`)
  console.log("NUXT_PORT", NUXT_PORT)
  await page.goto(`http://localhost:${NUXT_PORT}/`)
  console.log("setViewportSize")
  await page.setViewportSize({ width: 1200, height: 800 })
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout((isWindows ? 35 : 20) * 1000)
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
