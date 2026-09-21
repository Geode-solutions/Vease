import { meshViewerObjectType } from "@tests/utils/constants";
import { setPolygonsTextures } from "@tests/utils/viewer_interaction";

function setMeshPolygonsTextures(window) {
  return setPolygonsTextures(window, meshViewerObjectType);
}

export { setMeshPolygonsTextures };
