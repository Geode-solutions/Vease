// Third party imports
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

// Local imports
import { useDataStyleStore } from "@ogw_front/stores/data_style.js";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer.js";

const viewerEventHandlers = {
  [opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility.$id]: (payload) => {
    const dataStyleStore = useDataStyleStore();
    dataStyleStore.mutateMeshPointsVisibility(payload);
  },
  [opengeodeweb_viewer_schemas.opengeodeweb_viewer.viewer.render.$id]: () => {
    const hybridViewerStore = useHybridViewerStore();
    hybridViewerStore.remoteRender();
  },
};

export { viewerEventHandlers };
