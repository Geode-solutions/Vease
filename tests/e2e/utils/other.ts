import type { Page } from "@playwright/test";

async function waitForLoadingScreen(window: Page): Promise<void> {
  const loadingScreen = window.locator('div[style*="z-index: 3"][style*="backdrop-filter: blur"]');
  await loadingScreen.waitFor({ state: "hidden", timeout: 180_000 });
}

function assertDefined<Value>(value: Value | undefined, message: string): Value {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

export { assertDefined, waitForLoadingScreen };
