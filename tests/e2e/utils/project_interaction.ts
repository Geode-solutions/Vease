import type { Page } from "@playwright/test";
import { waitForActionSettled } from "./viewer_interaction";

async function exportProject(window: Page): Promise<void> {
  await window.getByTestId("projectMenuButton").click();
  await waitForActionSettled(window);
  await window.getByTestId("exportProjectButton").click();
  await waitForActionSettled(window);
}

async function importProject(window: Page, projectFilePath: string): Promise<void> {
  await window.getByTestId("projectMenuButton").click();
  await waitForActionSettled(window);
  const fileInput = window.getByTestId("importProjectInput");
  await fileInput.setInputFiles(projectFilePath);
  const importTimeout = 8000;
  await window.waitForTimeout(importTimeout);
}

export { exportProject, importProject };
