// Node imports

// Third party imports
import { defineConfig, devices } from "@playwright/test";
import { isWindows } from "std-env";

const MILLISECONDS = 1000;
const LINUX_TIMEOUT_BROWSER = 40;
const LINUX_TIMEOUT_DESKTOP = 30;
const WINDOWS_TIMEOUT_BROWSER = 60;
const WINDOWS_TIMEOUT_DESKTOP = 60;
const CI_RETRIES = 1;

const CLOUD_TIMEOUT = 100;

const ciRetries = process.env.CI ? CI_RETRIES : 0;

const TIMEOUTS = {
  browser: (isWindows ? WINDOWS_TIMEOUT_BROWSER : LINUX_TIMEOUT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_TIMEOUT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_TIMEOUT_DESKTOP : LINUX_TIMEOUT_DESKTOP) * MILLISECONDS,
};

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      pathTemplate: `./screenshots/{testName}.png`,
    },
  },
  testDir: ".",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: 1,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "browser-chrome",
      testMatch: "tests/e2e/app.test.js",
      timeout: TIMEOUTS.browser,
      retries: ciRetries,
      use: {
        ...devices["Desktop Chrome"],
        mode: "BROWSER",
      },
    },
    {
      name: "browser-firefox",
      testMatch: "tests/e2e/app.test.js",
      timeout: TIMEOUTS.browser,
      retries: ciRetries,
      use: {
        ...devices["Desktop Firefox"],
        mode: "BROWSER",
      },
    },
    {
      name: "cloud",
      testMatch: "tests/e2e/app.test.js",
      timeout: TIMEOUTS.cloud,
      retries: ciRetries,
      use: {
        ...devices["Desktop Chrome"],
        mode: "CLOUD",
      },
    },
    {
      name: "desktop",
      testMatch: "tests/e2e/app.test.js",
      timeout: TIMEOUTS.desktop,
      retries: ciRetries,
      use: {
        mode: "DESKTOP",
      },
    },
  ],
});
