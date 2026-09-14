import { meshViewerObjectType } from "vease/tests/e2e/utils/constants.js";
import { setPointsSize } from "vease/tests/e2e/utils/viewer_interaction.js";

function setMeshPointsSize(window, value) {
  return setPointsSize(window, meshViewerObjectType, value);
}

export { setMeshPointsSize };
