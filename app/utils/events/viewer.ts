// Third party imports
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

// Local imports
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";

const viewerEventHandlers = {
  [opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility.$id]: (
    payload: unknown,
  ) => {
    const dataStyleStore = getDataStyleStore();
    dataStyleStore.mutateMeshPointsVisibility(payload);
  },
  [opengeodeweb_viewer_schemas.opengeodeweb_viewer.viewer.render.$id]: () => {
    const hybridViewerStore = getHybridViewerStore();
    hybridViewerStore.remoteRender();
  },
};

export { viewerEventHandlers };
