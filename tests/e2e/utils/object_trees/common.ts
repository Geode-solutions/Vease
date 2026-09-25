import type { Locator, Page } from "@playwright/test";
import { closeAllMenus, moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import { modalTransitionWait } from "@vease_tests/utils/constants";
import { waitForActionSettled } from "@vease_tests/utils/viewer_interaction";

async function clickCollapseOrExpandAll(
  window: Page,
  tree: Locator,
  expectedIcon: string,
): Promise<void> {
  const btn = tree.getByTestId("CollapseOrExpandAll");
  const targetIcon = btn.locator(`.${expectedIcon}`);
  if (await targetIcon.isVisible()) {
    await btn.click();
    await moveMouseOutOfTheWay(window);
    await waitForActionSettled(window);
  }
}

async function collapseTreeGroup(window: Page, tree: Locator, groupName: string): Promise<void> {
  const groupRow = tree.getByTestId("treeRowWrapper").filter({ hasText: groupName }).first();
  const collapseBtn = groupRow.getByTestId("collapseTreeRowButton");

  if (await collapseBtn.isVisible()) {
    await collapseBtn.click();
    await window.waitForTimeout(modalTransitionWait);
  }
}

async function toggleSortObjects(window: Page): Promise<void> {
  await window.getByTestId("sortObjectsButton").click();
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

async function openFilterMenu(window: Page, tree: Locator): Promise<void> {
  await tree.getByTestId("filterObjectsButton").click();
  await window
    .locator(".v-overlay-container [data-testid^='filterCheckbox-']")
    .first()
    .waitFor({ state: "attached" });
}

async function checkFilterCategory(window: Page, categoryId: string): Promise<void> {
  const checkbox = window.getByTestId(`filterCheckbox-${categoryId}`).getByRole("checkbox");
  await checkbox.waitFor({ state: "attached" });
  await checkbox.check();
  await waitForActionSettled(window);
}

async function uncheckFilterCategory(window: Page, categoryId: string): Promise<void> {
  const checkbox = window.getByTestId(`filterCheckbox-${categoryId}`).getByRole("checkbox");
  await checkbox.waitFor({ state: "attached" });
  await checkbox.uncheck();
  await waitForActionSettled(window);
}

async function toggleSearchObjects(window: Page): Promise<void> {
  await window.getByTestId("searchObjectsButton").click();
  await waitForActionSettled(window);
}

async function fillSearchQuery(window: Page, query: string, tree: Locator): Promise<void> {
  const searchInput = tree.getByTestId("searchObjectsInput").locator("input");
  await searchInput.fill(query);
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

async function getTreeRowByTextAndParent(
  window: Page,
  geodeObjectType: string,
  dataName: string | undefined,
  tree: Locator,
): Promise<Locator> {
  const parentRow = tree
    .getByTestId("treeRowWrapper")
    .filter({ hasText: geodeObjectType, hasNot: window.locator(".leaf-row") })
    .first();
  await parentRow.waitFor({ state: "attached" });
  if (dataName === undefined || dataName === "") {
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
        const row = rows[j];
        if (row === undefined) {
          break;
        }
        if (row.textContent.includes(name)) {
          return j;
        }
        if (!row.classList.contains("leaf-row")) {
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

async function expandGeodeObjectTypeInTree(
  window: Page,
  geodeObjectType: string,
  tree: Locator,
): Promise<void> {
  await closeAllMenus(window);
  const treeRow = await getTreeRowByTextAndParent(window, geodeObjectType, undefined, tree);
  const expandButton = treeRow.getByTestId("expandTreeRowButton").first();
  if (await expandButton.isVisible()) {
    await expandButton.click();
    await waitForActionSettled(window);
  }
}

async function collapseGeodeObjectTypeInTree(
  window: Page,
  geodeObjectType: string,
  tree: Locator,
): Promise<void> {
  const treeRow = await getTreeRowByTextAndParent(window, geodeObjectType, undefined, tree);
  const collapseButton = treeRow.getByTestId("collapseTreeRowButton").first();
  if (await collapseButton.isVisible()) {
    await collapseButton.click({ force: true });
    await waitForActionSettled(window);
  }
}

async function getTreeRowId(rowDataTestIdLocator: Locator, objectName: string): Promise<string> {
  const dataTestId = await rowDataTestIdLocator.getAttribute("data-testid");
  if (dataTestId === null) {
    throw new Error(`Could not find a "data-testid" attribute for row "${objectName}"`);
  }
  return dataTestId.replace("treeRow-", "");
}

async function copyTreeRowId(
  window: Page,
  parentName: string,
  objectName: string,
  tree: Locator,
): Promise<string> {
  const row = await getTreeRowByTextAndParent(window, parentName, objectName, tree);
  const label = row.getByTestId("treeItemLabel").first();
  const id = await getTreeRowId(row.locator('[data-testid^="treeRow-"]').first(), objectName);
  await label.hover();
  await waitForActionSettled(window);
  const copyBtn = window.locator(".v-overlay--active").getByTestId("copyIdBtn");
  await copyBtn.hover();
  await copyBtn.click();
  await waitForActionSettled(window);
  return id;
}

async function hideObjectInTree(
  window: Page,
  parentName: string,
  objectName: string | undefined,
  tree: Locator,
): Promise<void> {
  const row = await getTreeRowByTextAndParent(window, parentName, objectName, tree);
  await row.waitFor({ state: "attached" });
  const btn = row.getByTestId("visibleObjectEyeButton").first();
  if (await btn.isVisible()) {
    await btn.click({ force: true });
    await moveMouseOutOfTheWay(window);
    await waitForActionSettled(window);
  }
}

async function openObjectTreeContextMenu(
  window: Page,
  objectName: string,
  tree: Locator,
): Promise<void> {
  const row = await getTreeRowByTextAndParent(window, objectName, undefined, tree);
  await row.click({
    button: "right",
  });
  await waitForActionSettled(window);
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
  getTreeRowId,
  hideObjectInTree,
  openFilterMenu,
  openObjectTreeContextMenu,
  toggleSearchObjects,
  toggleSortObjects,
  uncheckFilterCategory,
};
