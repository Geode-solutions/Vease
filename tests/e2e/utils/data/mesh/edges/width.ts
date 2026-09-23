import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@tests/utils/constants.js";
import { setEdgesWidth } from "@tests/utils/viewer_interaction.js";

async function setMeshEdgesWidth(window: Page, value: number): Promise<void> {
  await setEdgesWidth(window, meshViewerObjectType, value);
}

export { setMeshEdgesWidth };
