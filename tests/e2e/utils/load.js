// Node imports
import path from "node:path";

import { afterActionWait } from "./viewer_interaction.js";

const __dirname = import.meta.dirname;

async function loadData(window, inputFilename) {
  const inputFileExtension = path.extname(inputFilename);
  console.log("loadData", { inputFilename, inputFileExtension });
  const inputFilePath = path.join(__dirname, "..", "tests", "data", inputFilename);
  const layoutImportButton = window.getByTestId("layoutImportButton");
  await layoutImportButton.click();
  const fileInput = window.locator(`input[type="file"][accept*="${inputFileExtension}"]`);
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(inputFilePath);
  const dataImportStepper = window.getByTestId("DataImportStepper");
  const finalizeImportButton = window.getByTestId("finalizeImportButton");
  await finalizeImportButton.click();
  await dataImportStepper.waitFor({ state: "detached" });
  await window.waitForTimeout(afterActionWait);
}

export { loadData };
