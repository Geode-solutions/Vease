// Defined in OpenGeodeWeb-Front (tests/browser/suites), run against the Vease app with OpenGeodeWeb-Front's data

// Local imports
import { loadOgwTestDatas } from "@vease_tests/utils/load";
import { registerTests } from "#ogw_e2e_suites/model/display.js";
import { test } from "@vease_tests/utils/fixtures";

test.use({ suiteId: import.meta.url });

registerTests({ test, loadTestDatas: loadOgwTestDatas });
