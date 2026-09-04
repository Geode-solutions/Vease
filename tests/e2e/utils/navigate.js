// Node imports
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { setTimeout } from "node:timers/promises";

// Third party imports
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";
import { _electron as electron } from "playwright";
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
const WINDOWS_WAIT_DESKTOP = 40;
const SECONDS_NAVIGATION_TIMEOUT = 5;

const WAIT_TIMES = {
  browser: (isWindows ? WINDOWS_WAIT_BROWSER : LINUX_WAIT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_WAIT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_WAIT_DESKTOP : LINUX_WAIT_DESKTOP) * MILLISECONDS,
};

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;

function findAppExecutable() {
  const appExecutablePath = process.env.DESKTOP_EXECUTABLE_PATH;
  if (appExecutablePath && fs.existsSync(appExecutablePath)) {
    console.log({ appExecutablePath });
    return path.join(appExecutablePath, executableName(packageJson.name));
  }
  const buildReleasePath = path.join(__dirname, "../../../release", "0.0.0");
  console.log([buildReleasePath]);
  const buildPath = findLatestBuild(buildReleasePath);
  return parseElectronApp(buildPath).executable;
}

async function waitForAppReady(url, timeoutMs) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    // oxlint-disable-next-line no-await-in-loop
    const response = await getIsAppReady(url);
    if (response?.isReady) {
      return true;
    }
    // oxlint-disable-next-line no-await-in-loop
    await setTimeout(MILLISECONDS);
  }
  console.log("Timed out waiting for app to become ready");
  return false;
}

async function runDesktopBuild() {
  // Find the latest build in the out directory
  const appInfo = findAppExecutable();
  console.log({ appInfo });
  // Set the CI environment variable to true
  //oxlint-disable-next-line id-length
  process.env.CI = "e2e";
  const electronApp = await electron.launch({
    args: ["--no-sandbox", "--no-update", "--enable-unsafe-swiftshader"],
    executablePath: appInfo,
    wait: 20_000,
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: true,
      NODE_ENV: "development",
    },
  });

  let resolveAppUrl = undefined;
  // oxlint-disable-next-line promise/avoid-new
  const appUrlPromise = new Promise((resolve) => {
    resolveAppUrl = resolve;
  });
  const urlRegex = /Nuxt server url\s+(?<host>localhost:\d+)/u;
  electronApp.process().stdout.on("data", (data) => {
    const line = data.toString();
    console.log(`stdout: ${line}`);
    const match = line.match(urlRegex);
    if (match) {
      resolveAppUrl(`http://${match.groups.host}`);
    }
  });
  electronApp.process().stderr.on("data", (error) => console.log(`stderr: ${error}`));

  electronApp.on("close", (data) => {
    console.log("electronApp close", data);
  });
  const firstWindow = await electronApp.firstWindow();
  const browserWindow = await electronApp.browserWindow(firstWindow);
  await browserWindow.evaluate(
    async (window, { width, height }) => {
      await window.unmaximize();
      await window.setContentSize(width, height);
    },
    { width: PAGE_WIDTH, height: PAGE_HEIGHT },
  );
  const appUrl = await appUrlPromise;
  await waitForAppReady(appUrl, WAIT_TIMES.desktop);

  return { electronApp, firstWindow };
}

async function navigateToCloudApp(page, url, maxRetries) {
  console.log(`Navigating to: ${url}`);
  const navigationTimeout = SECONDS_NAVIGATION_TIMEOUT * MILLISECONDS;
  let lastError = undefined;
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
      console.log(`Attempt ${attempt} failed: ${error.message}`);
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

async function navigateToApp(mode, browser) {
  const context = await browser.newContext({
    viewport: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  context.on("page", (newPage) => {
    console.log("NEW PAGE CREATED:", newPage.url());
    newPage.on("close", () => console.log("PAGE CLOSED:", newPage.url()));
  });
  const page = await context.newPage();
  console.log(`Testing app in ${mode} mode`);
  if (mode === "BROWSER") {
    const nuxtPort = await runBrowser("preview:browser");
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));
    const appUrl = `http://localhost:${nuxtPort}`;
    await page.goto(appUrl);
    console.log("Navigated to", page.url());
    console.log(`Waiting for ${WAIT_TIMES.browser / MILLISECONDS} seconds for the app to load...`);
    await waitForAppReady(appUrl, WAIT_TIMES.browser);
    await page.waitForFunction(() => document.readyState === "complete");

    return {
      window: page,
      cleanup: () => kill(nuxtPort),
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

    const eMailInput = await page.getByTestId("eMailInput").getByRole("textbox");
    const passwordInput = await page.getByTestId("passwordInput").getByRole("textbox");
    await eMailInput.fill(process.env.GEODE_USER_EMAIL);
    await passwordInput.fill(process.env.GEODE_USER_PASSWORD);

    const signInSecondsWait = 2;
    const signInTimeout = signInSecondsWait * MILLISECONDS;
    await page.waitForTimeout(signInTimeout);
    const signInButton = await page.getByTestId("signInButton");
    await signInButton.click();

    const loadAppButton = await page.getByTestId("loadAppButton");
    await loadAppButton.click();
    console.log(`Waiting for ${WAIT_TIMES.cloud / MILLISECONDS} seconds for the app to load...`);
    await page.waitForTimeout(WAIT_TIMES.cloud);
    await page.waitForFunction(() => document.readyState === "complete");

    return {
      window: page,
      cleanup: () => page.close(),
    };
  } else if (mode === "DESKTOP") {
    const { electronApp, firstWindow } = await runDesktopBuild();
    console.log(`Waiting for ${WAIT_TIMES.desktop / MILLISECONDS} seconds for the app to load...`);
    await firstWindow.waitForFunction(() => document.readyState === "complete");
    return {
      window: firstWindow,
      cleanup: () => electronApp.close(),
    };
  }
  throw new Error(`Unknown mode: ${mode}`);
}

function navigateToViewerPage(window) {
  const viewerNavButton = window.getByTestId("viewerNavButton");
  return viewerNavButton.click();
}
function navigateToDataManagerPage(window) {
  const dataManagerNavButton = window.getByTestId("dataManagerNavButton");
  return dataManagerNavButton.click();
}
function navigateToExtensionsPage(window) {
  const extensionsNavButton = window.getByTestId("extensionsNavButton");
  return extensionsNavButton.click();
}
function navigateToAccountPage(window) {
  const accountNavButton = window.getByTestId("accountNavButton");
  return accountNavButton.click();
}
function navigateToInfosPage(window) {
  const infosNavButton = window.getByTestId("infosNavButton");
  return infosNavButton.click();
}

export {
  navigateToApp,
  navigateToAccountPage,
  navigateToDataManagerPage,
  navigateToExtensionsPage,
  navigateToInfosPage,
  navigateToViewerPage,
};
