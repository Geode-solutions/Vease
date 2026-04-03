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

// oxlint-disable-next-line no-relative-parent-imports
import packageJson from "../../package.json" with { type: "json" };

// Constants
const MILLISECONDS = 1000;
const LINUX_WAIT_BROWSER = 15;
const LINUX_WAIT_DESKTOP = 20;
const CLOUD_WAIT = 65;
const WINDOWS_WAIT_BROWSER = 20;
const WINDOWS_WAIT_DESKTOP = 30;

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
    args: ["--no-sandbox"],
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

async function navigateToApp(mode, page) {
  console.log(`Testing app in ${mode} mode`);
  if (mode === "BROWSER") {
    const nuxtPort = await runBrowser("preview:browser");
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));
    await page.goto(`http://localhost:${nuxtPort}`);
    console.log("Navigated to", page.url());
    await page.waitForTimeout(WAIT_TIMES.browser);
    await page.setViewportSize({ width: PAGE_WIDTH, height: PAGE_HEIGHT });
    return { window: page, cleanup: () => kill(nuxtPort) };
  } else if (mode === "CLOUD") {
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));

    let prefix = "";
    const branch = execSync("git branch --show-current", {
      encoding: "utf8",
    }).trim();
    console.log("Current branch:", branch);
    if (branch === "next") {
      prefix = "next.";
    }
    await page.goto(`https://${prefix}vease.geode-solutions.com`);

    console.log("Navigated to", page.url());
    const button = await page.getByRole("button", { name: "Launch the app" });
    console.log({ button });
    await button.click();
    await page.waitForTimeout(WAIT_TIMES.cloud);
    await page.setViewportSize({ width: PAGE_WIDTH, height: PAGE_HEIGHT });
    return { window: page, cleanup: () => page.close() };
  } else if (mode === "DESKTOP") {
    const { electronApp, firstWindow } = await runDesktopBuild();
    await firstWindow.waitForTimeout(WAIT_TIMES.desktop);
    return { window: firstWindow, cleanup: () => electronApp.close() };
  }
  throw new Error(`Unknown mode: ${mode}`);
}

export { navigateToApp };
