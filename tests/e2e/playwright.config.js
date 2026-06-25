// Node imports

// Third party imports
import { defineConfig, devices } from "@playwright/test";
import { isWindows } from "std-env";

const MILLISECONDS = 1000;
const CLOUD_TIMEOUT = 100;
const LINUX_TIMEOUT_BROWSER = 60;
const LINUX_TIMEOUT_DESKTOP = 50;
const WINDOWS_TIMEOUT_BROWSER = 80;
const WINDOWS_TIMEOUT_DESKTOP = 80;
const CI_RETRIES = 1;
const CI_WORKERS = 2;

const ciRetries = process.env.CI ? CI_RETRIES : 0;
const workers = process.env.CI ? CI_WORKERS : 1;
const testMatch = "tests/e2e/tests/**/*.test.js";
const maxDiffPixelRatio = 0.02;

const TIMEOUTS = {
  browser: (isWindows ? WINDOWS_TIMEOUT_BROWSER : LINUX_TIMEOUT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_TIMEOUT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_TIMEOUT_DESKTOP : LINUX_TIMEOUT_DESKTOP) * MILLISECONDS,
};

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: process.env.MAX_PIXEL_RATIO
        ? Number(process.env.MAX_PIXEL_RATIO)
        : maxDiffPixelRatio,
      pathTemplate: `./tests/screenshots/{testFileName}/{testName}.png`,
    },
  },
  testDir: ".",
  fullyParallel: true,
  workers,
  forbidOnly: Boolean(process.env.CI),
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "browser-chrome",
      testMatch,
      timeout: TIMEOUTS.browser,
      retries: ciRetries,
      use: {
        ...devices["Desktop Chrome"],
        mode: "BROWSER",
      },
    },
    {
      name: "browser-firefox",
      testMatch,
      timeout: TIMEOUTS.browser,
      retries: ciRetries,
      use: {
        ...devices["Desktop Firefox"],
        mode: "BROWSER",
      },
    },
    {
      name: "cloud",
      testMatch,
      timeout: TIMEOUTS.cloud,
      retries: ciRetries,
      use: {
        ...devices["Desktop Chrome"],
        mode: "CLOUD",
      },
    },
    {
      name: "desktop",
      testMatch,
      timeout: TIMEOUTS.desktop,
      retries: ciRetries,
      use: {
        mode: "DESKTOP",
      },
    },
  ],
});
