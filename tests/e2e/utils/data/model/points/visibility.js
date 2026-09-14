import { modelViewerObjectType } from "@tests/utils/constants.js";
import { setPointsVisibility } from "@tests/utils/viewer_interaction.js";

function setModelPointsVisibility(window, visibility) {
  return setPointsVisibility(window, modelViewerObjectType, visibility);
}

export { setModelPointsVisibility };
