// Node imports

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";

// Local imports
import {
  expandGeodeObjectTypeInTree,
  getTreeRowByTextAndParent,
} from "#ogw_e2e/object_trees/common.js";
import { closeFeedbackSnackbar } from "#ogw_e2e/app_interaction.js";
import { getDataTableRow } from "./data_manager";
import { getMainObjectTree } from "#ogw_e2e/object_trees/main_object_tree.js";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

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

// The warning icon of the tree opens the crs dialog of the data
async function openCrsFromWarning(
  window: Page,
  geodeObjectType: string,
  dataName: string,
): Promise<void> {
  const row = await getDataTreeRow(window, geodeObjectType, dataName);
  await row.getByTestId("crsMismatchIcon").click();
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

// A georeferenced data opens on convert
async function selectAssignMode(window: Page): Promise<void> {
  await window.getByTestId("crsModeAssign").click();
  await waitForActionSettled(window);
}

// Without closing the feedback: the step checks the dialog or the warning it shows
async function clickAssign(window: Page): Promise<void> {
  await window.getByTestId("crsAssignButton").click();
  await waitForActionSettled(window);
}

// The snackbar leaves after 10s: a slow basemap build (external tile servers) can outlast it while the action settles, so it is watched from before the action
const FEEDBACK_TIMEOUT_MS = 60_000;

async function expectFeedback(
  window: Page,
  text: string,
  action: () => Promise<void>,
): Promise<void> {
  const shown = window
    .getByTestId("feedbackSnackbar")
    .filter({ hasText: text })
    .waitFor({ state: "visible", timeout: FEEDBACK_TIMEOUT_MS });
  await Promise.all([shown, action()]);
  await closeFeedbackSnackbar(window);
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

// "All data" or "This data only", in the crs dialog (crsScope) or the georeference drawer (crsAlignScope)
async function selectScope(
  window: Page,
  scope: "all" | "one",
  testId: "crsScope" | "crsAlignScope" = "crsScope",
): Promise<void> {
  await window.getByTestId(`${testId}-${scope}`).locator("input").check();
  await waitForActionSettled(window);
}

async function expectCrsMismatch(
  window: Page,
  geodeObjectType: string,
  dataName: string,
  expected: boolean,
): Promise<void> {
  const row = await getDataTreeRow(window, geodeObjectType, dataName);
  const icon = row.getByTestId("crsMismatchIcon");
  if (expected) {
    await expect(icon).toBeVisible();
  } else {
    await expect(icon).toBeHidden();
  }
}

async function openProjectCrs(window: Page): Promise<void> {
  await window.getByTestId("projectCrs").click();
  await waitForActionSettled(window);
}

async function confirmProjectCrs(window: Page): Promise<void> {
  await window.getByTestId("projectCrsApply").click();
  await waitForActionSettled(window);
  await closeFeedbackSnackbar(window);
}

async function applyAlignment(window: Page): Promise<void> {
  await window.getByTestId("crsAlignApplyButton").click();
  await waitForActionSettled(window);
  await closeFeedbackSnackbar(window);
}

export {
  applyAlignment,
  clickAssign,
  confirmAssign,
  confirmConvert,
  confirmProjectCrs,
  expectCrsMismatch,
  expectCurrentCrs,
  expectDataRows,
  expectFeedback,
  expectRowCrs,
  fillAlignPoints,
  openCrsByButton,
  openCrsFromFeedback,
  openCrsFromInfoCard,
  openCrsFromTree,
  openCrsFromWarning,
  openProjectCrs,
  selectAlignmentCrs,
  selectConvertMode,
  selectCrs,
  selectScope,
  selectAssignMode,
  startAlignment,
};
