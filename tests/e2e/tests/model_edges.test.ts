// Node imports

// Third party imports

// Local imports
import { brepGeodeObjectType, defaultDataName } from "@vease_tests/utils/constants";
import { closeAllMenus, moveMouseOutOfTheWay } from "@vease_tests/utils/app_interaction";
import {
  expandMainObjectTree,
  openDataContextMenu,
  toggleObjectsTree,
} from "@vease_tests/utils/object_trees/main_object_tree";
import {
  expandMeshComponentType,
  getModelComponentsObjectTree,
  openModelComponentContextMenu,
  openModelComponentsTree,
} from "@vease_tests/utils/object_trees/model_components_object_tree";
import {
  getHybridViewerCanvas,
  getHybridViewerCanvasBoundingBox,
  viewerContextMenu,
} from "@vease_tests/utils/viewer_interaction";
import {
  setModelComponentsEdgesColor,
  setModelComponentsEdgesVertexAttribute,
  setModelComponentsEdgesVisibility,
  setModelComponentsEdgesWidth,
} from "@vease_tests/utils/data";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

// Constants
const brepFilename = "test.og_brep";
const vertexAttributeName = "test_vertex";
const blockVertexAttributeName = "test_vertex2";
const allComponentsEdgesWidth = 3;
const componentEdgesWidth = 8;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep and open model components", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
  await openModelComponentsTree(window, brepGeodeObjectType, defaultDataName);
  await moveMouseOutOfTheWay(window);
});

test("all components edges from object tree", async ({ window }) => {
  await closeAllMenus(window);
  await openDataContextMenu(window, brepGeodeObjectType, defaultDataName);
  await setModelComponentsEdgesVisibility(window, "modelEdgesComponentsOptions", true);
  await setModelComponentsEdgesWidth(
    window,
    "modelEdgesComponentsOptions",
    allComponentsEdgesWidth,
  );
  await setModelComponentsEdgesColor(window, "modelEdgesComponentsOptions");
  await moveMouseOutOfTheWay(window);
});

test("surfaces edges vertex attribute from components tree", async ({ window }) => {
  await closeAllMenus(window);
  await getModelComponentsObjectTree(window)
    .locator(".tree-row-wrapper", { hasText: "Surfaces" })
    .locator(".tree-item-label")
    .first()
    .click({ button: "right" });
  await waitForActionSettled(window);
  await setModelComponentsEdgesVertexAttribute(
    window,
    "modelEdgesComponentTypeOptions",
    vertexAttributeName,
    { colorMap: "vikO" },
  );
  await moveMouseOutOfTheWay(window);
});

test("one surface edges width and color from components tree", async ({ window }) => {
  await expandMeshComponentType(window, "Surfaces");
  await openModelComponentContextMenu(window, "00000000-", 0);
  await setModelComponentsEdgesWidth(window, "modelEdgesComponentOptions", componentEdgesWidth);
  await setModelComponentsEdgesColor(window, "modelEdgesComponentOptions");
  await moveMouseOutOfTheWay(window);
});

test("picked block edges vertex attribute", async ({ window }) => {
  await closeAllMenus(window);
  await toggleObjectsTree(window);
  const hybridViewerCanvas = getHybridViewerCanvas(window);
  const box = await getHybridViewerCanvasBoundingBox(hybridViewerCanvas);
  await viewerContextMenu(window, box.width / 2, box.height / 2);
  await setModelComponentsEdgesVertexAttribute(
    window,
    "modelEdgesComponentOptions",
    blockVertexAttributeName,
    { colorMap: "roma" },
  );
  await moveMouseOutOfTheWay(window);
});
