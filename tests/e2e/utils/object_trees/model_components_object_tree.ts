import { afterActionWait, ensureMenuOpen, resetMenuScroll } from "@tests/utils/viewer_interaction";
import {
  clickCollapseOrExpandAll,
  collapseGeodeObjectTypeInTree,
  collapseTreeGroup,
  expandGeodeObjectTypeInTree,
  getTreeRowByTextAndParent,
} from "./common";
import { closeAllMenus, moveMouseOutOfTheWay } from "@tests/utils/app_interaction";
import { expandGeodeObjectType, getMainObjectTree } from "./main_object_tree";
import { setModelColor } from "@tests/utils/data/model/color";

function getModelComponentsObjectTree(window) {
  return window.getByTestId("modelComponentsObjectTree");
}

function collapseModelComponentsObjectTree(window) {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  return clickCollapseOrExpandAll(window, modelComponentsObjectTree, "mdi-collapse-all-outline");
}
function expandModelComponentsObjectTree(window) {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  return clickCollapseOrExpandAll(window, modelComponentsObjectTree, "mdi-expand-all-outline");
}

function collapseModelComponentsObjectTreeGroup(window, groupName) {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  return collapseTreeGroup(window, modelComponentsObjectTree, groupName);
}

const MODEL_COMPONENT_TYPES = ["Corners", "Lines", "Surfaces", "Blocks"];

async function collapseModelComponentTypes(window) {
  for (const componentType of MODEL_COMPONENT_TYPES) {
    // oxlint-disable-next-line no-await-in-loop
    await collapseModelComponentsObjectTreeGroup(window, componentType);
  }
}

function expandMeshComponentType(window, componentType) {
  return expandGeodeObjectTypeInTree(window, componentType, getModelComponentsObjectTree(window));
}

function collapseMeshComponentType(window, componentType) {
  return collapseGeodeObjectTypeInTree(window, componentType, getModelComponentsObjectTree(window));
}

async function hoverModelComponentRow(window, modelComponentType, modelComponentName) {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const modelComponentRow = await getTreeRowByTextAndParent(
    window,
    modelComponentType,
    modelComponentName,
    modelComponentsObjectTree,
  );
  await modelComponentRow.hover();
  await window.waitForTimeout(afterActionWait);
}

function hoverCorners(window, modelComponentName = undefined) {
  return hoverModelComponentRow(window, "Corners", modelComponentName);
}

function hoverLines(window, modelComponentName = undefined) {
  return hoverModelComponentRow(window, "Lines", modelComponentName);
}

function hoverSurfaces(window, modelComponentName = undefined) {
  return hoverModelComponentRow(window, "Surfaces", modelComponentName);
}

function hoverModelBlock(window, modelComponentName = undefined) {
  return hoverModelComponentRow(window, "Blocks", modelComponentName);
}

async function toggleModelTreeRow(window, rowName, rowIndex = 0, treeIndex = 0) {
  await closeAllMenus(window);
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const row = modelComponentsObjectTree
    .nth(treeIndex)
    .getByTestId("treeRowWrapper")
    .filter({ hasText: rowName })
    .nth(rowIndex);
  const btn = row
    .getByTestId("visibleObjectEyeButton")
    .or(row.getByTestId("hiddenObjectEyeButton"))
    .first();
  await btn.click();
  await window.waitForTimeout(afterActionWait);
}

async function openModelComponentContextMenu(window, rowName, rowIndex = 0, treeIndex = 0) {
  await closeAllMenus(window);
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const row = modelComponentsObjectTree
    .nth(treeIndex)
    .getByTestId("treeRowWrapper")
    .filter({ hasText: rowName })
    .nth(rowIndex);
  const label = row.locator(".tree-item-label").first();
  await label.click({ button: "right", force: true });
  await window.waitForTimeout(afterActionWait);
  await ensureMenuOpen(window, "modelStyleMenu");
  await resetMenuScroll(window, 0);
}

async function setModelTreeRowColorRandom(window, rowName, rowIndex = 0) {
  await openModelComponentContextMenu(window, rowName, rowIndex);
  await setModelColor(window);
}

async function openModelComponentsTree(window, geodeObjectType, dataName) {
  await expandGeodeObjectType(window, geodeObjectType);
  const mainObjectTree = getMainObjectTree(window);
  const row = await getTreeRowByTextAndParent(window, geodeObjectType, dataName, mainObjectTree);
  await row.getByTestId("expandModelComponentsButton").first().click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function hideAllComponentLeafRows(window, categoryName) {
  const tree = getModelComponentsObjectTree(window);
  await expandGeodeObjectTypeInTree(window, categoryName, tree);
  const leafRows = tree.getByTestId("treeRowWrapper").filter({ hasText: "00000000-" });
  const count = await leafRows.count();
  for (let i = 0; i < count; i += 1) {
    const eyeBtn = leafRows.nth(i).getByTestId("visibleObjectEyeButton").first();
    // oxlint-disable no-await-in-loop
    if (await eyeBtn.isVisible()) {
      await eyeBtn.click({ force: true });
    }
  }
  await window.waitForTimeout(afterActionWait);
}

export {
  collapseMeshComponentType,
  collapseModelComponentsObjectTree,
  collapseModelComponentsObjectTreeGroup,
  collapseModelComponentTypes,
  expandMeshComponentType,
  expandModelComponentsObjectTree,
  getModelComponentsObjectTree,
  hideAllComponentLeafRows,
  hoverCorners,
  hoverLines,
  hoverModelBlock,
  hoverSurfaces,
  openModelComponentContextMenu,
  openModelComponentsTree,
  setModelTreeRowColorRandom,
  toggleModelTreeRow,
};
