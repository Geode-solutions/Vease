import type { Page } from "@playwright/test";
import { modelViewerObjectType } from "@tests/utils/constants";
import { setPointsVisibility } from "@tests/utils/viewer_interaction";

async function setModelPointsVisibility(window: Page, visibility: boolean): Promise<void> {
  await setPointsVisibility(window, modelViewerObjectType, visibility);
}

export { setModelPointsVisibility };
