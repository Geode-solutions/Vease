import type { Locator, Page } from "@playwright/test";
import {
  clickCollapseOrExpandAll,
  collapseGeodeObjectTypeInTree,
  collapseTreeGroup,
  expandGeodeObjectTypeInTree,
  getTreeRowByTextAndParent,
} from "./common";
import { waitForActionSettled } from "@vease_tests/utils/viewer_interaction";

function getMainObjectTree(window: Page): Locator {
  return window.getByTestId("mainObjectTree");
}

async function collapseMainObjectTree(window: Page): Promise<void> {
  const mainObjectTree = getMainObjectTree(window);
  await clickCollapseOrExpandAll(window, mainObjectTree, "mdi-collapse-all-outline");
}
async function expandMainObjectTree(window: Page): Promise<void> {
  const mainObjectTree = getMainObjectTree(window);
  await clickCollapseOrExpandAll(window, mainObjectTree, "mdi-expand-all-outline");
}

async function collapseMainObjectTreeGroup(window: Page, groupName: string): Promise<void> {
  const mainObjectTree = getMainObjectTree(window);
  await collapseTreeGroup(window, mainObjectTree, groupName);
}

async function expandGeodeObjectType(window: Page, geodeObjectType: string): Promise<void> {
  await expandGeodeObjectTypeInTree(window, geodeObjectType, getMainObjectTree(window));
}

async function collapseGeodeObjectType(window: Page, geodeObjectType: string): Promise<void> {
  await collapseGeodeObjectTypeInTree(window, geodeObjectType, getMainObjectTree(window));
}

async function highlightData(
  window: Page,
  geodeObjectType: string,
  dataName: string,
): Promise<void> {
  await expandGeodeObjectType(window, geodeObjectType);
  const mainObjectTree = getMainObjectTree(window);
  const row = await getTreeRowByTextAndParent(window, geodeObjectType, dataName, mainObjectTree);
  await row.getByTestId("treeItemLabel").hover();
  await window
    .getByTestId("tooltipIdValue")
    .filter({ hasNotText: geodeObjectType })
    .waitFor({ state: "visible" });
  await waitForActionSettled(window);
}

async function focusObjectInTree(
  window: Page,
  geodeObjectType: string,
  dataName: string,
): Promise<void> {
  await expandGeodeObjectType(window, geodeObjectType);
  const mainObjectTree = getMainObjectTree(window);
  const row = await getTreeRowByTextAndParent(window, geodeObjectType, dataName, mainObjectTree);
  await row.locator("button:has(.mdi-target)").click({ force: true });
  await waitForActionSettled(window);
}

async function showObjectInTree(window: Page, objectName: string): Promise<void> {
  const mainObjectTree = getMainObjectTree(window);
  const row = await getTreeRowByTextAndParent(window, objectName, undefined, mainObjectTree);
  await row.waitFor({ state: "attached" });
  const btn = row
    .getByTestId("hiddenObjectEyeButton")
    .or(row.getByTestId("indeterminateObjectEyeButton"))
    .first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
    await waitForActionSettled(window);
  }
}

async function toggleObjectsTree(window: Page): Promise<void> {
  await window.getByTestId("toggleObjectsButton").click();
  await waitForActionSettled(window);
}

async function closeObjectsTree(window: Page): Promise<void> {
  const isVisible = await window
    .getByTestId("mainObjectTree")
    .isVisible()
    .catch(() => false);
  if (isVisible) {
    await window.getByTestId("toggleObjectsButton").click();
    await waitForActionSettled(window);
  }
}

async function openObjectsTree(window: Page): Promise<void> {
  const isVisible = await window
    .getByTestId("mainObjectTree")
    .isVisible()
    .catch(() => false);
  if (!isVisible) {
    await window.getByTestId("toggleObjectsButton").click();
    await waitForActionSettled(window);
  }
}

export {
  closeObjectsTree,
  collapseGeodeObjectType,
  collapseMainObjectTree,
  collapseMainObjectTreeGroup,
  expandGeodeObjectType,
  expandMainObjectTree,
  focusObjectInTree,
  getMainObjectTree,
  highlightData,
  openObjectsTree,
  showObjectInTree,
  toggleObjectsTree,
};
