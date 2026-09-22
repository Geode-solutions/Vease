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

function findAppExecutable(): string {
  const appExecutablePath = process.env.DESKTOP_EXECUTABLE_PATH;
  if (
    appExecutablePath !== undefined &&
    appExecutablePath !== "" &&
    fs.existsSync(appExecutablePath)
  ) {
    console.log({ appExecutablePath });
    return path.join(appExecutablePath, executableName(packageJson.name));
  }
  const buildReleasePath = path.join(__dirname, "../../../release", "0.0.0");
  console.log([buildReleasePath]);
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
    console.log(`App ready check response: ${JSON.stringify(response)}`);
    if (isAppReadyResponse(response) && response.isReady === true) {
      return true;
    }
    // oxlint-disable-next-line no-await-in-loop
    await setTimeout(MILLISECONDS);
  }
  console.log("Timed out waiting for app to become ready");
  return false;
}

async function runDesktopBuild(): Promise<{
  electronApp: ElectronApplication;
  firstWindow: Page;
}> {
  // Find the latest build in the out directory
  const appInfo = findAppExecutable();
  console.log({ appInfo });
  // Set the CI environment variable to true
  //oxlint-disable-next-line id-length
  process.env.CI = "e2e";
  const electronApp = await electron.launch({
    args: ["--no-sandbox", "--no-update", "--enable-unsafe-swiftshader"],
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
    console.log(`stdout: ${line}`);
    const match = urlRegex.exec(line);
    if (match && resolveAppUrl) {
      resolveAppUrl(`http://${match.groups?.host}`);
    }
  });
  stderr.on("data", (data: Buffer) => {
    console.log(`stderr: ${data.toString()}`);
  });

  electronApp.on("close", () => {
    console.log("electronApp close");
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
  console.log(`Navigating to: ${url}`);
  const navigationTimeout = SECONDS_NAVIGATION_TIMEOUT * MILLISECONDS;
  let lastError: unknown = undefined;
  let succeeded = false;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      console.log(`Navigation attempt ${attempt}/${maxRetries}`);
      // oxlint-disable-next-line no-await-in-loop
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: navigationTimeout,
      });
      console.log(`Attempt ${attempt} succeeded`);
      succeeded = true;
      break;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`Attempt ${attempt} failed: ${message}`);
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
  console.log("Navigated to", page.url());
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
  console.log(`Waiting up to ${WAIT_TIMES.cloud / MILLISECONDS} seconds for the app to load...`);
  await expect(page.getByTestId("layoutImportButton")).toBeEnabled({ timeout: WAIT_TIMES.cloud });
  await page.waitForFunction(() => document.readyState === "complete");
}

async function navigateToApp(
  mode: string,
  browser: Browser,
): Promise<{ window: Page; cleanup: () => Promise<void> }> {
  const context = await browser.newContext({
    viewport: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  context.on("page", (newPage) => {
    console.log("NEW PAGE CREATED:", newPage.url());
    newPage.on("close", () => {
      console.log("PAGE CLOSED:", newPage.url());
    });
  });
  const page = await context.newPage();
  console.log(`Testing app in ${mode} mode`);
  if (mode === "BROWSER") {
    const nuxtPort = await runBrowser("preview:browser");
    page.on("console", (msg) => {
      console.log(`Browser console: ${msg.text()}`);
    });
    const appUrl = `http://localhost:${nuxtPort}`;
    await page.goto(appUrl);
    console.log("Navigated to", page.url());
    console.log(`Waiting for ${WAIT_TIMES.browser / MILLISECONDS} seconds for the app to load...`);
    await waitForAppReady(appUrl, WAIT_TIMES.browser);
    await page.waitForFunction(() => document.readyState === "complete");

    return {
      window: page,
      cleanup: async () => {
        await page.close();
        await kill(nuxtPort);
      },
    };
  } else if (mode === "CLOUD") {
    page.on("console", (msg) => {
      console.log(`Browser console: ${msg.text()}`);
    });

    let prefix = "";
    const branch = execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();
    console.log("Current branch:", branch);
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
      },
    };
  } else if (mode === "DESKTOP") {
    const { electronApp, firstWindow } = await runDesktopBuild();
    console.log(`Waiting for ${WAIT_TIMES.desktop / MILLISECONDS} seconds for the app to load...`);
    await firstWindow.waitForFunction(() => document.readyState === "complete");
    return {
      window: firstWindow,
      cleanup: async () => {
        await electronApp.close();
      },
    };
  }
  throw new Error(`Unknown mode: ${mode}`);
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

export {
  navigateToApp,
  navigateToAccountPage,
  navigateToDataManagerPage,
  navigateToExtensionsPage,
  navigateToInfosPage,
  navigateToViewerPage,
};
