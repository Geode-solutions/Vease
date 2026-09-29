// Node imports
import { copyFileSync, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";

// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import { closeAllMenus, moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import {
  expandMainObjectTree,
  getMainObjectTree,
  showObjectInTree,
} from "@vease_tests/utils/object_trees/main_object_tree";
import {
  getTreeRowByTextAndParent,
  hideObjectInTree,
  openObjectTreeContextMenu,
} from "@vease_tests/utils/object_trees/common";
import {
  setMeshEdgesVisibility,
  setMeshPolygonsColor,
  setMeshPolygonsColorInput,
  setMeshPolygonsVertexAttribute,
} from "@vease_tests/utils/data";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";
import { triangulatedSurfaceGeodeObjectType } from "@vease_tests/utils/constants";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

// Constants
const __dirname = import.meta.dirname;
const sourceFilename = "test.og_tsf3d";
const firstSurfaceName = "surface_a";
const secondSurfaceName = "surface_b";
const vertexAttributeName = "test_vertex";
const dataColor = "0, 0, 255";

function prepareSurfaces(): string {
  const directory = mkdtempSync(path.join(os.tmpdir(), "vease_group_menu_"));
  const source = path.join(__dirname, "data", sourceFilename);
  for (const name of [firstSurfaceName, secondSurfaceName]) {
    copyFileSync(source, path.join(directory, `${name}.og_tsf3d`));
  }
  return directory;
}

async function openSurfaceContextMenu(window: Page, surfaceName: string): Promise<void> {
  const row = await getTreeRowByTextAndParent(
    window,
    triangulatedSurfaceGeodeObjectType,
    surfaceName,
    getMainObjectTree(window),
  );
  await row.getByTestId("treeItemLabel").first().click({ button: "right" });
  await waitForActionSettled(window);
}

async function openGroupContextMenu(window: Page): Promise<void> {
  await openObjectTreeContextMenu(
    window,
    triangulatedSurfaceGeodeObjectType,
    getMainObjectTree(window),
  );
}

async function showOnly(window: Page, surfaceName: string): Promise<void> {
  const otherName = surfaceName === firstSurfaceName ? secondSurfaceName : firstSurfaceName;
  await showObjectInTree(window, surfaceName);
  await hideObjectInTree(
    window,
    triangulatedSurfaceGeodeObjectType,
    otherName,
    getMainObjectTree(window),
  );
  await moveMouseOutOfTheWay(window);
}

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load", async ({ window }) => {
  const inputDataPath = prepareSurfaces();
  await loadVeaseTestDatas(window, [`${firstSurfaceName}.og_tsf3d`], { inputDataPath });
  await loadVeaseTestDatas(window, [`${secondSurfaceName}.og_tsf3d`], { inputDataPath });
  await expandMainObjectTree(window);
});

test("group color", async ({ window }) => {
  await openGroupContextMenu(window);
  await setMeshPolygonsColor(window);
  await closeAllMenus(window);
  await showOnly(window, secondSurfaceName);
});

test("group edges visibility", async ({ window }) => {
  await openGroupContextMenu(window);
  await setMeshEdgesVisibility(window, true);
  await closeAllMenus(window);
  await showOnly(window, firstSurfaceName);
});

test("data color does not change the other data", async ({ window }) => {
  await openSurfaceContextMenu(window, secondSurfaceName);
  await setMeshPolygonsColorInput(window, dataColor);
  await closeAllMenus(window);
  await showOnly(window, firstSurfaceName);
});

test("data color changes the data", async ({ window }) => {
  await showOnly(window, secondSurfaceName);
});

test("group vertex attribute", async ({ window }) => {
  await openGroupContextMenu(window);
  await setMeshPolygonsVertexAttribute(window, vertexAttributeName);
  await closeAllMenus(window);
  await showOnly(window, firstSurfaceName);
});
