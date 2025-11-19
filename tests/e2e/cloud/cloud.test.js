import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))

  let prefix = ""
  if (process.env.GITHUB_REF_NAME === "next") {
    prefix = "next."
  }
  await page.goto(`https://${prefix}vease.geode-solutions.com`)
  console.log("Navigated to", page.url())
  const button = await page.getByRole("button", { name: "LAUNCH THE APP" })
  console.log({ button })
  await button.click()
  await page.waitForTimeout(100 * 1000)
  await page.setViewportSize({ width: 1200, height: 800 })
}, 150 * 1000)

test("Microservices running", async ({ page }) => {
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
