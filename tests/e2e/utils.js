import { runBrowser } from "@geode/opengeodeweb-front/app/utils/local/scripts.js";
const MILLISECONDS = 1000;

// Constants browser
const WINDOWS_TIMEOUT = 15;
const LINUX_TIMEOUT = 10;
// Constants cloud
const PAGE_TIMEOUT = 100;
const DEFAULT_TIMEOUT = 150;

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;

async function navigateToApp(page) {
  const mode = "";
  if (mode === "browser") {
    nuxtPort = await runBrowser("preview:browser");
    page.on("console", (msg) => console.log(`Browser console: ${msg.text()}`));
    await page.goto(`http://localhost:${nuxtPort}`);
    console.log("Navigated to", page.url());
    await page.setViewportSize({ width: 1200, height: 800 });
  } else if (mode === "cloud") {
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
  }
  await page.waitForTimeout(PAGE_TIMEOUT * MILLISECONDS);
  await page.setViewportSize({ width: PAGE_WIDTH, height: PAGE_HEIGHT });
}

export { navigateToApp };
