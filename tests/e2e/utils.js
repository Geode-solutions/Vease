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
const __dirname = import.meta.dirname;
const MILLISECONDS = 1000;
const LINUX_WAIT_BROWSER = 20;
const LINUX_WAIT_DESKTOP = 25;
const CLOUD_WAIT = 65;
const WINDOWS_WAIT_BROWSER = 25;
const WINDOWS_WAIT_DESKTOP = 30;

const WAIT_TIMES = {
  browser: (isWindows ? WINDOWS_WAIT_BROWSER : LINUX_WAIT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_WAIT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_WAIT_DESKTOP : LINUX_WAIT_DESKTOP) * MILLISECONDS,
};

const beforeAllTimeout = 30_000;
const afterActionWait = 1500;

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

async function navigateToApp(mode, browser) {
  const context = await browser.newContext({
    viewport: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
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
    const button = await page.getByRole("button", { name: "Load the app" });
    console.log({ button });
    await button.click();
    console.log(`Waiting for ${WAIT_TIMES.cloud / MILLISECONDS} seconds for the app to load...`);
    await page.waitForTimeout(WAIT_TIMES.cloud);
    await page.waitForFunction(() => document.readyState === "complete");
    return { window: page, cleanup: () => page.close() };
  } else if (mode === "DESKTOP") {
    const { electronApp, firstWindow } = await runDesktopBuild();
    console.log(`Waiting for ${WAIT_TIMES.desktop / MILLISECONDS} seconds for the app to load...`);
    await firstWindow.waitForTimeout(WAIT_TIMES.desktop);
    await firstWindow.waitForFunction(() => document.readyState === "complete");
    return { window: firstWindow, cleanup: () => electronApp.close() };
  }
  throw new Error(`Unknown mode: ${mode}`);
}

async function loadData(window, inputFilename) {
  const inputFileExtension = path.extname(inputFilename);
  console.log("inputFileExtension", inputFileExtension);
  const inputFilePath = path.join(__dirname, "tests", "data", inputFilename);
  const importButton = await window.getByRole("button", { name: "Import" });
  await importButton.click();
  const fileInput = window.locator(`input[type="file"][accept*="${inputFileExtension}"]`);
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(inputFilePath);
  await window.getByRole("main").getByRole("button", { name: "Import", exact: true }).click();
  const loadWorkflowTimeout = 8000;
  await window.waitForTimeout(loadWorkflowTimeout);
}

async function viewerContextMenu(window, x, y) {
  await window.getByTestId("hybridViewer").locator("canvas").click({
    button: "right",
    position: { x, y },
  });
  await window.waitForTimeout(afterActionWait);
}

async function pointsVisibility(window, viewerObjectType, visibility) {
  const menuTestId = viewerObjectType === "model" ? "modelPointsMenu" : "meshPointsMenu";
  const switchTestId = viewerObjectType === "model" ? "modelPointsVisibilitySwitch" : "meshPointsVisibilitySwitch";

  const pointsMenuButton = window.getByTestId(menuTestId);
  if (!await pointsMenuButton.locator("button.menu-btn").evaluate(node => node.classList.contains("v-btn--active"))) {
    await pointsMenuButton.click();
    await window.waitForTimeout(afterActionWait);
  }
  await window.getByTestId(switchTestId).getByRole("checkbox")[visibility ? "check" : "uncheck"]();
  await window.waitForTimeout(afterActionWait);
}

async function vertexAttribute(window, menuTestId, {
  attributeName = "points",
  colorMap = undefined,
  min = undefined,
  max = undefined,
} = {}) {
  const menuButton = window.getByTestId(menuTestId);
  if (!await menuButton.locator("button.menu-btn").evaluate(node => node.classList.contains("v-btn--active"))) {
    await menuButton.click();
    await window.waitForTimeout(afterActionWait);
  }

  await window.getByTestId("coloringStyleSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window.locator(".v-overlay-container").getByText("Vertex attribute").filter({ visible: true }).first().click();
  await window.waitForTimeout(afterActionWait);

  await window.getByTestId("attributeSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window.locator(".v-overlay-container").getByText(attributeName, { exact: true }).filter({ visible: true }).first().click();
  await window.waitForTimeout(afterActionWait);

  if (colorMap) {
    await window.getByTestId("colorMapPicker").first().click();
    await window.waitForTimeout(afterActionWait);

    await window.getByPlaceholder("Search presets...").fill(colorMap);
    await window.waitForTimeout(afterActionWait);

    await window.getByTestId("colorMapList").getByText(colorMap, { exact: true }).filter({ visible: true }).first().click();
    await window.waitForTimeout(afterActionWait);
  }

  if (min !== undefined) {
    const input = window.getByTestId("attributeMinInput").first().locator("input");
    await input.fill(min.toString());
    await input.press("Enter");
    await window.waitForTimeout(afterActionWait);
  }
  if (max !== undefined) {
    const input = window.getByTestId("attributeMaxInput").first().locator("input");
    await input.fill(max.toString());
    await input.press("Enter");
    await window.waitForTimeout(afterActionWait);
  }

  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
}

export {
  afterActionWait,
  beforeAllTimeout,
  loadData,
  navigateToApp,
  pointsVisibility,
  viewerContextMenu,
  vertexAttribute,
};
