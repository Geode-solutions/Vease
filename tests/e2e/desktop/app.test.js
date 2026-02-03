import { expect, test } from "@playwright/test"
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers"
import { _electron as electron } from "playwright"
import { isWindows } from "std-env"
import path from "node:path"

const WINDOW_WIDTH = 1200
const WINDOW_HEIGHT = 800
const WINDOWS_TIMEOUT_SECONDS = 30
const DEFAULT_TIMEOUT_SECONDS = 15
const MS_PER_SECOND = 1000

let _electronApp = undefined
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
  _electronApp = await electron.launch({
    args: [appInfo.main, "--no-sandbox"],
    executablePath: appInfo.executable,
    timeout: 20000,
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: true,
      NODE_ENV: "development",
    },
  })

  _electronApp
    .process()
    .stdout.on("data", (data) => console.log(`stdout: ${data}`))
  _electronApp
    .process()
    .stderr.on("data", (error) => console.log(`stderr: ${error}`))

  _electronApp.on("close", (data) => {
    console.log("electronApp close", data)
  })
  const firstWindow = await _electronApp.firstWindow()
  const browserWindow = await _electronApp.browserWindow(firstWindow)
  await browserWindow.evaluate(
    async (window, { width, height }) => {
      await window.unmaximize()
      await window.setSize(width, height)
    },
    { width: WINDOW_WIDTH, height: WINDOW_HEIGHT },
  )
})

test.afterAll(async () => {
  await _electronApp.close()
})

test("Microservices running", async () => {
  const firstWindow = await _electronApp.firstWindow()
  await firstWindow.waitForTimeout(
    (isWindows ? WINDOWS_TIMEOUT_SECONDS : DEFAULT_TIMEOUT_SECONDS) *
      MS_PER_SECOND,
  )
  await expect(firstWindow).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  })
})