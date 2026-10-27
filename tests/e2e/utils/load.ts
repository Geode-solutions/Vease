// Node imports
import path from "node:path";

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";
import { consola } from "consola";

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
  consola.info(`Loading datas: ${inputDataFilenames.join(", ")} from ${inputDataPath}`);
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

function getDataImportStepper(window: Page): Locator {
  return window.getByTestId("DataImportStepper");
}

async function selectTimeSeriesFile(window: Page, timeSeriesPath: string): Promise<void> {
  consola.info(`Importing time series ${timeSeriesPath}`);
  await getLayoutImportButton(window).click();
  const fileInput = window.locator(`input[type="file"][accept*="${path.extname(timeSeriesPath)}"]`);
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(timeSeriesPath);
  await getDataImportStepper(window).getByTestId("timeSeriesTarget").first().waitFor();
  await waitForActionSettled(window);
}

async function selectTimeSeriesTarget(window: Page, targetName: string): Promise<void> {
  const dataImportStepper = getDataImportStepper(window);
  await dataImportStepper.getByTestId("timeSeriesTarget").filter({ hasText: targetName }).click();
  await dataImportStepper.getByText("Mandatory files:").waitFor();
  await waitForActionSettled(window);
}

// The referenced files are found in the folder and uploaded level by level, then Apply shows up
async function selectTimeSeriesFolder(window: Page, folderPath: string): Promise<void> {
  const folderInput = getDataImportStepper(window).locator('input[type="file"][webkitdirectory]');
  await folderInput.waitFor({ state: "attached" });
  await folderInput.setInputFiles(folderPath);
  await window.getByTestId("applyTimeSeriesButton").waitFor();
  await waitForActionSettled(window);
}

async function applyTimeSeries(window: Page, loadTimeout = loadWorkflowTimeout): Promise<void> {
  await window.getByTestId("applyTimeSeriesButton").click();
  await getDataImportStepper(window).waitFor({ state: "detached" });
  await waitForActionSettled(window, loadTimeout);
}

export {
  applyTimeSeries,
  loadVeaseTestDatas,
  selectTimeSeriesFile,
  selectTimeSeriesFolder,
  selectTimeSeriesTarget,
};
