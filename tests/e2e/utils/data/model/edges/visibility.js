import { modelViewerObjectType } from "vease/tests/e2e/utils/constants.js";
import { setEdgesVisibility } from "vease/tests/e2e/utils/viewer_interaction.js";

function setModelEdgesVisibility(window, visibility) {
  return setEdgesVisibility(window, modelViewerObjectType, visibility);
}

export { setModelEdgesVisibility };
