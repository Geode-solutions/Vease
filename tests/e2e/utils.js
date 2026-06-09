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

const beforeAllTimeout = 90_000;
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
    args: ["--no-sandbox", "--no-update"],
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

async function pointsMenuClick(window, viewerObjectType) {
  let menuTestId = undefined
  if (viewerObjectType === "model") {
    menuTestId = "modelPointsMenu"
  } else if (viewerObjectType === "mesh") {
    menuTestId = "meshPointsMenu";
  } else {
    throw new Error(`Unknown viewer object type: ${viewerObjectType}`);
  }
  const pointsMenuButton = await window.getByTestId(menuTestId);
  await pointsMenuButton.click({ force: true });
}

async function getPointsVisibilitySwitch(window, viewerObjectType) {
  let menuTestId = undefined
  if (viewerObjectType === "model") {
    menuTestId = "modelPointsVisibilitySwitch"
  } else if (viewerObjectType === "mesh") {
    menuTestId = "meshPointsVisibilitySwitch";
  } else {
    throw new Error(`Unknown viewer object type: ${viewerObjectType}`);
  }
  const pointsVisibilitySwitch = await window.getByTestId(menuTestId).getByRole("checkbox");
  return pointsVisibilitySwitch;
}

async function getPointsSizeSlider(window, viewerObjectType) {
  let menuTestId = undefined
  if (viewerObjectType === "model") {
    menuTestId = "modelPointsSizeSlider"
  } else if (viewerObjectType === "mesh") {
    menuTestId = "meshPointsSizeSlider";
  } else {
    throw new Error(`Unknown viewer object type: ${viewerObjectType}`);
  }
  const pointsSizeSlider = await window.getByTestId(menuTestId);
  return pointsSizeSlider;
}

async function setPointsVisibilitySwitchValue(window, viewerObjectType, visibility) {
  const pointsVisibilitySwitch = await getPointsVisibilitySwitch(window, viewerObjectType);
  await pointsVisibilitySwitch[visibility ? "check" : "uncheck"]({ force: true });
}

async function setPointsSizeSliderValue(window, viewerObjectType, size) {
  const pointsSizeSlider = await getPointsSizeSlider(window, viewerObjectType);
  await pointsSizeSlider.locator('input').first().evaluate((node, val) => {
    node.value = val;
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, size.toString());
}

async function setPointsSize(window, viewerObjectType, size) {
  await pointsMenuClick(window, viewerObjectType);
  await setPointsVisibilitySwitchValue(window, viewerObjectType, true);
  await setPointsSizeSliderValue(window, viewerObjectType, size);
  await pointsMenuClick(window, viewerObjectType);
  await window.waitForTimeout(afterActionWait);
}

async function setPointsVisibility(window, viewerObjectType, visibility) {
  await pointsMenuClick(window, viewerObjectType);
  await setPointsVisibilitySwitchValue(window, viewerObjectType, visibility);
  await pointsMenuClick(window, viewerObjectType);
  await window.waitForTimeout(afterActionWait);
}

async function vertexAttribute(
  window,
  menuTestId,
  { attributeName = "points", colorMap = undefined, min = undefined, max = undefined } = {},
) {
  const menuButton = window.getByTestId(menuTestId);
  if (
    !(await menuButton
      .locator("button.menu-btn")
      .evaluate((node) => node.classList.contains("v-btn--active")))
  ) {
    await menuButton.click();
    await window.waitForTimeout(afterActionWait);
  }

  await window.getByTestId("coloringStyleSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .getByText("Vertex attribute")
    .filter({ visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);

  await window.getByTestId("attributeSelector").first().click();
  await window.waitForTimeout(afterActionWait);

  await window
    .locator(".v-overlay-container")
    .getByText(attributeName, { exact: true })
    .filter({ visible: true })
    .first()
    .click();
  await window.waitForTimeout(afterActionWait);

  if (colorMap) {
    await window.getByTestId("colorMapPicker").first().click();
    await window.waitForTimeout(afterActionWait);

    await window.getByPlaceholder("Search presets...").fill(colorMap);
    await window.waitForTimeout(afterActionWait);

    await window
      .getByTestId("colorMapList")
      .getByText(colorMap, { exact: true })
      .filter({ visible: true })
      .first()
      .click();
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
}

async function openFeatureMenu(window, viewerObjectType, feature) {
  const menuTestId = `${viewerObjectType}${feature}Menu`;
  const menuButton = await window.getByTestId(menuTestId);
  await menuButton.click({ force: true });
}

async function setFeatureVisibility(window, viewerObjectType, feature, visibility) {
  const switchTestId = `${viewerObjectType}${feature}VisibilitySwitch`;
  const visibilitySwitch = await window.getByTestId(switchTestId).getByRole("checkbox");
  await visibilitySwitch[visibility ? "check" : "uncheck"]({ force: true });
}

async function setFeatureSizeOrWidth(window, viewerObjectType, feature, value) {
  let sliderTestId = `${viewerObjectType}${feature}SizeSlider`;
  if (feature === 'Edges') {
    sliderTestId = `${viewerObjectType}${feature}WidthSlider`;
  }
  const slider = await window.getByTestId(sliderTestId);
  await slider.locator('input').first().evaluate((node, val) => {
    node.value = val;
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, value.toString());
}

async function setFeatureColorRandom(window) {
  const select = await window.getByTestId("coloringStyleSelector").first();
  await select.click();

  const randomOption = window.getByRole('option', { name: 'Random color' });
  try {
    await randomOption.waitFor({ state: 'visible', timeout: 2000 });
    await randomOption.click();
  } catch (error) {
    // Random color is not available (e.g. on Meshes), close the select overlay
    await window.keyboard.press("Escape");
    await window.waitForTimeout(afterActionWait);

    // Use the color picker directly instead
    const colorPicker = window.locator('.v-color-picker').first();
    if (await colorPicker.count() > 0) {
      await colorPicker.click({ position: { x: 50, y: 50 }, force: true });
    }
  }
}

export {
  afterActionWait,
  beforeAllTimeout,
  loadData,
  navigateToApp,
  pointsMenuClick,
  setPointsSize,
  setPointsVisibility,
  viewerContextMenu,
  vertexAttribute,
  openFeatureMenu,
  setFeatureVisibility,
  setFeatureSizeOrWidth,
  setFeatureColorRandom,
};
