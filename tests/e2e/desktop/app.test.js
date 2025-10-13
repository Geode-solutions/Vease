import { expect, test } from "@playwright/test"
import { _electron as electron } from "playwright"
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers"
import { isWindows } from "std-env"

import path from "path"

let electronApp
test.beforeAll(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild(
    path.join(process.cwd(), "release", "0.0.0"),
  )
  console.log("latestBuild", latestBuild)
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild)
  // set the CI environment variable to true
  process.env.CI = "e2e"
  electronApp = await electron.launch({
    args: [appInfo.main, "--no-sandbox"],
    executablePath: appInfo.executable,
    timeout: 20000,
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: true,
      NODE_ENV: "development",
    },
  })

  electronApp
    .process()
    .stdout.on("data", (data) => console.log(`stdout: ${data}`))
  electronApp
    .process()
    .stderr.on("data", (error) => console.log(`stderr: ${error}`))

  electronApp.on("close", (data) => {
    console.log("electronApp close", data)
  })
  const firstWindow = await electronApp.firstWindow()
  const browserWindow = await electronApp.browserWindow(firstWindow)
  await browserWindow.evaluate(async (window) => {
    await window.unmaximize()
    await window.setSize(1200, 800)
  })
})

test.afterAll(async () => {
  await electronApp.close()
})

test("Microservices running", async () => {
  const firstWindow = await electronApp.firstWindow()
  await firstWindow.waitForTimeout((isWindows ? 30 : 15) * 1000)
  await expect(firstWindow).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
