// The viewer tests of OpenGeodeWeb-Front (tests/browser/suites), run against the Vease app with OpenGeodeWeb-Front's
// Data: one describe per suite, named by its path (the screenshots keep its folders, see utils/fixtures.ts)

// Local imports
import { loadOgwTestDatas } from "@vease_tests/utils/load";
import { suites } from "#ogw_e2e_suites/index.js";
import { test } from "@vease_tests/utils/fixtures";

test.use({ suiteId: import.meta.url });

for (const [name, registerTests] of Object.entries(suites)) {
  test.describe(name, () => {
    // Each suite starts from a new app, like a test file
    test.beforeAll(async ({ ensureFreshApp }) => {
      await ensureFreshApp();
    });
    registerTests({ test, loadTestDatas: loadOgwTestDatas });
  });
}
