// Node imports
import path from "node:path";

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";

// Local imports
import { waitForActionSettled } from "./wait_for_action_settled";

const __dirname = import.meta.dirname;
const loadWorkflowTimeout = 8000;

function getLayoutImportButton(window: Page): Locator {
  return window.getByTestId("layoutImportButton");
}

async function loadVeaseTestDatas(
  window: Page,
  inputDataFilenames: string[],
  {
    loadTimeout = loadWorkflowTimeout,
    inputDataPath = path.join(__dirname, "..", "tests", "data"),
  }: { loadTimeout?: number; inputDataPath?: string } = {},
): Promise<void> {
  console.log(`Loading datas: ${inputDataFilenames.join(", ")} from ${inputDataPath}`);
  const [firstInputDataFilename] = inputDataFilenames;
  if (firstInputDataFilename === undefined) {
    throw new Error("No input data filenames provided");
  }
  const inputFileExtension = path.extname(firstInputDataFilename);
  const inputDataFilePaths = inputDataFilenames.map((filename) =>
    path.join(inputDataPath, filename),
  );
  const layoutImportButton = getLayoutImportButton(window);
  await layoutImportButton.waitFor({ state: "visible" });
  const layoutImportButtonTimeout = 20_000;
  await expect(layoutImportButton).toBeEnabled({ timeout: layoutImportButtonTimeout });
  await layoutImportButton.click();
  const fileInput = window.locator(`input[type="file"][accept*="${inputFileExtension}"]`);
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(inputDataFilePaths);
  const dataImportStepper = window.getByTestId("DataImportStepper");
  const finalizeImportButton = window.getByTestId("finalizeImportButton");
  await finalizeImportButton.click();
  await dataImportStepper.waitFor({ state: "detached" });
  await waitForActionSettled(window, loadTimeout);
}

export { loadVeaseTestDatas };
