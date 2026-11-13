// Node imports
import path from "node:path";

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";
import { consola } from "consola";

// Local imports
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

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

interface CsvColumns {
  x: string;
  y: string;
  z: string;
}

async function selectCsvColumn(
  window: Page,
  csvDialog: Locator,
  label: string,
  column: string,
): Promise<void> {
  await csvDialog.locator(".v-select").filter({ hasText: label }).click();
  await window.getByRole("option", { name: column, exact: true }).click();
  // The closing menu stays in the DOM during its transition and would duplicate the next options
  await expect(window.getByRole("option")).toHaveCount(0);
}

// A CSV opens the previewer dialog: map the coordinate columns, then Confirm uploads the JSON sidecar
async function loadVeaseCsvData(
  window: Page,
  inputDataFilename: string,
  columns: CsvColumns,
  { loadTimeout = loadWorkflowTimeout }: { loadTimeout?: number } = {},
): Promise<void> {
  const inputDataFilePath = path.join(__dirname, "..", "tests", "data", inputDataFilename);
  consola.info(`Loading CSV ${inputDataFilePath}`);
  const layoutImportButton = getLayoutImportButton(window);
  await expect(layoutImportButton).toBeEnabled({ timeout: 20_000 });
  await layoutImportButton.click();
  const fileInput = window.locator('input[type="file"][accept*=".csv"]');
  await fileInput.waitFor({ state: "attached" });
  await fileInput.setInputFiles(inputDataFilePath);
  const csvDialog = window
    .locator(".v-dialog")
    .filter({ hasText: "CSV Previewer & Configuration" });
  await csvDialog.waitFor();
  await selectCsvColumn(window, csvDialog, "X Column", columns.x);
  await selectCsvColumn(window, csvDialog, "Y Column", columns.y);
  await selectCsvColumn(window, csvDialog, "Z Column", columns.z);
  await csvDialog.getByRole("button", { name: "Confirm" }).click();
  await csvDialog.waitFor({ state: "detached" });
  const dataImportStepper = getDataImportStepper(window);
  await window.getByTestId("finalizeImportButton").click();
  await dataImportStepper.waitFor({ state: "detached" });
  await waitForActionSettled(window, loadTimeout);
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
  loadVeaseCsvData,
  loadVeaseTestDatas,
  selectTimeSeriesFile,
  selectTimeSeriesFolder,
  selectTimeSeriesTarget,
};
