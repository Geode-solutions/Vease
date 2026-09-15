import { meshViewerObjectType } from "@tests/utils/constants";
import { setCellsVisibility } from "@tests/utils/viewer_interaction";

function setMeshCellsVisibility(window, visibility) {
  return setCellsVisibility(window, meshViewerObjectType, visibility);
}

export { setMeshCellsVisibility };
