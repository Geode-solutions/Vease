// Third party imports
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

// Local imports
import { importItem } from "@ogw_front/utils/import_workflow.js";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer.js";

const backEventHandlers = {
  [opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file.$id]: async (payload) => {
    const hybridViewerStore = useHybridViewerStore();
    console.log("[GEODE] save_viewable_file:", payload);
    await importItem(payload);
    hybridViewerStore.remoteRender();
  },
};

export { backEventHandlers };
