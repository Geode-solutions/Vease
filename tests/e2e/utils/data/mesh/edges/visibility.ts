import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@vease_tests/utils/constants.js";
import { setEdgesVisibility } from "@vease_tests/utils/viewer_interaction.js";

async function setMeshEdgesVisibility(window: Page, visibility: boolean): Promise<void> {
  await setEdgesVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshEdgesVisibility };
