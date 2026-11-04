// Third party imports
import { type ElectronApplication, _electron as electron } from "playwright";
import type { BrowserWindow } from "electron";
import type { Page } from "@playwright/test";
import { consola } from "consola";

// Local imports
import { LOCALE, PAGE_HEIGHT, PAGE_WIDTH, WAIT_TIMES } from "./navigate_config";
import { findAppExecutable } from "./navigate_executable";
import { waitForAppReady } from "./navigate_ready";

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

export { runDesktopBuild };
