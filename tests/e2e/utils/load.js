// Node imports
import path from "node:path";

const __dirname = import.meta.dirname;
const loadTimeout = 4000;

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
  await window.waitForTimeout(loadTimeout);
  await window.evaluate(() => document.fonts.ready);
}

export { loadData };
