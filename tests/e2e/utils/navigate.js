// Node imports
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Third party imports
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";
import { _electron as electron } from "playwright";
import { executableName } from "@geode/opengeodeweb-front/app/utils/local/path.js";
import { isWindows } from "std-env";
import kill from "kill-port";
import { runBrowser } from "@geode/opengeodeweb-front/app/utils/local/scripts.js";

// Local imports
// oxlint-disable-next-line no-relative-parent-imports
import packageJson from "../../../package.json" with { type: "json" };

// Constants
const MILLISECONDS = 1000;
const LINUX_WAIT_BROWSER = 20;
const LINUX_WAIT_DESKTOP = 25;
const CLOUD_WAIT = 65;
const WINDOWS_WAIT_BROWSER = 25;
const WINDOWS_WAIT_DESKTOP = 30;
const SECONDS_NAVIGATION_TIMEOUT = 30;

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
  const buildPath = findLatestBuild(path.join(process.cwd(), "release", "0.0.0"));
  return parseElectronApp(buildPath).executable;
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

  electronApp.process().stdout.on("data", (data) => console.log(`stdout: ${data}`));
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

  return { electronApp, firstWindow };
}

async function navigateToApp(mode, browser) {
  const context = await browser.newContext({
    viewport: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  console.log(`Testing app in ${mode} mode`);
  if (mode === "BROWSER") {
    const nuxtPort = await runBrowser("preview:browser");
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));
    await page.goto(`http://localhost:${nuxtPort}`);
    console.log("Navigated to", page.url());
    console.log(`Waiting for ${WAIT_TIMES.browser / MILLISECONDS} seconds for the app to load...`);
    await page.waitForTimeout(WAIT_TIMES.browser);
    await page.waitForFunction(() => document.readyState === "complete");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    return {
      window: page,
      cleanup: async () => {
        await kill(nuxtPort);
      },
    };
  } else if (mode === "CLOUD") {
    page.on("console", (msg) => { console.log(`Browser console: ${msg.text()}`) });

    let prefix = "";
    const branch = execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();
    console.log("Current branch:", branch);
    if (branch === "next") {
      prefix = "next.";
    }
    const url = `https://${prefix}vease.geode-solutions.com`;
    console.log(`Navigating to: ${url}`);
    const navigationTimeout = SECONDS_NAVIGATION_TIMEOUT * MILLISECONDS;
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: navigationTimeout,
      });
    } catch (error) {
      throw new Error(`Failed to reach ${url}`, { cause: error });
    }

    console.log("Navigated to", page.url());
    const button = await page.getByRole("button", { name: "Load the app" });
    console.log({ button });
    await button.click();
    console.log(`Waiting for ${WAIT_TIMES.cloud / MILLISECONDS} seconds for the app to load...`);
    await page.waitForTimeout(WAIT_TIMES.cloud);
    await page.waitForFunction(() => document.readyState === "complete");

    return {
      window: page,
      cleanup: async () => {
        await page.close();
      },
    };
  } else if (mode === "DESKTOP") {
    const { electronApp, firstWindow } = await runDesktopBuild();
    console.log(`Waiting for ${WAIT_TIMES.desktop / MILLISECONDS} seconds for the app to load...`);
    await firstWindow.waitForTimeout(WAIT_TIMES.desktop);
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

export { navigateToApp };
