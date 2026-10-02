// Node imports

// Third party imports
import { defineConfig, devices } from "@playwright/test";
import { isWindows } from "std-env";

const MILLISECONDS = 1000;
const CLOUD_TIMEOUT = 120;
const LINUX_TIMEOUT_BROWSER = 60;
const LINUX_TIMEOUT_DESKTOP = 50;
const WINDOWS_TIMEOUT_BROWSER = 80;
const WINDOWS_TIMEOUT_DESKTOP = 180;
const CI_RETRIES = 1;
const CI_WORKERS = 3;

const isCI = process.env.CI !== undefined && process.env.CI !== "";

if (isCI) {
  // Reaches the spawned Nitro server through process.env: the app logs plain text instead of styled consola output
  process.env.NUXT_PUBLIC_PLAIN_LOGS = "true";
}
const retries = isCI ? CI_RETRIES : 0;
const workers = isCI ? CI_WORKERS : undefined;
const testMatch = "tests/e2e/tests/**/*.test.ts";
const LINUX_MAX_DIFF_PIXEL_RATIO = 0.02;
// Baselines are generated on Linux, Windows text rendering (DirectWrite vs FreeType) adds ~2% diff
const WINDOWS_MAX_DIFF_PIXEL_RATIO = 0.025;
const maxDiffPixelRatio = isWindows ? WINDOWS_MAX_DIFF_PIXEL_RATIO : LINUX_MAX_DIFF_PIXEL_RATIO;
const threshold = 0.25;

const TIMEOUTS = {
  browser: (isWindows ? WINDOWS_TIMEOUT_BROWSER : LINUX_TIMEOUT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_TIMEOUT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_TIMEOUT_DESKTOP : LINUX_TIMEOUT_DESKTOP) * MILLISECONDS,
};

const CLOUD_SECONDS_SCREENSHOT_TIMEOUT = 10;
const CLOUD_SCREENSHOT_TIMEOUT = CLOUD_SECONDS_SCREENSHOT_TIMEOUT * MILLISECONDS;

const defaultExpect = {
  toHaveScreenshot: {
    maxDiffPixelRatio,
    threshold,
    pathTemplate: `./tests/screenshots/{testFileName}/{testName}.png`,
  },
};

const cloudExpect = {
  ...defaultExpect,
  toHaveScreenshot: {
    ...defaultExpect.toHaveScreenshot,
    timeout: CLOUD_SCREENSHOT_TIMEOUT,
  },
};

// oxlint-disable-next-line import/no-default-export
export default defineConfig<{ mode: string }>({
  expect: defaultExpect,
  testDir: ".",
  fullyParallel: true,
  workers,
  forbidOnly: Boolean(process.env.CI),
  reporter: "html",
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "browser-chrome",
      testMatch,
      timeout: TIMEOUTS.browser,
      retries,
      use: {
        ...devices["Desktop Chrome"],
        mode: "BROWSER",
      },
    },
    {
      name: "browser-firefox",
      testMatch,
      timeout: TIMEOUTS.browser,
      retries,
      use: {
        ...devices["Desktop Firefox"],
        mode: "BROWSER",
      },
    },
    {
      name: "cloud",
      testMatch,
      timeout: TIMEOUTS.cloud,
      retries,
      expect: cloudExpect,
      use: {
        ...devices["Desktop Chrome"],
        mode: "CLOUD",
      },
    },
    {
      name: "desktop",
      testMatch,
      timeout: TIMEOUTS.desktop,
      retries,
      use: {
        mode: "DESKTOP",
      },
    },
  ],
});
