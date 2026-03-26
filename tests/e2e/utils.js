// Node imports
import { execSync } from "node:child_process";

// Third party imports
import { isWindows } from "std-env";
import { runBrowser } from "@geode/opengeodeweb-front/app/utils/local/scripts.js";
const MILLISECONDS = 1000;

// Constants
const LINUX_TIMEOUT_BROWSER = 10;
const LINUX_TIMEOUT_DESKTOP = 15;
const CLOUD_TIMEOUT = 100;
const WINDOWS_TIMEOUT_BROWSER = 15;
const WINDOWS_TIMEOUT_DESKTOP = 30;

const TIMEOUTS = {
  browser: (isWindows ? WINDOWS_TIMEOUT_BROWSER : LINUX_TIMEOUT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_TIMEOUT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_TIMEOUT_DESKTOP : LINUX_TIMEOUT_DESKTOP) * MILLISECONDS,
};

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;

async function runDesktopBuild() {
  // Find the latest build in the out directory
  const latestBuild = findLatestBuild(path.join(process.cwd(), "release", "0.0.0"));
  console.log("latestBuild", latestBuild);
  // Parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // Set the CI environment variable to true
  //oxlint-disable-next-line id-length
  process.env.CI = "e2e";
  const electronApp = await electron.launch({
    args: [appInfo.main, "--no-sandbox"],
    executablePath: appInfo.executable,
    timeout: 20_000,
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
      await window.setSize(width, height);
    },
    { width: PAGE_WIDTH, height: PAGE_HEIGHT },
  );

  return { electronApp, firstWindow };
}

async function navigateToApp(page, mode) {
  console.log(`Testing app in ${mode} mode`);

  if (mode === "BROWSER") {
    const nuxtPort = await runBrowser("preview:browser");
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));
    await page.goto(`http://localhost:${nuxtPort}`);
    console.log("Navigated to", page.url());
    await page.waitForTimeout(TIMEOUTS.browser);
    await page.setViewportSize({ width: PAGE_WIDTH, height: PAGE_HEIGHT });
    return { nuxtPort };
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
    await page.waitForTimeout(TIMEOUTS.cloud);
  } else if (mode === "DESKTOP") {
    const { electronApp, firstWindow } = await runDesktopBuild();
    await firstWindow.waitForTimeout(TIMEOUTS.desktop);
    return { electronApp };
  } else {
    throw new Error(`Unknown mode: ${mode}`);
  }
  await page.setViewportSize({ width: PAGE_WIDTH, height: PAGE_HEIGHT });
}

function cleanupApp() {
  console.log("cleanupApp");
}

export { cleanupApp, navigateToApp };
