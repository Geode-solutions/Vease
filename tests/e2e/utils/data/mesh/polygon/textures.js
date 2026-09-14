import { meshViewerObjectType } from "@tests/utils/constants.js";
import { setPolygonsTextures } from "@tests/utils/viewer_interaction.js";

function setMeshPolygonsTextures(window) {
  return setPolygonsTextures(window, meshViewerObjectType);
}

export { setMeshPolygonsTextures };
