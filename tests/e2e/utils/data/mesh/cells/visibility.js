import { meshViewerObjectType } from "vease/tests/e2e/utils/constants.js";
import { setCellsVisibility } from "vease/tests/e2e/utils/viewer_interaction.js";

function setMeshCellsVisibility(window, visibility) {
  return setCellsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshCellsVisibility };
