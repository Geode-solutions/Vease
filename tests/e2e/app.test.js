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

test("App packaged", async () => {
  const isPackaged = await electronApp.evaluate(async ({ app }) => {
    return app.isPackaged;
  });
  expect(isPackaged).toBe(true); // App should be tested as packaged
});

// test("Microservices running", async () => {
//   console.log("TOTO");

//   const app = await electronApp.evaluate(async ({ app }) => {
//     console.log("test app", app);

//     return app;
//   });
//   await app.waitFor();

//   const result = await electronApp.evaluate(async ({ ipcRenderer }) => {
//     return ipcRenderer.send("microservices_connected");
//   });
//   console.log("test app result", result);

//   console.log("test app electronApp", electronApp);

//   expect(result).toBe(true);
// });
