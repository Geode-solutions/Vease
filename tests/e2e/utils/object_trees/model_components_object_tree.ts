import type { Locator, Page } from "@playwright/test";
import {
  clickCollapseOrExpandAll,
  collapseGeodeObjectTypeInTree,
  collapseTreeGroup,
  expandGeodeObjectTypeInTree,
  getTreeRowByTextAndParent,
} from "./common";
import { closeAllMenus, moveMouseOutOfTheWay } from "@tests/utils/app_interaction";
import {
  ensureMenuOpen,
  resetMenuScroll,
  waitForActionSettled,
} from "@tests/utils/viewer_interaction";
import { expandGeodeObjectType, getMainObjectTree } from "./main_object_tree";
import { setModelColor } from "@tests/utils/data/model/color";

function getModelComponentsObjectTree(window: Page): Locator {
  return window.getByTestId("modelComponentsObjectTree");
}

async function collapseModelComponentsObjectTree(window: Page): Promise<void> {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await clickCollapseOrExpandAll(window, modelComponentsObjectTree, "mdi-collapse-all-outline");
}
async function expandModelComponentsObjectTree(window: Page): Promise<void> {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await clickCollapseOrExpandAll(window, modelComponentsObjectTree, "mdi-expand-all-outline");
}

async function collapseModelComponentsObjectTreeGroup(
  window: Page,
  groupName: string,
): Promise<void> {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  await collapseTreeGroup(window, modelComponentsObjectTree, groupName);
}

const MODEL_COMPONENT_TYPES = ["Corners", "Lines", "Surfaces", "Blocks"];

async function collapseModelComponentTypes(window: Page): Promise<void> {
  for (const componentType of MODEL_COMPONENT_TYPES) {
    // oxlint-disable-next-line no-await-in-loop
    await collapseModelComponentsObjectTreeGroup(window, componentType);
  }
}

async function expandMeshComponentType(window: Page, componentType: string): Promise<void> {
  await expandGeodeObjectTypeInTree(window, componentType, getModelComponentsObjectTree(window));
}

async function collapseMeshComponentType(window: Page, componentType: string): Promise<void> {
  await collapseGeodeObjectTypeInTree(window, componentType, getModelComponentsObjectTree(window));
}

async function hoverModelComponentRow(
  window: Page,
  modelComponentType: string,
  modelComponentName: string | undefined,
): Promise<void> {
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const modelComponentRow = await getTreeRowByTextAndParent(
    window,
    modelComponentType,
    modelComponentName,
    modelComponentsObjectTree,
  );
  await modelComponentRow.hover();
  await waitForActionSettled(window);
}

async function hoverCorners(window: Page, modelComponentName?: string): Promise<void> {
  await hoverModelComponentRow(window, "Corners", modelComponentName);
}

async function hoverLines(window: Page, modelComponentName?: string): Promise<void> {
  await hoverModelComponentRow(window, "Lines", modelComponentName);
}

async function hoverSurfaces(window: Page, modelComponentName?: string): Promise<void> {
  await hoverModelComponentRow(window, "Surfaces", modelComponentName);
}

async function hoverModelBlock(window: Page, modelComponentName?: string): Promise<void> {
  await hoverModelComponentRow(window, "Blocks", modelComponentName);
}

async function toggleModelTreeRow(
  window: Page,
  rowName: string,
  rowIndex = 0,
  treeIndex = 0,
): Promise<void> {
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
  await waitForActionSettled(window);
}

async function openModelComponentContextMenu(
  window: Page,
  rowName: string,
  rowIndex = 0,
  treeIndex = 0,
): Promise<void> {
  await closeAllMenus(window);
  const modelComponentsObjectTree = getModelComponentsObjectTree(window);
  const row = modelComponentsObjectTree
    .nth(treeIndex)
    .getByTestId("treeRowWrapper")
    .filter({ hasText: rowName })
    .nth(rowIndex);
  const label = row.locator(".tree-item-label").first();
  await label.click({ button: "right", force: true });
  await waitForActionSettled(window);
  await ensureMenuOpen(window, "modelStyleMenu");
  await resetMenuScroll(window, 0);
}

async function setModelTreeRowColorRandom(
  window: Page,
  rowName: string,
  rowIndex = 0,
): Promise<void> {
  await openModelComponentContextMenu(window, rowName, rowIndex);
  await setModelColor(window);
}

async function openModelComponentsTree(
  window: Page,
  geodeObjectType: string,
  dataName: string,
): Promise<void> {
  await expandGeodeObjectType(window, geodeObjectType);
  const mainObjectTree = getMainObjectTree(window);
  const row = await getTreeRowByTextAndParent(window, geodeObjectType, dataName, mainObjectTree);
  await row.getByTestId("expandModelComponentsButton").first().click();
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

async function hideAllComponentLeafRows(window: Page, categoryName: string): Promise<void> {
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
  await waitForActionSettled(window);
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
