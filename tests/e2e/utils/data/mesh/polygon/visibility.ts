import { meshViewerObjectType } from "@tests/utils/constants.js";
import { setPolygonsVisibility } from "@tests/utils/viewer_interaction.js";

function setMeshPolygonsVisibility(window, visibility) {
  return setPolygonsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPolygonsVisibility };
