import { expect, test } from "@playwright/test"
import { isWindows } from "std-env"

test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))
  // await page.goto(`https://next.vease.geode-solutions.com`)
  await page.goto(`http://localhost:8888`)

  await page.getByRole("button", { name: "Launch the app" }).click()
  await page.waitForTimeout(90 * 1000)
  console.log("Navigated to", page.url())
  await page.setViewportSize({ width: 1200, height: 800 })
})

test("Microservices running", async ({ page }) => {
  await page.waitForTimeout((isWindows ? 30 : 15) * 1000)
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
