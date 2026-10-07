// Node imports
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { setTimeout } from "node:timers/promises";

// Third party imports
import { type Browser, type Page, expect } from "@playwright/test";
import { type ElectronApplication, _electron as electron } from "playwright";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";
import type { BrowserWindow } from "electron";
import { consola } from "consola";
import { isWindows } from "std-env";
import kill from "kill-port";

import { executableName } from "@geode/opengeodeweb-front/server/utils/path.js";
import { getIsAppReady } from "@geode/opengeodeweb-front/shared/scripts.js";
import { runBrowser } from "@geode/opengeodeweb-front/server/utils/scripts.js";

// Local imports
// oxlint-disable-next-line no-relative-parent-imports
import packageJson from "../../../package.json" with { type: "json" };

// Constants
const __dirname = import.meta.dirname;
const MILLISECONDS = 1000;
const LINUX_WAIT_BROWSER = 20;
const LINUX_WAIT_DESKTOP = 30;
const CLOUD_WAIT = 65;
const WINDOWS_WAIT_BROWSER = 30;
const WINDOWS_WAIT_DESKTOP = 60;
const SECONDS_NAVIGATION_TIMEOUT = 5;

const WAIT_TIMES = {
  browser: (isWindows ? WINDOWS_WAIT_BROWSER : LINUX_WAIT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_WAIT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_WAIT_DESKTOP : LINUX_WAIT_DESKTOP) * MILLISECONDS,
};

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;
// Fixed so number/date formatting matches the shared baselines on every OS
const LOCALE = "en-US";
const TIMEZONE = "UTC";

function findAppExecutable(): string {
  const appExecutablePath = process.env.DESKTOP_EXECUTABLE_PATH;
  if (
    appExecutablePath !== undefined &&
    appExecutablePath !== "" &&
    fs.existsSync(appExecutablePath)
  ) {
    consola.debug({ appExecutablePath });
    return path.join(appExecutablePath, executableName(packageJson.name));
  }
  const buildReleasePath = path.join(__dirname, "../../../release", "0.0.0");
  consola.debug([buildReleasePath]);
  const buildPath = findLatestBuild(buildReleasePath);
  return parseElectronApp(buildPath).executable;
}

interface AppReadyResponse {
  isReady?: boolean;
}

function isAppReadyResponse(value: unknown): value is AppReadyResponse {
  return typeof value === "object" && value !== null;
}

async function waitForAppReady(url: string, timeoutMs: number): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    // oxlint-disable-next-line no-await-in-loop
    const response = await getIsAppReady(url);
    consola.info(`App ready check response: ${JSON.stringify(response)}`);
    if (isAppReadyResponse(response) && response.isReady === true) {
      return true;
    }
    // oxlint-disable-next-line no-await-in-loop
    await setTimeout(MILLISECONDS);
  }
  consola.info("Timed out waiting for app to become ready");
  return false;
}

async function runDesktopBuild(): Promise<{
  electronApp: ElectronApplication;
  firstWindow: Page;
}> {
  // Find the latest build in the out directory
  const appInfo = findAppExecutable();
  consola.debug({ appInfo });
  // Set the CI environment variable to true
  //oxlint-disable-next-line id-length
  process.env.CI = "e2e";
  const electronApp = await electron.launch({
    args: ["--no-sandbox", "--no-update", "--enable-unsafe-swiftshader", `--lang=${LOCALE}`],
    executablePath: appInfo,
    timeout: 60_000,
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: "true",
      NODE_ENV: "development",
    },
  });

  let resolveAppUrl: ((value: string) => void) | undefined = undefined;
  // oxlint-disable-next-line promise/avoid-new
  const appUrlPromise = new Promise<string>((resolve) => {
    resolveAppUrl = resolve;
  });
  const urlRegex = /Nuxt server url\s+(?<host>localhost:\d+)/u;
  const { stdout, stderr } = electronApp.process();
  if (!stdout || !stderr) {
    throw new Error("Electron app process has no stdout/stderr");
  }
  stdout.on("data", (data: Buffer) => {
    const line = data.toString();
    consola.info(`stdout: ${line}`);
    const match = urlRegex.exec(line);
    if (match && resolveAppUrl) {
      resolveAppUrl(`http://${match.groups?.host}`);
    }
  });
  stderr.on("data", (data: Buffer) => {
    consola.info(`stderr: ${data.toString()}`);
  });

  electronApp.on("close", () => {
    consola.info("electronApp close");
  });
  const firstWindow = await electronApp.firstWindow();
  const browserWindow = await electronApp.browserWindow(firstWindow);
  await browserWindow.evaluate(
    (window: BrowserWindow, { width, height }) => {
      window.unmaximize();
      window.setContentSize(width, height);
    },
    { width: PAGE_WIDTH, height: PAGE_HEIGHT },
  );
  const appUrl = await appUrlPromise;
  await waitForAppReady(appUrl, WAIT_TIMES.desktop);

  return { electronApp, firstWindow };
}

async function navigateToCloudApp(page: Page, url: string, maxRetries: number): Promise<void> {
  consola.info(`Navigating to: ${url}`);
  const navigationTimeout = SECONDS_NAVIGATION_TIMEOUT * MILLISECONDS;
  let lastError: unknown = undefined;
  let succeeded = false;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      consola.info(`Navigation attempt ${attempt}/${maxRetries}`);
      // oxlint-disable-next-line no-await-in-loop
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: navigationTimeout,
      });
      consola.info(`Attempt ${attempt} succeeded`);
      succeeded = true;
      break;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      consola.info(`Attempt ${attempt} failed: ${message}`);
      if (attempt < maxRetries) {
        // oxlint-disable-next-line no-await-in-loop
        await setTimeout(MILLISECONDS);
      }
    }
  }

  if (!succeeded) {
    throw new Error(`Failed to reach ${url} after ${maxRetries} attempts`, {
      cause: lastError,
    });
  }
  consola.info("Navigated to", page.url());
}

async function signInToCloudApp(page: Page): Promise<void> {
  const eMailInput = page.getByTestId("eMailInput").getByRole("textbox");
  const passwordInput = page.getByTestId("passwordInput").getByRole("textbox");
  await eMailInput.fill(process.env.GEODE_USER_EMAIL ?? "");
  await passwordInput.fill(process.env.GEODE_USER_PASSWORD ?? "");

  const signInSecondsWait = 2;
  const signInTimeout = signInSecondsWait * MILLISECONDS;
  await page.waitForTimeout(signInTimeout);
  const signInButton = page.getByTestId("signInButton");
  await signInButton.click();

  const loadAppButton = page.getByTestId("loadAppButton");
  await loadAppButton.click();
  consola.info(`Waiting up to ${WAIT_TIMES.cloud / MILLISECONDS} seconds for the app to load...`);
  await expect(page.getByTestId("layoutImportButton")).toBeEnabled({ timeout: WAIT_TIMES.cloud });
  await page.waitForFunction(() => document.readyState === "complete");
}

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
    consola.info(`Browser console: ${msg.text()}`);
  });
  if (mode === "BROWSER") {
    const nuxtPort = await runBrowser("preview:browser");
    const appUrl = `http://localhost:${nuxtPort}`;
    await page.goto(appUrl);
    consola.info("Navigated to", page.url());
    consola.info(`Waiting for ${WAIT_TIMES.browser / MILLISECONDS} seconds for the app to load...`);
    await waitForAppReady(appUrl, WAIT_TIMES.browser);
    await page.waitForFunction(() => document.readyState === "complete");

    return {
      window: page,
      cleanup: async () => {
        await page.close();
        await browser.close();
        await kill(nuxtPort);
      },
    };
  }

  let prefix = "";
  const branch = execSync("git branch --show-current", {
    encoding: "utf8",
  }).trim();
  consola.info("Current branch:", branch);
  if (branch === "next") {
    prefix = "next.";
  }
  const url = `https://${prefix}vease.geode-solutions.com`;
  const maxRetries = 10;
  await navigateToCloudApp(page, url, maxRetries);
  await signInToCloudApp(page);

  return {
    window: page,
    cleanup: async () => {
      await page.close();
      await browser.close();
    },
  };
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
