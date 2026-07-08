import { afterActionWait } from "./viewer_interaction.js";
import { setModelColor } from "./model/color.js";

async function clickCollapseOrExpandAll(window, treeTestId, expectedIcon) {
  const btn = window.getByTestId(treeTestId).getByTestId("CollapseOrExpandAll");
  const targetIcon = btn.locator(`.${expectedIcon}`);
  if (await targetIcon.isVisible()) {
    await btn.click({ force: true });
    await window.waitForTimeout(afterActionWait);
  }
}

async function expandAllObjects(window, treeTestId = "mainObjectTree") {
  await clickCollapseOrExpandAll(window, treeTestId, "mdi-expand-all-outline");
}

async function collapseAllObjects(window, treeTestId = "mainObjectTree") {
  await clickCollapseOrExpandAll(window, treeTestId, "mdi-collapse-all-outline");
}

async function toggleSortObjects(window) {
  await window.getByTestId("sortObjectsButton").click();
  await window.waitForTimeout(afterActionWait);
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
  await window.waitForTimeout(afterActionWait);
}

async function expandMainObjectTree(window) {
  await expandAllObjects(window, "mainObjectTree");
}

async function highlightData(window, geodeObjectType, dataName) {
  await expandGeodeObjectType(window, geodeObjectType);
  const mainObjectTree = window.getByTestId("mainObjectTree");
  const testItem = mainObjectTree.getByText(dataName).first();
  await testItem.hover();
  await window.waitForTimeout(afterActionWait);
}

async function getTreeRowByTextAndParent(
  window,
  geodeObjectType,
  dataName = undefined,
  treeTestId = "mainObjectTree",
) {
  const tree = window.getByTestId(treeTestId);
  const allRows = tree.locator(".tree-row-wrapper");
  const count = await allRows.count();

  for (let i = 0; i < count; i += 1) {
    const row = allRows.nth(i);

    //oxlint-disable-next-line no-await-in-loop
    const rowText = await row.textContent();

    //oxlint-disable-next-line no-await-in-loop
    if (
      rowText.includes(geodeObjectType) &&
      //oxlint-disable-next-line no-await-in-loop
      !(await row.evaluate((element) => element.classList.contains("leaf-row")))
    ) {
      if (!dataName) {
        console.log("getTreeRowByTextAndParent", { row });
        return row;
      }
      for (let j = i + 1; j < count; j += 1) {
        const childRow = allRows.nth(j);
        //oxlint-disable-next-line no-await-in-loop
        const isLeaf = await childRow.evaluate((element) => element.classList.contains("leaf-row"));
        if (!isLeaf) {
          break;
        }
        //oxlint-disable-next-line no-await-in-loop
        const childRowText = await childRow.textContent();
        if (childRowText.includes(dataName)) {
          console.log("getTreeRowByTextAndParent", { childRow });
          return childRow;
        }
      }
    }
  }

  throw new Error(
    `Could not find child "${dataName}" under parent "${geodeObjectType}" in tree "${treeTestId}"`,
  );
}

async function expandGeodeObjectType(window, geodeObjectType) {
  const treeRow = await getTreeRowByTextAndParent(window, geodeObjectType);
  const rightChevron = treeRow.locator(".mdi-menu-right").first();
  if ((await rightChevron.count()) > 0) {
    await rightChevron.dispatchEvent("click");
  }
}

async function hoverModelComponentRow(window, modelComponentType, modelComponentName = undefined) {
  const modelComponentRow = await getTreeRowByTextAndParent(
    window,
    modelComponentType,
    modelComponentName,
    "modelComponentsObjectTree",
  );
  await modelComponentRow.hover();
  await window.waitForTimeout(afterActionWait);
}

async function hideObjectInTree(
  window,
  parentName,
  objectName = undefined,
  treeTestId = "mainObjectTree",
) {
  const row = await getTreeRowByTextAndParent(window, parentName, objectName, treeTestId);

  await row.waitFor({ state: "attached" });
  const btn = row.locator("button:has(.mdi-eye)").first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
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
  const btn = row.locator("button:has(.mdi-eye-off-outline, .mdi-eye-minus-outline)").first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
    await window.waitForTimeout(afterActionWait);
  }
}

async function openObjectTreeContextMenu(window, objectName, treeTestId = "mainObjectTree") {
  await getTreeRowByTextAndParent(window, treeTestId, objectName).click({
    button: "right",
  });
  await window.waitForTimeout(afterActionWait);
}

async function toggleModelTreeRow(window, rowName) {
  // Close any open menus
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);

  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: rowName })
    .first();
  await row.locator("button:has([class*='mdi-eye'])").first().click();
  await window.waitForTimeout(afterActionWait);
}

async function setModelTreeRowColorRandom(window, rowName) {
  // Close any open menus
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);
  await window.keyboard.press("Escape");
  await window.waitForTimeout(afterActionWait);

  const modelComponentsObjectTree = window.getByTestId("modelComponentsObjectTree");
  const row = modelComponentsObjectTree
    .locator(".tree-row-wrapper")
    .filter({ hasText: rowName })
    .first();
  const label = row.locator(".tree-item-label").first();
  await label.click({ button: "right", force: true });
  await window.waitForTimeout(afterActionWait);

  await setModelColor(window);
}

export {
  expandAllObjects,
  collapseAllObjects,
  toggleSortObjects,
  openFilterMenu,
  checkFilterCategory,
  uncheckFilterCategory,
  toggleSearchObjects,
  fillSearchQuery,
  expandMainObjectTree,
  highlightData,
  getTreeRowByTextAndParent,
  expandGeodeObjectType,
  hoverModelComponentRow,
  hideObjectInTree,
  focusObjectInTree,
  showObjectInTree,
  openObjectTreeContextMenu,
  toggleModelTreeRow,
  setModelTreeRowColorRandom,
};
