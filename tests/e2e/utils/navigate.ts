// Third party imports
import { type Browser, type Page, expect } from "@playwright/test";
import type { ElectronApplication } from "playwright";
import { consola } from "consola";
import kill from "kill-port";

import { runBrowser } from "@geode/opengeodeweb-front/server/utils/scripts.js";

// Local imports
import {
  LOCALE,
  MILLISECONDS,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  TIMEZONE,
  WAIT_TIMES,
} from "./navigate_config";
import { openCloudApp } from "./navigate_cloud";
import { runDesktopBuild } from "./navigate_desktop";
import { waitForAppReady } from "./navigate_ready";
import { watchFrameworkWarnings } from "./framework_warnings";
// oxlint-disable-next-line no-relative-parent-imports
import { logBrowserConsole } from "../../../utils/browser_console";

async function newBrowserPage(browser: Browser): Promise<Page> {
  const context = await browser.newContext({
    viewport: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
    locale: LOCALE,
    timezoneId: TIMEZONE,
    permissions: ["clipboard-read", "clipboard-write"],
  });
  context.on("page", (newPage) => {
    consola.info("NEW PAGE CREATED:", newPage.url());
    newPage.on("close", () => {
      consola.info("PAGE CLOSED:", newPage.url());
    });
  });
  return context.newPage();
}

async function navigateToApp(
  mode: string,
  launchBrowser: () => Promise<Browser>,
): Promise<{ window: Page; cleanup: () => Promise<void>; electronApp?: ElectronApplication }> {
  consola.info(`Testing app in ${mode} mode`);
  // The desktop app is driven through Electron: no browser is launched
  if (mode === "DESKTOP") {
    const { electronApp, firstWindow } = await runDesktopBuild();
    watchFrameworkWarnings(firstWindow);
    consola.info(`Waiting for ${WAIT_TIMES.desktop / MILLISECONDS} seconds for the app to load...`);
    await firstWindow.waitForFunction(() => document.readyState === "complete");
    return {
      window: firstWindow,
      electronApp,
      cleanup: async () => {
        await electronApp.close();
      },
    };
  }
  if (mode !== "BROWSER" && mode !== "CLOUD") {
    throw new Error(`Unknown mode: ${mode}`);
  }
  const browser = await launchBrowser();
  const page = await newBrowserPage(browser);
  page.on("console", (msg) => {
    logBrowserConsole(msg.type(), msg.text(), "Browser console: ");
  });
  watchFrameworkWarnings(page);
  if (mode === "BROWSER") {
    const nuxtPort = await runBrowser("preview:browser");
    const appUrl = `http://localhost:${nuxtPort}`;
    await page.goto(appUrl);
    consola.info("Navigated to", page.url());
    consola.info(`Waiting for ${WAIT_TIMES.browser / MILLISECONDS} seconds for the app to load...`);
    await waitForAppReady(appUrl, WAIT_TIMES.browser);
    await page.waitForFunction(() => document.readyState === "complete");
    // The server answers before the microservices are up: on a cold Windows runner, Import stays disabled for a while
    await expect(page.getByTestId("layoutImportButton")).toBeEnabled({
      timeout: WAIT_TIMES.browser,
    });

    return {
      window: page,
      cleanup: async () => {
        await page.close();
        await browser.close();
        await kill(nuxtPort);
      },
    };
  }

  return openCloudApp(browser, page);
}

async function navigateToViewerPage(window: Page): Promise<void> {
  const viewerNavButton = window.getByTestId("viewerNavButton");
  await viewerNavButton.click();
}
async function navigateToDataManagerPage(window: Page): Promise<void> {
  const dataManagerNavButton = window.getByTestId("dataManagerNavButton");
  await dataManagerNavButton.click();
}
async function navigateToExtensionsPage(window: Page): Promise<void> {
  const extensionsNavButton = window.getByTestId("extensionsNavButton");
  await extensionsNavButton.click();
}
async function navigateToAccountPage(window: Page): Promise<void> {
  const accountNavButton = window.getByTestId("accountNavButton");
  await accountNavButton.click();
}
async function navigateToInfosPage(window: Page): Promise<void> {
  const infosNavButton = window.getByTestId("infosNavButton");
  await infosNavButton.click();
}
async function navigateToDataManagerTab(window: Page, tabId: string): Promise<void> {
  const dataManagerTabButton = window.getByTestId(`dataManagerTab-${tabId}`);
  await dataManagerTabButton.click();
}

export {
  navigateToApp,
  navigateToAccountPage,
  navigateToDataManagerPage,
  navigateToDataManagerTab,
  navigateToExtensionsPage,
  navigateToInfosPage,
  navigateToViewerPage,
};
