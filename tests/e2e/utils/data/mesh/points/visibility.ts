import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@tests/utils/constants";
import { setPointsVisibility } from "@tests/utils/viewer_interaction";

async function setMeshPointsVisibility(window: Page, visibility: boolean): Promise<void> {
  await setPointsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPointsVisibility };
