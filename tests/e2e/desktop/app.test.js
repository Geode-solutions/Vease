import { expect, test } from "@playwright/test"
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers"
import { _electron as electron } from "playwright"

import path from "node:path"

const MILLISECONDS = 1000
const DEFAULT_WIDTH = 1200
const DEFAULT_HEIGHT = 800

let electronApp = undefined
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
  await browserWindow.evaluate(
    async (window, { width, height }) => {
      await window.unmaximize()
      await window.setSize(width, height)
    },
    { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
  )
  await firstWindow.setViewportSize({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  })
})

test.afterAll(async () => {
  await electronApp.close()
})

test("Microservices running", async () => {
  const firstWindow = await electronApp.firstWindow()
  // Wait for the app to be mounted and visible
  await firstWindow.waitForSelector(".v-application", { state: "visible" })
  await firstWindow.waitForTimeout(2 * MILLISECONDS) // Slight buffer for microservices
  await expect(firstWindow).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})
