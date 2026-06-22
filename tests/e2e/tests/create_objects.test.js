// Node imports

// Third party imports
// Local imports
import { beforeAllTimeout, navigateToApp } from "@tests/utils/viewer_interaction.js";
import { test } from "@tests/fixtures.js";

// Constants

let window = undefined;
let cleanup = undefined;

test.beforeAll(async ({ mode, browser }) => {
  ({ window, cleanup } = await navigateToApp(mode, browser));
}, beforeAllTimeout);

test.afterAll(async () => {
  await cleanup();
});
