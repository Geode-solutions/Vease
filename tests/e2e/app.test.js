import {
  beforeEach,
  afterEach,
  describe,
  expect,
  test,
} from "@playwright/test";
import { ElectronApplication, Page, _electron as electron } from "playwright";
import {
  electronWaitForFunction,
  findLatestBuild,
  parseElectronApp,
} from "electron-playwright-helpers";

import path from "path";

let electronApp;
test.beforeAll(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild(
    path.join(process.cwd(), "release", "0.0.0")
  );
  console.log("latestBuild", latestBuild);
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // set the CI environment variable to true
  process.env.CI = "e2e";
  electronApp = await electron.launch({
    args: [appInfo.main, "--no-sandbox"],
    executablePath: appInfo.executable,
    timeout: 20000,
    headless: false,
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: true,
      NODE_ENV: "development",
    },
  });

  const firstWindow = await electronApp.firstWindow();
  const browserWindow = await electronApp.browserWindow(firstWindow);
  await browserWindow.evaluate(async (window) => {
    await window.unmaximize();
  });

  await electronApp.on("window", async (page) => {
    const filename = page.url()?.split("/").pop();
    console.log(`Window opened: ${filename}`);

    // capture errors
    page.on("pageerror", (error) => {
      console.error(error);
    });
    // capture console messages
    page.on("console", (msg) => {
      console.log(msg.text());
    });
  });
});

test.afterAll(async () => {
  console.log("afterAll");
  const windows = await electronApp.windows();
  for (const window of windows) {
    console.log("window");
    await window.close();
    console.log("window end");
  }
  console.log("end");
  await electronApp.close();
  console.log("afterAll end", Date.now());
});

test("Window title", async () => {
  const firstWindow = await electronApp.firstWindow();
  const title = await firstWindow.title();
  expect(title).toBe("Vease");
});

test("App packaged", async () => {
  const isPackaged = await electronApp.evaluate(async ({ app }) => {
    return app.isPackaged;
  });
  expect(isPackaged).toBe(true); // App should be tested as packaged
});

test("Microservices running", async () => {
  console.log("START TEST", Date.now());

  const firstWindow = await electronApp.firstWindow();

  // const browserWindow = await electronApp.browserWindow(firstWindow);
  // await browserWindow.evaluate((window) => {
  //   console.log("TEST minimize");
  //   window.setBounds();
  // });
  // console.log("AFTER TEST minimize");

  console.log("firstWindow", Date.now());
  await firstWindow.waitForTimeout(15 * 1000);
  console.log("process.platform", process.platform);
  await expect(firstWindow).toHaveScreenshot({
    path: `microservices-running-${process.platform}.png`,
  });
  console.log("toHaveScreenshot", Date.now());
});
