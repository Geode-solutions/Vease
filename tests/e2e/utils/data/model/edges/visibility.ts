import { modelViewerObjectType } from "@tests/utils/constants";
import { setEdgesVisibility } from "@tests/utils/viewer_interaction";

function setModelEdgesVisibility(window, visibility) {
  return setEdgesVisibility(window, modelViewerObjectType, visibility);
}

export { setModelEdgesVisibility };
