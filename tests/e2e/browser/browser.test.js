// Third party imports
import { expect, test } from "@playwright/test"
import { isWindows } from "std-env"
import { runBrowser } from "@geode/opengeodeweb-front/app/utils/local/scripts.js"

import kill from "kill-port"

// Local imports

// Constants
const WINDOWS_TIMEOUT = 15
const LINUX_TIMEOUT = 10
const MILLISECONDS = 1000

let nuxtPort
test.beforeEach(async ({ page }) => {
  nuxtPort = await runBrowser("preview:browser")
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))
  await page.goto(`http://localhost:${nuxtPort}`)
  console.log("Navigated to", page.url())
  await page.setViewportSize({ width: 1200, height: 800 })
})

test.afterEach(async () => {
  console.log("Killing Nuxt process", { nuxtPort })
  await kill(nuxtPort)
  console.log("Killed Nuxt process", { nuxtPort })
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout(
    (isWindows ? WINDOWS_TIMEOUT : LINUX_TIMEOUT) * MILLISECONDS,
  )
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
