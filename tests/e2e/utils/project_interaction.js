import { afterActionWait } from "./viewer_interaction.js";
import path from "node:path";

async function exportProject(window, downloadDir) {
  await window.getByTestId("projectMenuButton").click();
  await window.waitForTimeout(afterActionWait);
  const downloadPromise = window.waitForEvent("download");
  await window.getByTestId("exportProjectButton").click();
  await window.waitForTimeout(afterActionWait);
  const download = await downloadPromise;
  const downloadPath = path.join(downloadDir, download.suggestedFilename());
  await download.saveAs(downloadPath);
  return downloadPath;
}

async function importProject(window, projectFilePath) {
  await window.getByTestId("projectMenuButton").click();
  await window.waitForTimeout(afterActionWait);
  const fileInput = window.getByTestId("importProjectInput");
  await fileInput.setInputFiles(projectFilePath);
  const importTimeout = 8000;
  await window.waitForTimeout(importTimeout);
}

export { exportProject, importProject };
