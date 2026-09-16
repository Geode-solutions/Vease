import { closeAllMenus, moveMouseOutOfTheWay } from "@tests/utils/app_interaction";
import { afterActionWait } from "@tests/utils/viewer_interaction";
import { modalTransitionWait } from "@tests/utils/constants";

async function clickCollapseOrExpandAll(window, tree, expectedIcon) {
  const btn = tree.getByTestId("CollapseOrExpandAll");
  const targetIcon = btn.locator(`.${expectedIcon}`);
  if (await targetIcon.isVisible()) {
    await btn.click();
    await moveMouseOutOfTheWay(window);
    await window.waitForTimeout(afterActionWait);
  }
}

async function collapseTreeGroup(window, tree, groupName) {
  const groupRow = tree.getByTestId("treeRowWrapper").filter({ hasText: groupName }).first();
  const collapseBtn = groupRow.getByTestId("collapseTreeRowButton");

  try {
    await collapseBtn.waitFor({ state: "visible", timeout: modalTransitionWait });
    await collapseBtn.click();
    await window.waitForTimeout(modalTransitionWait);
  } catch {
    // Fallback: click the group row to toggle
    await groupRow.click();
    await window.waitForTimeout(modalTransitionWait);
  }
}

async function toggleSortObjects(window) {
  await window.getByTestId("sortObjectsButton").click();
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function openFilterMenu(window, tree) {
  await tree.getByTestId("filterObjectsButton").click();
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

async function fillSearchQuery(window, query, tree) {
  const searchInput = tree.getByTestId("searchObjectsInput").locator("input");
  await searchInput.fill(query);
  await moveMouseOutOfTheWay(window);
  await window.waitForTimeout(afterActionWait);
}

async function getTreeRowByTextAndParent(window, geodeObjectType, dataName, tree) {
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
    throw new Error(`Could not find child "${dataName}" under parent "${geodeObjectType}"`);
  }
  return allRows.nth(childIndex);
}

async function expandGeodeObjectTypeInTree(window, geodeObjectType, tree) {
  await closeAllMenus(window);
  const treeRow = await getTreeRowByTextAndParent(window, geodeObjectType, undefined, tree);
  const expandButton = treeRow.getByTestId("expandTreeRowButton").first();
  if (await expandButton.isVisible()) {
    await expandButton.click();
    await window.waitForTimeout(afterActionWait);
  }
}

async function collapseGeodeObjectTypeInTree(window, geodeObjectType, tree) {
  const treeRow = await getTreeRowByTextAndParent(window, geodeObjectType, undefined, tree);
  const collapseButton = treeRow.getByTestId("collapseTreeRowButton").first();
  if (await collapseButton.isVisible()) {
    await collapseButton.click({ force: true });
    await window.waitForTimeout(afterActionWait);
  }
}

async function copyTreeRowId(window, parentName, objectName, tree) {
  const row = await getTreeRowByTextAndParent(window, parentName, objectName, tree);
  const label = row.getByTestId("treeItemLabel").first();
  const dataTestId = await row
    .locator('[data-testid^="treeRow-"]')
    .first()
    .getAttribute("data-testid");
  const id = dataTestId.replace("treeRow-", "");
  await label.hover();
  await window.waitForTimeout(afterActionWait);
  const copyBtn = window.locator(".v-overlay--active").getByTestId("copyIdBtn");
  await copyBtn.hover();
  await copyBtn.click();
  await window.waitForTimeout(afterActionWait);
  return id;
}

async function hideObjectInTree(window, parentName, objectName, tree) {
  const row = await getTreeRowByTextAndParent(window, parentName, objectName, tree);
  await row.waitFor({ state: "attached" });
  const btn = row.getByTestId("visibleObjectEyeButton").first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
    await moveMouseOutOfTheWay(window);
    await window.waitForTimeout(afterActionWait);
  }
}

async function openObjectTreeContextMenu(window, objectName, tree) {
  const row = await getTreeRowByTextAndParent(window, objectName, undefined, tree);
  await row.click({
    button: "right",
  });
  await window.waitForTimeout(afterActionWait);
}

export {
  checkFilterCategory,
  clickCollapseOrExpandAll,
  collapseGeodeObjectTypeInTree,
  collapseTreeGroup,
  copyTreeRowId,
  expandGeodeObjectTypeInTree,
  fillSearchQuery,
  getTreeRowByTextAndParent,
  hideObjectInTree,
  openFilterMenu,
  openObjectTreeContextMenu,
  toggleSearchObjects,
  toggleSortObjects,
  uncheckFilterCategory,
};
