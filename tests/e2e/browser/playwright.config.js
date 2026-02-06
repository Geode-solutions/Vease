// @ts-check
import { defineConfig, devices } from "@playwright/test"
import { fileURLToPath } from "node:url"
import { isWindows } from "std-env"

const WINDOWS_TIMEOUT = 60
const LINUX_TIMEOUT = 40
const MILLISECONDS = 1000
const CI_RETRIES = 3

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  testDir: "./",
  timeout: (isWindows ? WINDOWS_TIMEOUT : LINUX_TIMEOUT) * MILLISECONDS,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  /* Retry on CI only */
  retries: process.env.CI ? CI_RETRIES : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',
    nuxt: {
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
      dev: true,
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
  ],
})
