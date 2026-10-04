// Node imports

// Third party imports
import { consola } from "consola";

// Local imports
import { brepGeodeObjectType, defaultDataName } from "@vease_tests/utils/constants";
import {
  expandGeodeObjectType,
  expandMainObjectTree,
  getMainObjectTree,
  highlightData,
} from "@vease_tests/utils/object_trees/main_object_tree";
import {
  setModelColorWithSlider,
  setModelColoringStyle,
  setModelEdgesVisibility,
  setModelOpacity,
  setModelPointsSize,
  setModelPointsVisibility,
} from "@vease_tests/utils/data";
import { toggleInfoCard, viewerContextMenu } from "@vease_tests/utils/viewer_interaction";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { test } from "@vease_tests/utils/fixtures";
import { waitForActionSettled } from "@vease_tests/utils/wait_for_action_settled";

// Constants
const brepFilename = "test.og_brep";
const modelOpacity = 50;
const pointsSize = 15;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

test("load brep", async ({ window }) => {
  await loadVeaseTestDatas(window, [brepFilename]);
  await expandMainObjectTree(window);
});

test("highlight", async ({ window, screenshotMask }) => {
  await highlightData(window, brepGeodeObjectType, defaultDataName);
  screenshotMask.locators = [window.getByTestId("tooltipIdValue")];
});

test("viewer context menu", async ({ window }) => {
  const x = 549;
  const y = 360;
  await viewerContextMenu(window, x, y);
});

test("info card", async ({ window }) => {
  await toggleInfoCard(window);
});

test("points visibility", async ({ window }) => {
  await toggleInfoCard(window);
  await setModelPointsVisibility(window, true);
});

test("points size", async ({ window }) => {
  await setModelPointsSize(window, pointsSize);
});

test("model color", async ({ window }) => {
  await setModelColorWithSlider(window);
});

test("model opacity", async ({ window }) => {
  await setModelOpacity(window, modelOpacity);
});

test("random coloring", async ({ window }) => {
  await setModelColoringStyle(window, "Random");
});

test("object tree context menu", async ({ window }) => {
  consola.info("Right click on the BRep from object tree");
  await expandGeodeObjectType(window, "BRep");
  const mainObjectTree = getMainObjectTree(window);
  const testItem = mainObjectTree.getByText("test", { exact: true }).first();
  await testItem.click({ button: "right", force: true });
  await waitForActionSettled(window);
});

test("edges visibility", async ({ window }) => {
  await setModelEdgesVisibility(window, true);
});
