// The test of Vease: the app test of OpenGeodeWeb-Front (one app per worker, opened and closed by the tests, a
// Screenshot at the end of each passing test), launched in the mode of the project (browser, cloud or desktop)

// Node imports
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Third party imports
import type { Browser } from "@playwright/test";
import type { ElectronApplication } from "playwright";
// oxlint-disable-next-line eslint/no-duplicate-imports
import { expect } from "@playwright/test";

// Local imports
import { test as appTest } from "#ogw_e2e/app_test.js";
import { navigateToApp } from "./navigate";
import { takeFrameworkWarnings } from "./framework_warnings";

// Whole download deadline of a basemap build in OpenGeodeWeb-Back (FETCH_DEADLINE_SECONDS)
const BUSY_TIMEOUT_MS = 30_000;

// The Electron app of the open app, in DESKTOP mode
interface DesktopApp {
  electronApp?: ElectronApplication;
}

interface WorkerFixtures {
  mode: string;
  desktopApp: DesktopApp;
}

interface TestFixtures {
  // Only set in DESKTOP mode
  electronApp: ElectronApplication | undefined;
  noFrameworkWarnings: undefined;
}

const test = appTest.extend<TestFixtures, WorkerFixtures>({
  mode: ["DEFAULT", { option: true, scope: "worker" }],

  desktopApp: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use): Promise<void> => {
      await use({});
    },
    { scope: "worker" },
  ],

  launchApp: [
    async (
      { mode, playwright, browserName, headless, channel, launchOptions, desktopApp },
      use,
      workerInfo,
    ): Promise<void> => {
      // Each worker runs its own app: give it its own config folder (where extensions are installed) so parallel installs don't overwrite each other
      const configPath = fs.mkdtempSync(
        path.join(os.tmpdir(), `vease-e2e-worker${workerInfo.parallelIndex}-`),
      );
      process.env.XDG_CONFIG_HOME = configPath;
      process.env.APPDATA = configPath;
      // Launched on demand instead of using the browser fixture, which would start (and require installing) a browser in DESKTOP mode too
      async function launchBrowser(): Promise<Browser> {
        const browser = await playwright[browserName].launch({
          ...launchOptions,
          headless,
          channel,
        });
        return browser;
      }
      await use(async () => {
        const { window, cleanup, electronApp } = await navigateToApp(mode, launchBrowser);
        desktopApp.electronApp = electronApp;
        return {
          window,
          cleanup: async (): Promise<void> => {
            desktopApp.electronApp = undefined;
            await cleanup();
          },
        };
      });
      fs.rmSync(configPath, { recursive: true, force: true });
    },
    { scope: "worker" },
  ],

  // Never capture while the microservices are still busy (busy indicator bar, half-rendered viewer)
  // A basemap build waits on external tile servers longer than waitForActionSettled does
  beforeScreenshot: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use): Promise<void> => {
      await use(async (window) => {
        await expect(window.getByTestId("microservicesBusyIndicator")).toBeHidden({
          timeout: BUSY_TIMEOUT_MS,
        });
      });
    },
    { scope: "worker" },
  ],

  // The account icon depends on login state (only cloud is logged in)
  appScreenshotMask: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use): Promise<void> => {
      await use((window) => [window.getByTestId("accountNavButton")]);
    },
    { scope: "worker" },
  ],

  // Fails a passing test on any Vue (Vuetify included) or Nuxt warning emitted during it: the first test of an app also
  // Gets its startup ones. Vue's are only there when built with VUE_DEV_WARNINGS (build:browser)
  noFrameworkWarnings: [
    async ({ app: _app }, use, testInfo): Promise<void> => {
      await use(undefined);
      const warnings = takeFrameworkWarnings();
      if (testInfo.status === testInfo.expectedStatus) {
        expect(warnings, "Vue or Nuxt warnings were emitted").toEqual([]);
      }
    },
    { auto: true },
  ],

  electronApp: async ({ app, desktopApp }, use): Promise<void> => {
    await app.open();
    await use(desktopApp.electronApp);
  },
});

export { test };
