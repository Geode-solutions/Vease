// Node imports

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";

// Local imports
import { expandGeodeObjectTypeInTree, getTreeRowByTextAndParent } from "./object_trees/common";
import { closeFeedbackSnackbar } from "./app_interaction";
import { getDataTableRow } from "./data_manager";
import { getMainObjectTree } from "./object_trees/main_object_tree";
import { waitForActionSettled } from "./wait_for_action_settled";

async function expectDataRows(window: Page, itemNames: string[]): Promise<void> {
  // oxlint-disable no-await-in-loop
  for (const itemName of itemNames) {
    await expect(getDataTableRow(window, itemName)).toBeVisible();
  }
  // oxlint-enable no-await-in-loop
}

async function openCrsByButton(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("crsCell").click();
  await waitForActionSettled(window);
}

async function expectRowCrs(window: Page, itemName: string, expected: string): Promise<void> {
  await expect(getDataTableRow(window, itemName).getByTestId("crsCell")).toContainText(expected);
}

async function getDataTreeRow(
  window: Page,
  geodeObjectType: string,
  dataName: string,
): Promise<Locator> {
  const tree = getMainObjectTree(window);
  await expandGeodeObjectTypeInTree(window, geodeObjectType, tree);
  return getTreeRowByTextAndParent(window, geodeObjectType, dataName, tree);
}

async function openCrsFromTree(
  window: Page,
  geodeObjectType: string,
  dataName: string,
): Promise<void> {
  const row = await getDataTreeRow(window, geodeObjectType, dataName);
  await row.getByTestId("treeItemLabel").first().hover();
  await waitForActionSettled(window);
  const editButton = window.locator(".v-overlay--active").getByTestId("editCrsBtn");
  await editButton.hover();
  await editButton.click();
  await waitForActionSettled(window);
}

async function openCrsFromInfoCard(
  window: Page,
  geodeObjectType: string,
  dataName: string,
): Promise<void> {
  const row = await getDataTreeRow(window, geodeObjectType, dataName);
  await row.click({ button: "right" });
  await waitForActionSettled(window);
  await window.getByTestId("circularMenuCenterButton").click();
  await window.getByTestId("infoEditCrsBtn").click();
  await waitForActionSettled(window);
}

async function openCrsFromFeedback(window: Page, text: string): Promise<void> {
  const snackbar = window.getByTestId("feedbackSnackbar").filter({ hasText: text });
  await expect(snackbar).toBeVisible();
  await snackbar.getByTestId("feedbackActionBtn").click();
  await waitForActionSettled(window);
}

// Selecting is its own step so the dialog state is captured before the action
async function selectCrs(window: Page, crsName: string): Promise<void> {
  await window.getByTestId("crsSearchInput").locator("input").fill(crsName);
  await window.locator("tr").filter({ hasText: crsName }).locator("input").first().check();
  await waitForActionSettled(window);
}

async function confirmAssign(window: Page): Promise<void> {
  await window.getByTestId("crsAssignButton").click();
  await waitForActionSettled(window);
  // The global feedback snackbar outlives the next step: close it so screenshots stay stable
  await closeFeedbackSnackbar(window);
}

async function expectCurrentCrs(window: Page, expected: string): Promise<void> {
  await expect(window.getByTestId("crsCurrentValue")).toContainText(expected);
}

async function selectConvertMode(window: Page): Promise<void> {
  await window.getByTestId("crsModeConvert").click();
  await waitForActionSettled(window);
}

async function confirmConvert(window: Page): Promise<void> {
  await window.getByTestId("crsConvertButton").click();
  await waitForActionSettled(window);
  await closeFeedbackSnackbar(window);
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

async function selectAlignmentCrs(window: Page, crsName: string): Promise<void> {
  const panel = window.getByTestId("crsAlignPanel");
  await panel.getByTestId("crsSearchInput").locator("input").fill(crsName);
  await panel.locator("tr").filter({ hasText: crsName }).locator("input").first().check();
  await waitForActionSettled(window);
}

async function applyAlignment(window: Page): Promise<void> {
  await window.getByTestId("crsAlignApplyButton").click();
  await waitForActionSettled(window);
  await closeFeedbackSnackbar(window);
}

export {
  applyAlignment,
  confirmAssign,
  confirmConvert,
  expectCurrentCrs,
  expectDataRows,
  expectRowCrs,
  fillAlignPoints,
  openCrsByButton,
  openCrsFromFeedback,
  openCrsFromInfoCard,
  openCrsFromTree,
  selectAlignmentCrs,
  selectConvertMode,
  selectCrs,
  startAlignment,
};
