import {
  clickCollapseOrExpandAll,
  collapseGeodeObjectTypeInTree,
  collapseTreeGroup,
  expandGeodeObjectTypeInTree,
  getTreeRowByTextAndParent,
} from "./common";
import { afterActionWait } from "@tests/utils/viewer_interaction";
import { modalTransitionWait } from "@tests/utils/constants";

function getMainObjectTree(window) {
  return window.getByTestId("mainObjectTree");
}

function collapseMainObjectTree(window) {
  const mainObjectTree = getMainObjectTree(window);
  return clickCollapseOrExpandAll(window, mainObjectTree, "mdi-collapse-all-outline");
}
function expandMainObjectTree(window) {
  const mainObjectTree = getMainObjectTree(window);
  return clickCollapseOrExpandAll(window, mainObjectTree, "mdi-expand-all-outline");
}

async function expandMainObjectTreeGroup(window, groupName) {
  const mainObjectTree = getMainObjectTree(window);
  const expandBtn = mainObjectTree
    .locator(".tree-item-group, .v-treeview-item, [class*='group']")
    .filter({ hasText: groupName })
    .first()
    .locator("button:has(.mdi-chevron-right)");

  if (await expandBtn.isVisible()) {
    await expandBtn.click();
    await window.waitForTimeout(modalTransitionWait);
  }
}

function collapseMainObjectTreeGroup(window, groupName) {
  const mainObjectTree = getMainObjectTree(window);
  return collapseTreeGroup(window, mainObjectTree, groupName);
}

function expandGeodeObjectType(window, geodeObjectType) {
  return expandGeodeObjectTypeInTree(window, geodeObjectType, getMainObjectTree(window));
}

function collapseGeodeObjectType(window, geodeObjectType) {
  return collapseGeodeObjectTypeInTree(window, geodeObjectType, getMainObjectTree(window));
}

async function highlightData(window, geodeObjectType, dataName) {
  await expandGeodeObjectType(window, geodeObjectType);
  const mainObjectTree = getMainObjectTree(window);
  const row = await getTreeRowByTextAndParent(window, geodeObjectType, dataName, mainObjectTree);
  await row.getByTestId("treeItemLabel").hover();
  await window
    .getByTestId("tooltipIdValue")
    .filter({ hasNotText: geodeObjectType })
    .waitFor({ state: "visible" });
  await window.waitForTimeout(afterActionWait);
}

async function focusObjectInTree(window, geodeObjectType, dataName) {
  await expandGeodeObjectType(window, geodeObjectType);
  const mainObjectTree = getMainObjectTree(window);
  const row = await getTreeRowByTextAndParent(window, geodeObjectType, dataName, mainObjectTree);
  await row.locator("button:has(.mdi-target)").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function showObjectInTree(window, objectName) {
  const mainObjectTree = getMainObjectTree(window);
  const row = await getTreeRowByTextAndParent(window, objectName, undefined, mainObjectTree);
  await row.waitFor({ state: "attached" });
  const btn = row
    .getByTestId("hiddenObjectEyeButton")
    .or(row.getByTestId("indeterminateObjectEyeButton"))
    .first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
    await window.waitForTimeout(afterActionWait);
  }
}

async function toggleObjectsTree(window) {
  await window.getByTestId("toggleObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function closeObjectsTree(window) {
  const isVisible = await window
    .getByTestId("mainObjectTree")
    .isVisible()
    .catch(() => false);
  if (isVisible) {
    await window.getByTestId("toggleObjectsButton").click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function openObjectsTree(window) {
  const isVisible = await window
    .getByTestId("mainObjectTree")
    .isVisible()
    .catch(() => false);
  if (!isVisible) {
    await window.getByTestId("toggleObjectsButton").click();
    await window.waitForTimeout(afterActionWait);
  }
}

export {
  closeObjectsTree,
  collapseGeodeObjectType,
  collapseMainObjectTree,
  collapseMainObjectTreeGroup,
  expandGeodeObjectType,
  expandMainObjectTree,
  expandMainObjectTreeGroup,
  focusObjectInTree,
  getMainObjectTree,
  highlightData,
  openObjectsTree,
  showObjectInTree,
  toggleObjectsTree,
};
