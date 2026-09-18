import { meshViewerObjectType } from "@tests/utils/constants.js";
import { setPolyhedraVisibility } from "@tests/utils/viewer_interaction.js";

function setMeshPolyhedraVisibility(window, visibility) {
  return setPolyhedraVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshPolyhedraVisibility };
