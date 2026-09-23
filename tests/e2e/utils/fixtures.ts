// Node imports
import path from "node:path";

// Third party imports
import type { Locator, Page } from "@playwright/test";
// oxlint-disable-next-line eslint/no-duplicate-imports
import { test as base, expect } from "@playwright/test";

// Local imports
import { navigateToApp } from "./navigate";

const MILLISECONDS_PER_SECOND = 1000;

interface ScreenshotMask {
  locators: Locator[];
}

interface WorkerFixtures {
  mode: string;
  suiteId: string;
  window: Page;
}

interface TestFixtures {
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

  window: [
    async ({ mode, browser }, use): Promise<void> => {
      const { window, cleanup } = await navigateToApp(mode, browser);
      await use(window);
      await cleanup();
    },
    { scope: "worker" },
  ],

  logTestProgress: [
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use, testInfo): Promise<void> => {
      const name = `${path.basename(testInfo.file)} › ${testInfo.title}`;
      console.log(`\u001B[33m[START]\u001B[0m ${name}`);
      const start = Date.now();
      await use(undefined);
      const statusColor = testInfo.status === "passed" ? "\u001B[32m" : "\u001B[31m";
      const status = (testInfo.status ?? "done").toUpperCase();
      const duration = ((Date.now() - start) / MILLISECONDS_PER_SECOND).toFixed(2);
      console.log(
        `\u001B[35m[END]\u001B[0m ${name} : ${statusColor}TEST ${status}\u001B[0m (${duration}s)`,
      );
    },
    { auto: true },
  ],

  autoScreenshot: [
    async ({ window, screenshotMask }, use, testInfo): Promise<void> => {
      await use(undefined);
      if (testInfo.status === testInfo.expectedStatus) {
        await expect(window).toHaveScreenshot({ mask: screenshotMask.locators });
      }
    },
    { auto: true },
  ],
});

export { test };
