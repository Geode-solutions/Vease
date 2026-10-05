// Third party imports
import opengeodeweb_viewer_schemas, {
  type MeshPointsVisibilityParams,
} from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_typed_schemas.js";
import { consola } from "consola";

// Local imports
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";

// Pushed events carry the params of the RPC that published them
function isMeshPointsVisibilityPayload(value: unknown): value is MeshPointsVisibilityParams {
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
      consola.error("[VIEWER] Invalid mesh points visibility payload:", payload);
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
