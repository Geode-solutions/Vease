import { meshViewerObjectType } from "@tests/utils/constants.js";
import { setEdgesWidth } from "@tests/utils/viewer_interaction.js";

function setMeshEdgesWidth(window, value) {
  return setEdgesWidth(window, meshViewerObjectType, value);
}

export { setMeshEdgesWidth };
