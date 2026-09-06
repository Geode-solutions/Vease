// Node imports
import path from "node:path";

// Third party imports
import { waitForLoadingScreen } from "vease/tests/e2e/utils/other.js";

// Local imports
import { modalTransitionWait } from "./constants.js";
import { navigateToExtensionsPage } from "./navigate.js";

async function loadExtension(window, extensionFilePath) {
  await waitForLoadingScreen(window);
  try {
    const inputFileExtension = path.extname(extensionFilePath);
    console.log("loadExtension", { inputFileExtension, extensionFilePath });
    await navigateToExtensionsPage(window);
    // Wait for modal transition
    await window.waitForTimeout(modalTransitionWait);
    const installedExtensionButton = await window.getByRole("tab", { name: "Installed" });
    await installedExtensionButton.click();
    await window.waitForTimeout(modalTransitionWait);

    const fileInput = window.locator(`input[type="file"][accept*="${inputFileExtension}"]`);
    await fileInput.waitFor({ state: "attached" });
    await fileInput.setInputFiles(extensionFilePath);
    const loadWorkflowTimeout = 30_000;
    await window.waitForTimeout(loadWorkflowTimeout);
    await waitForLoadingScreen(window);
    await window.waitForTimeout(modalTransitionWait);
    await waitForLoadingScreen(window);
  } catch (error) {
    console.error("Failed to load extension:", error);
    throw error;
  }
}

async function removeExtension(window, extensionName) {
  await waitForLoadingScreen(window);
  const importExtensionButton = window.locator("button:has(.mdi-puzzle)").first();
  await importExtensionButton.waitFor({ state: "visible", timeout: 60_000 });
  await importExtensionButton.click({ timeout: 60_000 });
  // Wait for modal transition
  await window.waitForTimeout(modalTransitionWait);
  const installedExtensionButton = await window.getByRole("tab", { name: "Installed" });
  await installedExtensionButton.click();
  let removed = false;
  try {
    const extensionButton = window
      .locator(".v-expansion-panel")
      .filter({ hasText: extensionName })
      .locator("button")
      .last();
    await extensionButton.waitFor({ state: "visible", timeout: 2000 });
    await extensionButton.click();
    await window.getByText("Remove", { exact: true }).click();
    removed = true;
  } catch {
    // Extension not found, which is fine
  }
  if (removed) {
    const removeWorkflowTimeout = 10_000;
    await window.waitForTimeout(removeWorkflowTimeout);
  }
  await window.waitForTimeout(modalTransitionWait);
}

export { loadExtension, removeExtension };
