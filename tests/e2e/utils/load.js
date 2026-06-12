// Node imports
import path from "node:path";

const __dirname = import.meta.dirname;

async function loadData(window, inputFilename) {
  const inputFileExtension = path.extname(inputFilename);
  console.log("inputFileExtension", inputFileExtension);
  const inputFilePath = path.join(__dirname, "..", "tests", "data", inputFilename);
  const importButton = await window.getByRole("button", { name: "Import" });
  await importButton.click();
  const fileInput = window.locator(`input[type="file"][accept*="${inputFileExtension}"]`);
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(inputFilePath);
  const finalizeButton = window.getByTestId("finalizeImportButton");
  await finalizeButton.waitFor({ state: "visible", timeout: 15_000 });
  await finalizeButton.click();
  const loadWorkflowTimeout = 8000;
  await window.waitForTimeout(loadWorkflowTimeout);
}

export { loadData };
