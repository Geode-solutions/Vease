import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@tests/utils/constants";
import { setCellsVisibility } from "@tests/utils/viewer_interaction";

async function setMeshCellsVisibility(window: Page, visibility: boolean): Promise<void> {
  await setCellsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshCellsVisibility };
