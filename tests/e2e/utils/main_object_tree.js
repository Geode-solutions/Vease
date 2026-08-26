import { afterActionWait, ensureMenuOpen, moveMouseOutOfTheWay } from "./viewer_interaction.js";
import { setModelColor } from "./data/model/color.js";

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

  try {
    await expandBtn.waitFor({ state: "visible", timeout: modalTransitionWait });
    await expandBtn.click();
    await window.waitForTimeout(modalTransitionWait);
  } catch {
    // Fallback: click the group title text to toggle
    await mainObjectTree.getByText(groupName, { exact: true }).click();
    await window.waitForTimeout(modalTransitionWait);
  }
}

async function openFilterMenu(window, treeTestId = "mainObjectTree") {
  await window.getByTestId(treeTestId).getByTestId("filterObjectsButton").click();
  await window
    .locator(".v-overlay-container [data-testid^='filterCheckbox-']")
    .first()
    .waitFor({ state: "attached" });
}

async function checkFilterCategory(window, categoryId) {
  const checkbox = window.getByTestId(`filterCheckbox-${categoryId}`).getByRole("checkbox");
  await checkbox.waitFor({ state: "attached" });
  await checkbox.check();
  await window.waitForTimeout(afterActionWait);
}

async function uncheckFilterCategory(window, categoryId) {
  const checkbox = window.getByTestId(`filterCheckbox-${categoryId}`).getByRole("checkbox");
  await checkbox.waitFor({ state: "attached" });
  await checkbox.uncheck();
  await window.waitForTimeout(afterActionWait);
}

async function toggleSearchObjects(window) {
  await window.getByTestId("searchObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
}



async function fillSearchQuery(window, query) {
  const searchInput = window.getByTestId("searchObjectsInput").locator("input");
  await searchInput.fill(query);
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function highlightData(window, geodeObjectType, dataName) {
  await expandGeodeObjectType(window, geodeObjectType);
  const mainObjectTree = getMainObjectTree(window);
  const testItem = mainObjectTree.getByText(dataName).first();
  await testItem.hover();
  await window.waitForTimeout(afterActionWait);
}

async function getTreeRowByTextAndParent(
  window,
  geodeObjectType,
  dataName,
  treeTestId = "mainObjectTree",
) {
  const tree = typeof treeTestId === "string" ? window.getByTestId(treeTestId).first() : treeTestId;
  const parentRow = tree
    .getByTestId("treeRowWrapper")
    .filter({ hasText: geodeObjectType, hasNot: window.locator(".leaf-row") })
    .first();
  await parentRow.waitFor({ state: "attached" });
  if (!dataName) {
    return parentRow;
  }
  const allRows = tree.getByTestId("treeRowWrapper");
  const childIndex = await allRows.evaluateAll(
    (rows, { type, name }) => {
      const parentIndex = rows.findIndex(
        (row) => row.textContent.includes(type) && !row.classList.contains("leaf-row"),
      );
      if (parentIndex === -1) {
        return -1;
      }
      for (let j = parentIndex + 1; j < rows.length; j += 1) {
        if (rows[j].textContent.includes(name)) {
          return j;
        }
        if (!rows[j].classList.contains("leaf-row")) {
          break;
        }
      }
      return -1;
    },
    { type: geodeObjectType, name: dataName },
  );
  if (childIndex === -1) {
    throw new Error(
      `Could not find child "${dataName}" under parent "${geodeObjectType}" in tree "${treeTestId}"`,
    );
  }
  return allRows.nth(childIndex);
}

async function expandGeodeObjectType(window, geodeObjectType, treeTestId = "mainObjectTree") {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  const treeRow = await getTreeRowByTextAndParent(window, geodeObjectType, undefined, treeTestId);
  const expandButton = treeRow.getByTestId("expandTreeRowButton").first();
  if (await expandButton.isVisible()) {
    await expandButton.click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function collapseGeodeObjectType(window, geodeObjectType, treeTestId = "mainObjectTree") {
  const treeRow = await getTreeRowByTextAndParent(window, geodeObjectType, undefined, treeTestId);
  const collapseButton = treeRow.getByTestId("collapseTreeRowButton").first();
  if (await collapseButton.isVisible()) {
    await collapseButton.click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function hoverModelComponentRow(window, modelComponentType, modelComponentName) {
  const modelComponentRow = await getTreeRowByTextAndParent(
    window,
    modelComponentType,
    modelComponentName,
    "modelComponentsObjectTree",
  );
  await modelComponentRow.hover();
  await window.waitForTimeout(afterActionWait);
}

async function hideObjectInTree(window, parentName, objectName, treeTestId = "mainObjectTree") {
  const row = await getTreeRowByTextAndParent(window, parentName, objectName, treeTestId);
  await row.waitFor({ state: "attached" });
  const btn = row.getByTestId("visibleObjectEyeButton").first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
    await moveMouseOutOfTheWay(window);
    await window.waitForTimeout(afterActionWait);
  }
}

async function focusObjectInTree(window, geodeObjectType, dataName) {
  await expandGeodeObjectType(window, geodeObjectType);
  const row = await getTreeRowByTextAndParent(window, geodeObjectType, dataName);
  await row.locator("button:has(.mdi-target)").click({ force: true });
  await window.waitForTimeout(afterActionWait);
}

async function showObjectInTree(window, objectName) {
  const row = await getTreeRowByTextAndParent(window, objectName);
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

async function openObjectTreeContextMenu(window, objectName, treeTestId = "mainObjectTree") {
  await getTreeRowByTextAndParent(window, objectName, undefined, treeTestId).click({
    button: "right",
  });
  await window.waitForTimeout(afterActionWait);
}

async function toggleModelTreeRow(window, rowName, rowIndex = 0, treeIndex = 0) {
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
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
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
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
}

async function setModelTreeRowColorRandom(window, rowName, rowIndex = 0) {
  await openModelComponentContextMenu(window, rowName, rowIndex);
  await setModelColor(window);
}

async function toggleObjectsTree(window) {
  await window.getByTestId("toggleObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
}

async function openModelComponentsTree(window, geodeObjectType, dataName) {
  await expandGeodeObjectType(window, geodeObjectType, "mainObjectTree");
  const row = await getTreeRowByTextAndParent(window, geodeObjectType, dataName, "mainObjectTree");
  await row.getByTestId("expandModelComponentsButton").first().click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function hideAllComponentLeafRows(window, categoryName) {
  const treeTestId = "modelComponentsObjectTree";
  await expandGeodeObjectType(window, categoryName, treeTestId);
  const tree = window.getByTestId(treeTestId);
  const leafRows = tree.getByTestId("treeRowWrapper").filter({ hasText: "00000000-" });
  const count = await leafRows.count();
  for (let i = 0; i < count; i += 1) {
    const eyeBtn = leafRows.nth(i).getByTestId("visibleObjectEyeButton").first();
    // oxlint-disable no-await-in-loop
    if (await eyeBtn.isVisible()) {
      await eyeBtn.click({ force: true });
      await window.waitForTimeout(afterActionWait);
      // oxlint-enable no-await-in-loop
    }
  }
}

export {
  checkFilterCategory,
  expandMainObjectTree,
  collapseMainObjectTree,
  getMainObjectTree,
  openFilterMenu,
  uncheckFilterCategory,
  toggleSearchObjects,
  fillSearchQuery,
  highlightData,
  getTreeRowByTextAndParent,
  expandGeodeObjectType,
  collapseGeodeObjectType,
  hoverModelComponentRow,
  hideObjectInTree,
  focusObjectInTree,
  showObjectInTree,
  openObjectTreeContextMenu,
  toggleModelTreeRow,
  setModelTreeRowColorRandom,
  openModelComponentContextMenu,
  toggleObjectsTree,
  openModelComponentsTree,
  hideAllComponentLeafRows,
  expandMainObjectTreeGroup,
};
