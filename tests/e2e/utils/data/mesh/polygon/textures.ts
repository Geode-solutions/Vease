import type { Page } from "@playwright/test";
import { meshViewerObjectType } from "@vease_tests/utils/constants";
import { setPolygonsTextures } from "@vease_tests/utils/viewer_interaction";

async function setMeshPolygonsTextures(window: Page): Promise<void> {
  await setPolygonsTextures(window, meshViewerObjectType);
}

export { setMeshPolygonsTextures };
