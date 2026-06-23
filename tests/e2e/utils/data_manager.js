// Node imports

// Third party imports

// Local imports
import { afterActionWait } from "./viewer_interaction";

async function navigateToDataManager(window) {
  await window.getByTestId("dataManagerNavButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function openDataManagerPiP(window) {
  await window.getByTestId("dataManagerPiPButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function expandDataManagerPiP(window) {
  await window.getByTestId("dataManagerPiPExpandButton").click();
  await window.waitForTimeout(afterActionWait);
}

function getDataTableRow(window, itemName) {
  return window.locator("tr").filter({ hasText: itemName }).first();
}

async function toggleRowVisibility(window, itemName) {
  await getDataTableRow(window, itemName).getByTestId("visibilityButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function focusRowItem(window, itemName) {
  await getDataTableRow(window, itemName).getByTestId("focusButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function isolateRowItem(window, itemName) {
  await getDataTableRow(window, itemName).getByTestId("isolateButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function openRenameByName(window, itemName) {
  await getDataTableRow(window, itemName).getByTestId("itemName").click();
  await window.waitForTimeout(afterActionWait);
}

async function openRenameByButton(window, itemName) {
  await getDataTableRow(window, itemName).getByTestId("renameButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function confirmRename(window, newName) {
  const input = window.getByTestId("renameInput").locator("input");
  await input.clear();
  await input.fill(newName);
  await window.getByTestId("renameConfirmButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function clickDeleteButton(window, itemName) {
  await getDataTableRow(window, itemName).getByTestId("deleteButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function confirmDelete(window) {
  await window.getByTestId("deleteConfirmButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function expandObjectTree(window) {
  await window.getByTestId("mainObjectTree").locator("button:has(.mdi-expand-all-outline)").click();
  await window.waitForTimeout(afterActionWait);
}

export {
  clickDeleteButton,
  confirmDelete,
  confirmRename,
  expandDataManagerPiP,
  expandObjectTree,
  focusRowItem,
  getDataTableRow,
  isolateRowItem,
  navigateToDataManager,
  openDataManagerPiP,
  openRenameByButton,
  openRenameByName,
  toggleRowVisibility,
};
