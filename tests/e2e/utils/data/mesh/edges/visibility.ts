import { meshViewerObjectType } from "@tests/utils/constants.js";
import { setEdgesVisibility } from "@tests/utils/viewer_interaction.js";

function setMeshEdgesVisibility(window, visibility) {
  return setEdgesVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshEdgesVisibility };
