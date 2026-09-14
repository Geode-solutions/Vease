import { meshViewerObjectType } from "vease/tests/e2e/utils/constants.js";
import { setPointsVisibility } from "vease/tests/e2e/utils/viewer_interaction.js";

function setMeshPointsVisibility(window, visibility) {
  return setPointsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPointsVisibility };
