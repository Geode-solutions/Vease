// The viewer tests of OpenGeodeWeb-Front (tests/browser/suites), run against the Vease app with OpenGeodeWeb-Front's
// Data. Each suite is a describe named by its path: it opens the app, runs its tests and closes the app (the
// Screenshots keep the folders of the suite)

// Local imports
import { loadOgwTestDatas } from "@vease_tests/utils/load";
import { runSuites } from "#ogw_e2e_suites/index.js";
import { test } from "@vease_tests/utils/fixtures";

test.use({ suiteId: import.meta.url });

runSuites(test, loadOgwTestDatas);
