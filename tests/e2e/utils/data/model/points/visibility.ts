import { modelViewerObjectType } from "@tests/utils/constants";
import { setPointsVisibility } from "@tests/utils/viewer_interaction";

function setModelPointsVisibility(window, visibility) {
  return setPointsVisibility(window, modelViewerObjectType, visibility);
}

export { setModelPointsVisibility };
