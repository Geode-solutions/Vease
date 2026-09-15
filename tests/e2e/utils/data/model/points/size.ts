import { modelViewerObjectType } from "@tests/utils/constants";
import { setPointsSize } from "@tests/utils/viewer_interaction";

function setModelPointsSize(window, value) {
  return setPointsSize(window, modelViewerObjectType, value);
}

export { setModelPointsSize };
