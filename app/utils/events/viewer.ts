// Third party imports
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

// Local imports
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";

function isMeshPointsVisibilityPayload(
  value: unknown,
): value is { id: string; visibility: boolean } {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "visibility" in value &&
    typeof value.id === "string" &&
    typeof value.visibility === "boolean"
  );
}

const viewerEventHandlers = {
  [opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility.$id]: (
    payload: unknown,
  ): void => {
    if (!isMeshPointsVisibilityPayload(payload)) {
      console.error("[VIEWER] Invalid mesh points visibility payload:", payload);
      return;
    }
    const dataStyleStore = getDataStyleStore();
    void dataStyleStore.setVisibility(payload.id, payload.visibility);
  },
  [opengeodeweb_viewer_schemas.opengeodeweb_viewer.viewer.render.$id]: (): void => {
    const hybridViewerStore = getHybridViewerStore();
    void hybridViewerStore.remoteRender();
  },
};

export { viewerEventHandlers };
