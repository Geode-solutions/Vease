// Third party imports
import { expect } from "@playwright/test";

// Local imports
import {
  afterActionWait,
  beforeAllTimeout,
  moveMouseOutOfTheWay,
} from "@tests/utils/viewer_interaction.js";
import { navigateToApp } from "@tests/utils/navigate.js";
import { test } from "@tests/fixtures.js";

const dialogTransitionWait = 2000;

let window = undefined;
let cleanup = undefined;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});

test("remove extension modal snapshot", async () => {
  await window.waitForFunction(() => Boolean(window.__VEASE_STORES__?.useAppStore));

  // Inject mock extension into appStore
  await window.evaluate(() => {
    const appStore = window.__VEASE_STORES__.useAppStore();
    const newMap = new Map([
      ...appStore.loadedExtensions,
      [
        "test_extension",
        {
          id: "test_extension",
          enabled: true,
          loadedAt: "2026-08-24T12:00:00.000Z",
          metadata: {
            name: "Test Extension",
            description: "A test extension for UI verification",
            version: "1.0.0",
          },
        },
      ],
    ]);
    appStore.loadedExtensions = newMap;
  });

  // Navigate to Extensions page
  await window.evaluate(() => useNuxtApp().$router.push("/extensions"));
  await window.waitForTimeout(afterActionWait);

  // Switch to Installed tab
  const installedTab = window.getByRole("tab", { name: /Installed/iu }).first();
  await installedTab.waitFor({ state: "visible" });
  await installedTab.click({ force: true });
  await window.waitForTimeout(afterActionWait);

  // Open removal confirmation dialog
  const deleteButton = window.locator(".v-btn:has(.mdi-delete)").first();
  await deleteButton.waitFor({ state: "visible" });
  await deleteButton.click({ force: true });
  await window.waitForTimeout(dialogTransitionWait);

  await moveMouseOutOfTheWay(window);
  await expect(window).toHaveScreenshot();
});
