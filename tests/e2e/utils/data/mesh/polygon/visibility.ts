import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@vease_tests/utils/constants.js";
import { setPolygonsVisibility } from "@vease_tests/utils/viewer_interaction.js";

async function setMeshPolygonsVisibility(window: Page, visibility: boolean): Promise<void> {
  await setPolygonsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPolygonsVisibility };
