import { modelViewerObjectType } from "@tests/utils/constants.js";
import { setPointsSize } from "@tests/utils/viewer_interaction.js";

function setModelPointsSize(window, value) {
  return setPointsSize(window, modelViewerObjectType, value);
}

export { setModelPointsSize };
