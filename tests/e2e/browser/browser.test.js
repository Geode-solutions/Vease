// Third party imports
import { expect, test } from "@playwright/test"
import { isWindows } from "std-env"

// Local imports

const WINDOWS_TIMEOUT = 10
const LINUX_TIMEOUT = 5
const MILLISECONDS = 1000

test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))
  const nuxt_port = 3000
  await page.goto(`http://localhost:${nuxt_port}`)
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
