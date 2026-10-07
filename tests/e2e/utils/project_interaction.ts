import { type Page, expect } from "@playwright/test";
import type { ElectronApplication } from "playwright";
import { closeFeedbackSnackbar } from "./app_interaction";
import { waitForActionSettled } from "./wait_for_action_settled";

const importProjectTimeout = 20_000;
const downloadTimeout = 30_000;

declare global {
  var e2eDownloadState: string | undefined;
}

async function saveNextElectronDownload(
  electronApp: ElectronApplication,
  savePath: string,
  trigger: () => Promise<void>,
): Promise<void> {
  await electronApp.evaluate(({ session }, filePath) => {
    globalThis.e2eDownloadState = "pending";
    session.defaultSession.once("will-download", (_event, item) => {
      item.setSavePath(filePath);
      item.once("done", (_doneEvent, state) => {
        globalThis.e2eDownloadState = state;
      });
    });
  }, savePath);
  await trigger();
  async function getDownloadState(): Promise<string | undefined> {
    const state = await electronApp.evaluate(() => globalThis.e2eDownloadState);
    return state;
  }
  await expect.poll(getDownloadState, { timeout: downloadTimeout }).toBe("completed");
}

async function exportProject(
  window: Page,
  savePath: string,
  electronApp?: ElectronApplication,
): Promise<void> {
  await window.getByTestId("projectMenuButton").click();
  await waitForActionSettled(window);
  const exportProjectButton = window.getByTestId("exportProjectButton");
  if (electronApp) {
    await saveNextElectronDownload(electronApp, savePath, async () => {
      await exportProjectButton.click();
    });
  } else {
    const [download] = await Promise.all([
      window.waitForEvent("download"),
      exportProjectButton.click(),
    ]);
    await download.saveAs(savePath);
  }
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
