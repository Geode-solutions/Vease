import { meshViewerObjectType } from "@tests/utils/constants";
import { setPointsVisibility } from "@tests/utils/viewer_interaction";

function setMeshPointsVisibility(window, visibility) {
  return setPointsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPointsVisibility };
