// Node imports

// Third party imports
import type { Locator, Page } from "@playwright/test";

// Local imports
import { afterActionWait } from "./viewer_interaction";
import { getMainObjectTree } from "./object_trees/main_object_tree";

async function openDataManagerPiP(window: Page): Promise<void> {
  await window.getByTestId("dataManagerPiPButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function expandDataManagerPiP(window: Page): Promise<void> {
  await window.getByTestId("dataManagerPiPExpandButton").click();
  await window.waitForTimeout(afterActionWait);
}

function getDataTableRow(window: Page, itemName: string): Locator {
  return window.locator("tr").filter({ hasText: itemName }).first();
}

async function toggleRowVisibility(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName)
    .getByTestId("dataVisibilityButton")
    .click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function focusRowItem(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("focusDataButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function isolateRowItem(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("isolateDataButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function openRenameByName(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("itemName").click();
  await window.waitForTimeout(afterActionWait);
}

async function openRenameByButton(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("renameDataButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function confirmRename(window: Page, newName: string): Promise<void> {
  const input = window.getByTestId("renameDataInput").locator("input");
  await input.clear();
  await input.fill(newName);
  await window.getByTestId("renameDataConfirmButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function clickdeleteDataButton(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("deleteDataButton").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function confirmDelete(window: Page): Promise<void> {
  await window.getByTestId("deleteConfirmButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function expandObjectTree(window: Page): Promise<void> {
  const mainObjectTree = getMainObjectTree(window);
  await mainObjectTree.locator("button:has(.mdi-expand-all-outline)").click();
  await window.waitForTimeout(afterActionWait);
}

export {
  clickdeleteDataButton,
  confirmDelete,
  confirmRename,
  expandDataManagerPiP,
  expandObjectTree,
  focusRowItem,
  getDataTableRow,
  isolateRowItem,
  openDataManagerPiP,
  openRenameByButton,
  openRenameByName,
  toggleRowVisibility,
};
