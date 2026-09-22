import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@tests/utils/constants.js";
import { setPolyhedraVisibility } from "@tests/utils/viewer_interaction.js";

async function setMeshPolyhedraVisibility(window: Page, visibility: boolean): Promise<void> {
  await setPolyhedraVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPolyhedraVisibility };
