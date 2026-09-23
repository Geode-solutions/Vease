import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@tests/utils/constants";
import { setPointsSize } from "@tests/utils/viewer_interaction";

async function setMeshPointsSize(window: Page, value: number): Promise<void> {
  await setPointsSize(window, meshViewerObjectType, value);
}

export { setMeshPointsSize };
