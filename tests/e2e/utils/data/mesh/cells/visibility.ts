import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@vease_tests/utils/constants";
import { setCellsVisibility } from "@vease_tests/utils/viewer_interaction";

async function setMeshCellsVisibility(window: Page, visibility: boolean): Promise<void> {
  await setCellsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshCellsVisibility };
