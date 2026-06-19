import { afterActionWait } from "./viewer_interaction.js";

async function exportProject(window) {
  await window.getByTestId("projectMenuButton").click();
  await window.waitForTimeout(afterActionWait);
  await window.getByTestId("exportProjectButton").click();
  await window.waitForTimeout(afterActionWait);
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
