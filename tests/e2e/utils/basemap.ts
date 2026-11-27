// Node imports

// Third party imports
import type { Page } from "@playwright/test";

// Local imports
import { toggleBasemap } from "#ogw_e2e/basemap.js";

async function toggleGeologyBasemap(window: Page): Promise<void> {
  await toggleBasemap(window, "Geology");
}

export { toggleGeologyBasemap };
