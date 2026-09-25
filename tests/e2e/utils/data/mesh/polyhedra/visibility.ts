import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@vease_tests/utils/constants.js";
import { setPolyhedraVisibility } from "@vease_tests/utils/viewer_interaction.js";

async function setMeshPolyhedraVisibility(window: Page, visibility: boolean): Promise<void> {
  await setPolyhedraVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPolyhedraVisibility };
