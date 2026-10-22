// Node imports

// Third party imports
import { type Page, expect } from "@playwright/test";

// Local imports
import { WAIT_TIMES } from "./constants";
import { getDataTableRow } from "./data_manager";
import { waitForActionSettled } from "./wait_for_action_settled";

async function expectDataRows(window: Page, itemNames: string[]): Promise<void> {
  // oxlint-disable no-await-in-loop
  for (const itemName of itemNames) {
    await expect(getDataTableRow(window, itemName)).toBeVisible();
  }
  // oxlint-enable no-await-in-loop
}

async function openCrsByButton(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("crsDataButton").click({ force: true });
  await waitForActionSettled(window);
}

async function assignCrs(window: Page, crsName: string): Promise<void> {
  await window.getByTestId("crsSearchInput").locator("input").fill(crsName);
  await window.locator("tr").filter({ hasText: crsName }).locator("input").first().check();
  await window.getByTestId("crsAssignButton").click();
  await waitForActionSettled(window);
}

async function expectCurrentCrs(window: Page, expected: string): Promise<void> {
  await expect(window.getByTestId("crsCurrentValue")).toContainText(expected);
}

async function convertCrs(window: Page, crsName: string): Promise<void> {
  await window.getByTestId("crsModeConvert").click();
  await window.getByTestId("crsSearchInput").locator("input").fill(crsName);
  await window.locator("tr").filter({ hasText: crsName }).locator("input").first().check();
  await window.getByTestId("crsConvertButton").click();
  await waitForActionSettled(window);
  // The Data Manager snackbar outlives the next step: wait for it so screenshots stay stable
  await expect(window.getByText("CRS converted")).toBeHidden({ timeout: WAIT_TIMES.browser });
}

async function startAlignment(window: Page): Promise<void> {
  await window.getByTestId("crsModeAlign").click();
  await window.getByTestId("crsStartAlignButton").click();
  await waitForActionSettled(window);
}

async function fillAlignPoints(
  window: Page,
  prefix: "crsAlignSource" | "crsAlignTarget",
  points: { x: number; y: number }[],
): Promise<void> {
  // Fills share the keyboard focus: they must run one after another
  // oxlint-disable no-await-in-loop
  for (const [index, { x, y }] of points.entries()) {
    const inputs = window.getByTestId(`${prefix}-${index}`).locator("input");
    await inputs.nth(0).fill(String(x));
    await inputs.nth(1).fill(String(y));
  }
  // oxlint-enable no-await-in-loop
}

async function applyAlignment(window: Page, crsName: string): Promise<void> {
  const panel = window.getByTestId("crsAlignPanel");
  await panel.getByTestId("crsSearchInput").locator("input").fill(crsName);
  await panel.locator("tr").filter({ hasText: crsName }).locator("input").first().check();
  await panel.getByTestId("crsAlignApplyButton").click();
  await waitForActionSettled(window);
}

export {
  applyAlignment,
  assignCrs,
  convertCrs,
  expectCurrentCrs,
  expectDataRows,
  fillAlignPoints,
  openCrsByButton,
  startAlignment,
};
