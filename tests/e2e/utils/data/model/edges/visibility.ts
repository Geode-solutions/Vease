import type { Page } from "@playwright/test";
import { modelViewerObjectType } from "@vease_tests/utils/constants";
import { setEdgesVisibility } from "@vease_tests/utils/viewer_interaction";

async function setModelEdgesVisibility(window: Page, visibility: boolean): Promise<void> {
  await setEdgesVisibility(window, modelViewerObjectType, visibility);
}

export { setModelEdgesVisibility };
