// The viewer tests of OpenGeodeWeb-Front (tests/browser/suites), run against the Vease app with OpenGeodeWeb-Front's
// Data. Each suite is a describe named by its path: it opens the app, runs its tests and closes the app (the
// Screenshots keep the folders of the suite, see utils/fixtures.ts)

// Local imports
import { loadOgwTestDatas } from "@vease_tests/utils/load";
import { suites } from "#ogw_e2e_suites/index.js";
import { test } from "@vease_tests/utils/fixtures";

test.use({ suiteId: import.meta.url });

for (const [name, registerTests] of Object.entries(suites)) {
  test.describe(name, () => {
    test.beforeAll(async ({ app }) => {
      await app.open();
    });
    test.afterAll(async ({ app }) => {
      await app.close();
    });
    registerTests({ test, loadTestDatas: loadOgwTestDatas });
  });
}
