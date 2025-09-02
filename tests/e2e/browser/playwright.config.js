// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import { isWindows } from "std-env";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  testDir: "./",
  timeout: (isWindows ? 60 : 30) * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
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
    // {
    //   name: "chromium",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //   },
    // },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
  ],
});
