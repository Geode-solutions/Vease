import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`))

  let prefix = ""
  // if (process.env.GITHUB_REF_NAME === "next") {
  //   prefix = "next."
  // }
  // await page.goto(`https://${prefix}vease.geode-solutions.com`)
  await page.goto(`http://localhost:8888/`)
  await page.getByRole("button", { name: "Launch the app" }).click()
  // await page.waitForTimeout(100 * 1000)
  console.log("Navigated to", page.url())
  await page.setViewportSize({ width: 1200, height: 800 })
})

test("Microservices running", async ({ page }) => {
  await expect(page).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
