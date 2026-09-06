// Node imports
import path from "node:path";

// Third party imports
import { expect } from "@playwright/test";

const __dirname = import.meta.dirname;
const loadWorkflowTimeout = 5000;

function getLayoutImportButton(window) {
  return window.getByTestId("layoutImportButton");
}

async function loadDatas(
  window,
  inputDataFilenames,
  {
    loadTimeout = loadWorkflowTimeout,
    inputDataPath = path.join(__dirname, "..", "tests", "data"),
  },
) {
  console.log(`Loading datas: ${inputDataFilenames} from ${inputDataPath}`);
  const inputFileExtension = path.extname(inputDataFilenames[0]);
  const inputDataFilePaths = inputDataFilenames.map((filename) =>
    path.join(inputDataPath, filename),
  );
  const layoutImportButton = getLayoutImportButton(window);
  await layoutImportButton.waitFor({ state: "visible" });
  const layoutImportButtonTimeout = 50_000;
  await expect(layoutImportButton).toBeEnabled({ timeout: layoutImportButtonTimeout });
  await layoutImportButton.click();
  const fileInput = window.locator(`input[type="file"][accept*="${inputFileExtension}"]`);
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(inputDataFilePaths);
  const dataImportStepper = window.getByTestId("DataImportStepper");
  const finalizeImportButton = window.getByTestId("finalizeImportButton");
  await finalizeImportButton.click();
  await dataImportStepper.waitFor({ state: "detached" });
  await window.waitForTimeout(loadTimeout);
}

export { loadDatas };
