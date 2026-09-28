import type { Page } from "@playwright/test";
import { modelViewerObjectType } from "@vease_tests/utils/constants";
import { setPointsSize } from "@vease_tests/utils/viewer_interaction";

async function setModelPointsSize(window: Page, value: number): Promise<void> {
  await setPointsSize(window, modelViewerObjectType, value);
}

export { setModelPointsSize };
