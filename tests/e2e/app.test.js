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
    timeout: 20000,
  });
  // console.log("electronApp", electronApp);
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

    await page.pause(10000);
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

// test("Window title", async () => {
//   const firstWindow = await electronApp.firstWindow();
//   const title = await firstWindow.title();
//   expect(title).toBe("Vease");
// });

// test("App packaged", async () => {
//   const isPackaged = await electronApp.evaluate(async ({ app }) => {
//     return app.isPackaged;
//   });
//   expect(isPackaged).toBe(true); // App should be tested as packaged
// });

test("Microservices running", async () => {
  console.log("START TEST", Date.now());

  const firstWindow = await electronApp.firstWindow();
  console.log("firstWindow", Date.now());
  // await firstWindow.waitForTimeout(10 * 1000);
  console.log("waitForTimeout", Date.now());

  await expect(firstWindow).toHaveScreenshot({
    path: "microservices-running-linux.png",
  });
  console.log("toHaveScreenshot", Date.now());
});
