import {
  beforeEach,
  afterEach,
  describe,
  expect,
  test,
} from "@playwright/test";

import { ElectronApplication, Page, _electron as electron } from "playwright";

const {
  findLatestBuild,
  parseElectronApp,
} = require("electron-playwright-helpers");

let electronApp = ElectronApplication;
test.beforeAll(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild("./release/0.0.0/");
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // set the CI environment variable to true
  process.env.CI = "e2e";
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
  electronApp.on("window", async (page) => {
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
  await electronApp.close();
});
test("Window title", async () => {
  const firstWindow = await electronApp.firstWindow();
  const title = await firstWindow.title();
  expect(title).toBe("Vease");
});

// test("Microservices running", async () => {
//   const firstWindow = await electronApp.firstWindow();
//   // await firstWindow.waitFor(10000); // hard wait for 5000ms
//   await firstWindow.waitForTimeout(10000); // wait for 10 seconds

//   // await firstWindow.screenshot({ path: "./screenshot.png" });
//   await expect(firstWindow).toHaveScreenshot("./tests/e2e/screenshot.png");
// });
