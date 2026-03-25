// @ts-check
import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { isWindows } from "std-env";

const maxDiffPixelRatio = 0.01;
const MILLISECONDS = 1000;
const WINDOWS_TIMEOUT_BROWSER = 60;
const LINUX_TIMEOUT_BROWSER = 40;
const WINDOWS_TIMEOUT_DESKTOP = 60;
const LINUX_TIMEOUT_DESKTOP = 30;
const CLOUD_TIMEOUT = 250;
const CI_RETRIES = 3;

const ciRetries = process.env.CI ? CI_RETRIES : 0;

const nuxtUse = {
  nuxt: {
    rootDir: fileURLToPath(new URL(".", import.meta.url)),
    dev: true,
  },
};

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio },
  },
  testDir: "./",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: 1,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },

  projects: [
    // --- Browser local ---
    {
      name: "browser",
      testMatch: "tests/browser-local/**/*.spec.js",
      timeout: (isWindows ? WINDOWS_TIMEOUT_BROWSER : LINUX_TIMEOUT_BROWSER) * MILLISECONDS,
      retries: ciRetries,
      use: {
        ...devices["Desktop Chrome"],
        ...nuxtUse,
      },
    },
    {
      name: "browser-local:firefox",
      testMatch: "tests/browser-local/**/*.spec.js",
      timeout: (isWindows ? WINDOWS_TIMEOUT_BROWSER : LINUX_TIMEOUT_BROWSER) * MILLISECONDS,
      retries: ciRetries,
      use: {
        ...devices["Desktop Firefox"],
        ...nuxtUse,
      },
    },

    // --- Cloud ---
    {
      name: "cloud:chromium",
      testMatch: "tests/cloud/**/*.spec.js",
      timeout: CLOUD_TIMEOUT * MILLISECONDS,
      retries: 0,
      use: {
        ...devices["Desktop Chrome"],
        ...nuxtUse,
      },
    },

    // --- Desktop (Electron) ---
    {
      name: "desktop",
      testMatch: "tests/desktop/**/*.spec.js",
      timeout: (isWindows ? WINDOWS_TIMEOUT_DESKTOP : LINUX_TIMEOUT_DESKTOP) * MILLISECONDS,
      retries: ciRetries,
      // no nuxt, no browser device — electron launcher goes here
    },
  ],
});
