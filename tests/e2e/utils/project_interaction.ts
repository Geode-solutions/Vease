import type { Page } from "@playwright/test";
import { closeFeedbackSnackbar } from "./app_interaction";
import { waitForActionSettled } from "./wait_for_action_settled";

const importProjectTimeout = 20_000;

async function exportProject(window: Page, savePath: string): Promise<void> {
  await window.getByTestId("projectMenuButton").click();
  await waitForActionSettled(window);
  const [download] = await Promise.all([
    window.waitForEvent("download"),
    window.getByTestId("exportProjectButton").click(),
  ]);
  await download.saveAs(savePath);
  await waitForActionSettled(window);
  await closeFeedbackSnackbar(window);
}

async function importProject(window: Page, projectFilePath: string): Promise<void> {
  await window.getByTestId("projectMenuButton").click();
  await waitForActionSettled(window);
  const fileInput = window.getByTestId("importProjectInput");
  await fileInput.setInputFiles(projectFilePath);
  await waitForActionSettled(window, importProjectTimeout);
  await closeFeedbackSnackbar(window);
}

export { exportProject, importProject };
