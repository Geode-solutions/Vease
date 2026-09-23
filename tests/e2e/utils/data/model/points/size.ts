import type { Page } from "@playwright/test";
import { modelViewerObjectType } from "@tests/utils/constants";
import { setPointsSize } from "@tests/utils/viewer_interaction";

async function setModelPointsSize(window: Page, value: number): Promise<void> {
  await setPointsSize(window, modelViewerObjectType, value);
}

export { setModelPointsSize };
