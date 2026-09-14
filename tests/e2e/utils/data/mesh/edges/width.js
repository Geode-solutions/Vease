import { meshViewerObjectType } from "vease/tests/e2e/utils/constants.js";
import { setEdgesWidth } from "vease/tests/e2e/utils/viewer_interaction.js";

function setMeshEdgesWidth(window, value) {
  return setEdgesWidth(window, meshViewerObjectType, value);
}

export { setMeshEdgesWidth };
