// Node imports
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Third party imports
import type { Browser, Locator, Page, TestInfo } from "@playwright/test";
// oxlint-disable-next-line eslint/no-duplicate-imports
import { test as base, expect } from "@playwright/test";
import type { ElectronApplication } from "playwright";
import { consola } from "consola";

// Local imports
import { navigateToApp } from "./navigate";
import { suites as ogwSuites } from "#ogw_e2e_suites/index.js";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

const MILLISECONDS_PER_SECOND = 1000;
const OGW_SUITE_TEST_FILE_EXTENSION = ".test.ts";

// Same as Playwright's {testName}: every ASCII character except letters, digits and "-" becomes "-"
function sanitizeForFilePath(name: string): string {
  return name.replaceAll(/[^\dA-Za-z\u0080-\uFFFF-]+/gu, "-");
}

// Screenshots/<test file path>/<test name>.png: the OpenGeodeWeb-Front suites (run from opengeodeweb_front.test.ts,
// One describe each) keep the folders of their own test files, tests/browser/tests/<suite>.test.ts
function screenshotPath(testInfo: TestInfo): string[] {
  const [firstTitle = "", ...otherTitles] = testInfo.titlePath.slice(1);
  if (Object.hasOwn(ogwSuites, firstTitle)) {
    return [
      ...`${firstTitle}${OGW_SUITE_TEST_FILE_EXTENSION}`.split("/"),
      `${sanitizeForFilePath(otherTitles.join(" "))}.png`,
    ];
  }
  return [
    ...path.relative(testInfo.project.testDir, testInfo.file).split(path.sep),
    `${sanitizeForFilePath([firstTitle, ...otherTitles].join(" "))}.png`,
  ];
}

interface ScreenshotMask {
  locators: Locator[];
}

interface RunningApp {
  window: Page;
  cleanup: () => Promise<void>;
  // Only set in DESKTOP mode
  electronApp?: ElectronApplication;
  restart: () => Promise<Page>;
  // Tests run since the app was launched
  testsRun: number;
}

interface WorkerFixtures {
  mode: string;
  suiteId: string;
  app: RunningApp;
  restartApp: () => Promise<Page>;
  ensureFreshApp: () => Promise<void>;
}

interface TestFixtures {
  window: Page;
  screenshotMask: ScreenshotMask;
  logTestProgress: undefined;
  autoScreenshot: undefined;
}

const test = base.extend<TestFixtures, WorkerFixtures>({
  mode: ["DEFAULT", { option: true, scope: "worker" }],

  suiteId: ["default", { option: true, scope: "worker" }],

  screenshotMask: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use): Promise<void> => {
      await use({ locators: [] });
    },
    { scope: "test" },
  ],

  // Mutable so restartApp can swap in a freshly launched app
  app: [
    async (
      { mode, playwright, browserName, headless, channel, launchOptions },
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
      const app: RunningApp = {
        ...(await navigateToApp(mode, launchBrowser)),
        testsRun: 0,
        restart: async (): Promise<Page> => {
          await app.cleanup();
          const { window, cleanup, electronApp } = await navigateToApp(mode, launchBrowser);
          app.window = window;
          app.cleanup = cleanup;
          app.electronApp = electronApp;
          app.testsRun = 0;
          return window;
        },
      };
      await use(app);
      await app.cleanup();
      fs.rmSync(configPath, { recursive: true, force: true });
    },
    { scope: "worker" },
  ],

  // Kills the running app and launches a new one, like a user closing and reopening it
  restartApp: [
    async ({ app }, use): Promise<void> => {
      await use(app.restart);
    },
    { scope: "worker" },
  ],

  // Restarts the app if a test already used it: several suites of one test file (see opengeodeweb_front.test.ts)
  // Each start from a new app, like the test files that each get their own worker
  ensureFreshApp: [
    async ({ app }, use): Promise<void> => {
      await use(async (): Promise<void> => {
        if (app.testsRun > 0) {
          await app.restart();
        }
      });
    },
    { scope: "worker" },
  ],

  // Page of the running app, read for each test: it follows restartApp and ensureFreshApp
  window: [
    async ({ app }, use): Promise<void> => {
      app.testsRun += 1;
      await use(app.window);
    },
    { scope: "test" },
  ],

  logTestProgress: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use, testInfo): Promise<void> => {
      const name = `${path.basename(testInfo.file)} › ${testInfo.title}`;
      consola.info(`\u001B[33m[START]\u001B[0m ${name}`);
      const start = Date.now();
      await use(undefined);
      const statusColor = testInfo.status === "passed" ? "\u001B[32m" : "\u001B[31m";
      const status = (testInfo.status ?? "done").toUpperCase();
      const duration = ((Date.now() - start) / MILLISECONDS_PER_SECOND).toFixed(2);
      consola.info(
        `\u001B[35m[END]\u001B[0m ${name} : ${statusColor}TEST ${status}\u001B[0m (${duration}s)`,
      );
    },
    { auto: true },
  ],

  autoScreenshot: [
    async ({ app, screenshotMask }, use, testInfo): Promise<void> => {
      await use(undefined);
      // Read at teardown: the test may have restarted the app
      const { window } = app;
      if (testInfo.status === testInfo.expectedStatus) {
        // Never capture while the microservices are still busy (busy indicator bar, half-rendered viewer)
        await waitForActionSettled(window);
        // The account icon depends on login state (only cloud is logged in)
        await expect(window).toHaveScreenshot(screenshotPath(testInfo), {
          mask: [window.getByTestId("accountNavButton"), ...screenshotMask.locators],
        });
      }
    },
    { auto: true },
  ],
});

export { test };
