// Node imports

// Third party imports
import { type Locator, type Page, expect } from "@playwright/test";

// Local imports
import { brepGeodeObjectType, defaultDataName } from "#ogw_e2e/constants.js";
import {
  expandMeshComponentType,
  getModelComponentsObjectTree,
  openModelComponentsTree,
} from "#ogw_e2e/object_trees/model_components_object_tree.js";
import { expandMainObjectTree } from "#ogw_e2e/object_trees/main_object_tree.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "#ogw_e2e/viewer_interaction.js";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "#ogw_e2e/wait_for_action_settled.js";

// Constants
const brepFilename = "test.og_brep";
const SURFACE_BOUNDARIES = 4;

function treeRows(window: Page): Locator {
  return getModelComponentsObjectTree(window).getByTestId("treeRowWrapper");
}

// The first component of the opened type that has relations: its row can be expanded
function firstExpandableComponentRow(window: Page): Locator {
  return getModelComponentsObjectTree(window)
    .locator(".leaf-row")
    .filter({ has: window.getByTestId("expandTreeRowButton") })
    .first();
}

async function expandRow(window: Page, row: Locator): Promise<void> {
  await row.getByTestId("expandTreeRowButton").first().click();
  await moveMouseOutOfTheWay(window);
  await waitForActionSettled(window);
}

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep and open model components", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
});

test("expand surfaces", async ({ window }) => {
  await expandMeshComponentType(window, "Surfaces");
  await expect(firstExpandableComponentRow(window)).toBeVisible();
  await expect(treeRows(window).filter({ hasText: "Boundaries (" })).toHaveCount(0);
});

test("expand a surface shows its boundaries", async ({ window }) => {
  await expandRow(window, firstExpandableComponentRow(window));
  await expect(treeRows(window).filter({ hasText: "Boundaries (" })).toHaveCount(1);
  await expect(
    treeRows(window).filter({ hasText: `Boundaries (${SURFACE_BOUNDARIES})` }),
  ).toHaveCount(1);
});

// The viewer highlights the lines of the group, not the surface
test("hover the boundaries of a surface highlights its lines", async ({ window }) => {
  await treeRows(window).filter({ hasText: "Boundaries (" }).first().hover();
  await waitForActionSettled(window);
});

test("expand the boundaries of a surface lists its lines", async ({ window }) => {
  const rowsBefore = await treeRows(window).count();
  await expandRow(window, treeRows(window).filter({ hasText: "Boundaries (" }).first());
  await expect(treeRows(window)).toHaveCount(rowsBefore + SURFACE_BOUNDARIES);
});
