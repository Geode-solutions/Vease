// Node imports

// Third party imports
import type { Locator, Page } from "@playwright/test";

// Local imports
import { getMainObjectTree } from "./object_trees/main_object_tree";
import { waitForActionSettled } from "./viewer_interaction";

async function openDataManagerPiP(window: Page): Promise<void> {
  await window.getByTestId("dataManagerPiPButton").click();
  await waitForActionSettled(window);
}

async function expandDataManagerPiP(window: Page): Promise<void> {
  await window.getByTestId("dataManagerPiPExpandButton").click();
  await waitForActionSettled(window);
}

function getDataTableRow(window: Page, itemName: string): Locator {
  return window.locator("tr").filter({ hasText: itemName }).first();
}

async function toggleRowVisibility(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName)
    .getByTestId("dataVisibilityButton")
    .click({ force: true });
  await waitForActionSettled(window);
}

async function focusRowItem(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("focusDataButton").click({ force: true });
  await waitForActionSettled(window);
}

async function isolateRowItem(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("isolateDataButton").click({ force: true });
  await waitForActionSettled(window);
}

async function openRenameByName(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("itemName").click();
  await waitForActionSettled(window);
}

async function openRenameByButton(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("renameDataButton").click({ force: true });
  await waitForActionSettled(window);
}

async function confirmRename(window: Page, newName: string): Promise<void> {
  const input = window.getByTestId("renameDataInput").locator("input");
  await input.clear();
  await input.fill(newName);
  await window.getByTestId("renameDataConfirmButton").click();
  await waitForActionSettled(window);
}

async function clickdeleteDataButton(window: Page, itemName: string): Promise<void> {
  await getDataTableRow(window, itemName).getByTestId("deleteDataButton").click({ force: true });
  await waitForActionSettled(window);
}

async function confirmDelete(window: Page): Promise<void> {
  await window.getByTestId("deleteConfirmButton").click();
  await waitForActionSettled(window);
}

async function expandObjectTree(window: Page): Promise<void> {
  const mainObjectTree = getMainObjectTree(window);
  await mainObjectTree.locator("button:has(.mdi-expand-all-outline)").click();
  await waitForActionSettled(window);
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
