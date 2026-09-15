import { meshViewerObjectType } from "@tests/utils/constants";
import { setPointsSize } from "@tests/utils/viewer_interaction";

function setMeshPointsSize(window, value) {
  return setPointsSize(window, meshViewerObjectType, value);
}

export { setMeshPointsSize };
