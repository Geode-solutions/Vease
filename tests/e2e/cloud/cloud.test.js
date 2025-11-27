import { expect, test } from "@playwright/test"
import { execSync } from 'child_process';

test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))

  let prefix = ""
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log("Current branch:", branch)
  if (branch === "next") {
    prefix = "next."
  }
  await page.goto(`https://${prefix}vease.geode-solutions.com`)
  console.log("Navigated to", page.url())
  const button = await page.getByRole("button", { name: "Launch the app" })
  console.log({ button })
  await button.click()
  await page.waitForTimeout(100 * 1000)
  await page.setViewportSize({ width: 1200, height: 800 })
}, 150 * 1000)

test("Microservices running", async ({ page }) => {
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
  page.close()
})
