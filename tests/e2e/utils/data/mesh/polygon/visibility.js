import { meshViewerObjectType } from "vease/tests/e2e/utils/constants.js";
import { setPolygonsVisibility } from "vease/tests/e2e/utils/viewer_interaction.js";

function setMeshPolygonsVisibility(window, visibility) {
  return setPolygonsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPolygonsVisibility };
