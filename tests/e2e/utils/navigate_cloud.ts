// Node imports
import { execSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";

// Third party imports
import { type Browser, type Page, expect } from "@playwright/test";
import { consola } from "consola";

// Local imports
import { MILLISECONDS, WAIT_TIMES } from "./navigate_config";

// Constants
const SECONDS_NAVIGATION_TIMEOUT = 5;

async function navigateToCloudApp(page: Page, url: string, maxRetries: number): Promise<void> {
  consola.info(`Navigating to: ${url}`);
  const navigationTimeout = SECONDS_NAVIGATION_TIMEOUT * MILLISECONDS;
  let lastError: unknown = undefined;
  let succeeded = false;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      consola.info(`Navigation attempt ${attempt}/${maxRetries}`);
      // oxlint-disable-next-line no-await-in-loop
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: navigationTimeout,
      });
      consola.info(`Attempt ${attempt} succeeded`);
      succeeded = true;
      break;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      consola.info(`Attempt ${attempt} failed: ${message}`);
      if (attempt < maxRetries) {
        // oxlint-disable-next-line no-await-in-loop
        await setTimeout(MILLISECONDS);
      }
    }
  }

  if (!succeeded) {
    throw new Error(`Failed to reach ${url} after ${maxRetries} attempts`, {
      cause: lastError,
    });
  }
  consola.info("Navigated to", page.url());
}

async function signInToCloudApp(page: Page): Promise<void> {
  const eMailInput = page.getByTestId("eMailInput").getByRole("textbox");
  const passwordInput = page.getByTestId("passwordInput").getByRole("textbox");
  await eMailInput.fill(process.env.GEODE_USER_EMAIL ?? "");
  await passwordInput.fill(process.env.GEODE_USER_PASSWORD ?? "");

  const signInSecondsWait = 2;
  const signInTimeout = signInSecondsWait * MILLISECONDS;
  await page.waitForTimeout(signInTimeout);
  const signInButton = page.getByTestId("signInButton");
  await signInButton.click();

  const loadAppButton = page.getByTestId("loadAppButton");
  await loadAppButton.click();
  consola.info(`Waiting up to ${WAIT_TIMES.cloud / MILLISECONDS} seconds for the app to load...`);
  await expect(page.getByTestId("layoutImportButton")).toBeEnabled({ timeout: WAIT_TIMES.cloud });
  await page.waitForFunction(() => document.readyState === "complete");
}

async function openCloudApp(
  browser: Browser,
  page: Page,
): Promise<{ window: Page; cleanup: () => Promise<void> }> {
  let prefix = "";
  const branch = execSync("git branch --show-current", {
    encoding: "utf8",
  }).trim();
  consola.info("Current branch:", branch);
  if (branch === "next") {
    prefix = "next.";
  }
  const url = `https://${prefix}vease.geode-solutions.com`;
  const maxRetries = 10;
  await navigateToCloudApp(page, url, maxRetries);
  await signInToCloudApp(page);

  return {
    window: page,
    cleanup: async () => {
      await page.close();
      await browser.close();
    },
  };
}

export { openCloudApp };
