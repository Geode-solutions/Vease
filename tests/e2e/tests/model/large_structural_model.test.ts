// Node imports

// Third party imports
import { consola } from "consola";

// Local imports
import { downloadRemoteTestData } from "@vease_tests/utils/remote_data";
import { expandMainObjectTree } from "#ogw_e2e/object_trees/main_object_tree.js";
import { loadVeaseTestDatas } from "@vease_tests/utils/load";
import { moveMouseOutOfTheWay } from "#ogw_e2e/app_interaction.js";
import { resetCamera } from "#ogw_e2e/camera_interaction.js";
import { test } from "@vease_tests/utils/fixtures";

// Constants
// 284 MB structural model meshed with 300 m tetrahedra (#890)
const largeStructuralModelFilename = "3_meshed_300m.og_strm";
const MILLISECONDS_PER_SECOND = 1000;
const downloadTimeout = 300_000;
const largeImportTimeout = 600_000;

test.use({ suiteId: import.meta.url });
test.describe.configure({ mode: "serial" });

let largeDataPath = "";

test.beforeAll(async () => {
  test.setTimeout(downloadTimeout);
  largeDataPath = await downloadRemoteTestData(largeStructuralModelFilename);
});

// The [timing] logs of the back and viewer give the duration of each import step
test("load large structural model", async ({ window }) => {
  test.setTimeout(largeImportTimeout);
  const start = Date.now();
  await loadVeaseTestDatas(window, [largeStructuralModelFilename], {
    loadTimeout: largeImportTimeout,
    inputDataPath: largeDataPath,
  });
  const seconds = ((Date.now() - start) / MILLISECONDS_PER_SECOND).toFixed(2);
  consola.info(`[timing] e2e import ${largeStructuralModelFilename}: ${seconds}s`);
  await expandMainObjectTree(window);
  await resetCamera(window);
  await moveMouseOutOfTheWay(window);
});
