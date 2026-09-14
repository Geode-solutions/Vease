import { meshViewerObjectType } from "vease/tests/e2e/utils/constants.js";
import { setPolyhedraVisibility } from "vease/tests/e2e/utils/viewer_interaction.js";

function setMeshPolyhedraVisibility(window, visibility) {
  return setPolyhedraVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPolyhedraVisibility };
