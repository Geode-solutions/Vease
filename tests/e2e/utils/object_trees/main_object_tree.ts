import type { Locator, Page } from "@playwright/test";
import {
  clickCollapseOrExpandAll,
  collapseGeodeObjectTypeInTree,
  collapseTreeGroup,
  expandGeodeObjectTypeInTree,
  getTreeRowByTextAndParent,
} from "./common";
import { consola } from "consola";
import { moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

// On the Windows desktop build the tree row sometimes receives a stray mouseleave while the (slow) highlight render runs, which drops both the tooltip and the highlight before the screenshot.
// The cursor is never moved by the test in between, so re-hovering restores the intended state.
const HIGHLIGHT_HOVER_ATTEMPTS = 3;

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
  const label = row.getByTestId("treeItemLabel");
  const tooltipIdValue = window
    .getByTestId("tooltipIdValue")
    .filter({ hasNotText: geodeObjectType });
  for (let attempt = 1; attempt <= HIGHLIGHT_HOVER_ATTEMPTS; attempt += 1) {
    // oxlint-disable-next-line no-await-in-loop
    await label.hover();
    // oxlint-disable-next-line no-await-in-loop
    await tooltipIdValue.waitFor({ state: "visible" });
    // oxlint-disable-next-line no-await-in-loop
    await waitForActionSettled(window);
    // oxlint-disable-next-line no-await-in-loop
    if (await tooltipIdValue.isVisible()) {
      return;
    }
    consola.warn(
      `highlightData: hover on "${dataName}" was lost while the highlight rendered (attempt ${attempt}/${HIGHLIGHT_HOVER_ATTEMPTS})`,
    );
    // oxlint-disable-next-line no-await-in-loop
    await moveMouseOutOfTheWay(window);
    // oxlint-disable-next-line no-await-in-loop
    await waitForActionSettled(window);
  }
  throw new Error(
    `highlightData: hover on "${dataName}" kept being lost after ${HIGHLIGHT_HOVER_ATTEMPTS} attempts`,
  );
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
