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

let electronApp;
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
    headless: false,
    env: { ...process.env, ELECTRON_ENABLE_LOGGING: true },
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

    // const selector = await page.waitForSelector("#Microservices are starting");
    // console.log("selector", selector);

    // console.log("window loaded", Date.now());
  });

  // await electronApp.evaluate(({ app }) => {
  //   app.on("window-all-closed", () => {
  //     console.log("ELECTRON window-all-closed");
  //     app.quit();
  //   });

  //   app.on("will-quit", () => {
  //     console.log("ELECTRON will-quit");
  //     app.quit();
  //   });
  //   app.on("console", (msg) => {
  //     console.log(msg.text());
  //   });

  //   app.on("quit", () => {
  //     console.log("ELECTRON quit");
  //     app.quit();
  //   });
  //   app.whenReady().then(() => {
  //     console.log("ELECTRON whenReady");
  //   });
  // });
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
  // const microservices = [
  //   "http://localhost:5000/vease_back/healthcheck",
  //   "http://localhost:1234/vease_viewer/healthcheck",
  //   // Add more services as needed
  // ];
  // for (const service of microservices) {
  //   for (let i = 0; i < 10000; i++) {
  //     console.log("for", i);
  //     var response;
  //     try {
  //       response = await fetch(service);
  //       console.log("response", response);
  //     } catch (error) {
  //       console.log("error", error);
  //       continue;
  //     }
  //     if ("status" in response) {
  //       console.log(`Service ${service} is running`);
  //       expect(response.status).toBe(200);
  //       const data = await response.json();
  //       expect(data.message).toBe("healthy");
  //       break;
  //     }
  //   }
  //   console.log("waitForTimeout", Date.now());
  //   break;
  // }
  // console.log("before toHaveScreenshot", Date.now());
  await firstWindow.waitForTimeout(5 * 1000);
  // const viewer = firstWindow.getByTestId("hybrid_viewer");
  // console.log("viewer", viewer);
  // const canvas = viewer.locator("canvas");
  // console.log("canvas", canvas);
  // expecy
  // await firstWindow.waitForSelector("selector", { visible: true });
  // console.log("before toHaveScreenshot", Date.now());
  // await expect(firstWindow).toHaveScreenshot({
  //   path: "microservices-running-linux.png",
  // });
  // await electronApp.evaluate(({ app }) => {
  //   app.exit(0);
  // });
  console.log("toHaveScreenshot", Date.now());
});
