// Node imports
import path from "node:path";

import { afterActionWait } from "./viewer_interaction.js";

const __dirname = import.meta.dirname;
const desktopLoadTimeout = 4000;

async function loadData(window, inputFilename) {
  const inputFileExtension = path.extname(inputFilename);
  console.log("loadData", { inputFilename, inputFileExtension });
  const inputFilePath = path.join(__dirname, "..", "tests", "data", inputFilename);
  const layoutImportButton = window.getByTestId("layoutImportButton");
  await layoutImportButton.click({ force: true });
  const fileInput = window.locator(`input[type="file"][accept*="${inputFileExtension}"]`);
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(inputFilePath);
  const dataImportStepper = window.getByTestId("DataImportStepper");
  const finalizeImportButton = window.getByTestId("finalizeImportButton");
  await finalizeImportButton.click();
  await dataImportStepper.waitFor({ state: "detached" });
  const loadTimeout = process.env.CI ? desktopLoadTimeout : afterActionWait;
  await window.waitForTimeout(loadTimeout);
}

export { loadData };
