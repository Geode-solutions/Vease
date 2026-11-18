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
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

const MILLISECONDS_PER_SECOND = 1000;
// Whole download deadline of a basemap build in OpenGeodeWeb-Back (FETCH_DEADLINE_SECONDS)
const BUSY_TIMEOUT_MS = 30_000;
const OGW_SUITE_TEST_FILE_EXTENSION = ".test.ts";
// Built suite files of OpenGeodeWeb-Front, where the tests of its suites are located
const OGW_SUITE_FILE_REGEX = /tests[/\\]browser[/\\]suites[/\\](?<suite>.+)\.js$/u;
// Launching the app: browser or Electron, back and viewer, then afterAppLaunch
const APP_LAUNCH_TIMEOUT_MS = 180_000;

// Same as Playwright's {testName}: every ASCII character except letters, digits and "-" becomes "-"
function sanitizeForFilePath(name: string): string {
  return name.replaceAll(/[^\dA-Za-z\u0080-\uFFFF-]+/gu, "-");
}

// Screenshots/<test file path>/<test name>.png. The OpenGeodeWeb-Front suites (run from opengeodeweb_front.test.ts,
// One describe each) keep the folders of their own test files, tests/browser/tests/<suite>.test.ts
function screenshotPath(testInfo: TestInfo): string[] {
  const titles = testInfo.titlePath.slice(1);
  const suite = OGW_SUITE_FILE_REGEX.exec(testInfo.file)?.groups?.suite;
  if (suite !== undefined) {
    return [
      ...`${suite.replaceAll("\\", "/")}${OGW_SUITE_TEST_FILE_EXTENSION}`.split("/"),
      `${sanitizeForFilePath(titles.slice(1).join(" "))}.png`,
    ];
  }
  return [
    ...path.relative(testInfo.project.testDir, testInfo.file).split(path.sep),
    `${sanitizeForFilePath(titles.join(" "))}.png`,
  ];
}

interface ScreenshotMask {
  locators: Locator[];
}

interface RunningApp {
  // Page of the open app (throws if the app is closed)
  readonly window: Page;
  // Only set in DESKTOP mode, while the app is open
  electronApp?: ElectronApplication;
  // Launches the app if it is not open
  open: () => Promise<Page>;
  // Closes the app if it is open
  close: () => Promise<void>;
}

interface WorkerFixtures {
  mode: string;
  suiteId: string;
  // Run on each launched app before its first test (Vease-Modeling loads its extension), and before closing it
  afterAppLaunch: (window: Page) => Promise<void>;
  beforeAppClose: (window: Page) => Promise<void>;
  app: RunningApp;
  restartApp: () => Promise<Page>;
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

  afterAppLaunch: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use): Promise<void> => {
      await use(async (): Promise<void> => {
        // Nothing to do by default
      });
    },
    { scope: "worker" },
  ],

  beforeAppClose: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use): Promise<void> => {
      await use(async (): Promise<void> => {
        // Nothing to do by default
      });
    },
    { scope: "worker" },
  ],

  screenshotMask: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use): Promise<void> => {
      await use({ locators: [] });
    },
    { scope: "test" },
  ],

  // The app of the worker: opened by the first test that uses it (or a beforeAll), closed by app.close or at the end of
  // The worker. A test file opens it, runs its tests and closes it; so does each suite of opengeodeweb_front.test.ts
  app: [
    async (
      {
        mode,
        playwright,
        browserName,
        headless,
        channel,
        launchOptions,
        afterAppLaunch,
        beforeAppClose,
      },
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
      let openApp: Awaited<ReturnType<typeof navigateToApp>> | undefined = undefined;
      const app: RunningApp = {
        get window(): Page {
          if (openApp === undefined) {
            throw new Error("The app is not open");
          }
          return openApp.window;
        },
        get electronApp(): ElectronApplication | undefined {
          return openApp?.electronApp;
        },
        open: async (): Promise<Page> => {
          if (openApp === undefined) {
            openApp = await navigateToApp(mode, launchBrowser);
            await afterAppLaunch(openApp.window);
          }
          return openApp.window;
        },
        close: async (): Promise<void> => {
          if (openApp !== undefined) {
            const { window, cleanup } = openApp;
            openApp = undefined;
            await beforeAppClose(window);
            await cleanup();
          }
        },
      };
      await use(app);
      await app.close();
      fs.rmSync(configPath, { recursive: true, force: true });
    },
    { scope: "worker" },
  ],

  // Kills the running app and launches a new one, like a user closing and reopening it
  restartApp: [
    async ({ app }, use): Promise<void> => {
      await use(async (): Promise<Page> => {
        await app.close();
        const window = await app.open();
        return window;
      });
    },
    { scope: "worker" },
  ],

  // Page of the app, opened if needed: it follows restartApp
  window: [
    async ({ app }, use): Promise<void> => {
      await use(await app.open());
    },
    { scope: "test", timeout: APP_LAUNCH_TIMEOUT_MS },
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
        // A basemap build waits on external tile servers longer than waitForActionSettled does
        await expect(window.getByTestId("microservicesBusyIndicator")).toBeHidden({
          timeout: BUSY_TIMEOUT_MS,
        });
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
