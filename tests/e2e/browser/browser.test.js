// Third party imports
import { expect, test } from "@playwright/test"
import { isWindows } from "std-env"
import { runBrowser } from "@geode/opengeodeweb-front/app/utils/local/scripts.js"

// Local imports

const WINDOWS_TIMEOUT = 20
const LINUX_TIMEOUT = 15
const MILLISECONDS = 1000

test.beforeEach(async ({ page }) => {
  const port = await runBrowser("preview:browser")
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))
  await page.goto(`http://localhost:${port}`)
  console.log("Navigated to", page.url())
  await page.setViewportSize({ width: 1200, height: 800 })
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout(
    (isWindows ? WINDOWS_TIMEOUT : LINUX_TIMEOUT) * MILLISECONDS,
  )
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
