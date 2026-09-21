// Third party imports
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

// Local imports
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow.js";

const backEventHandlers = {
  [opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file.$id]: async (
    payload: unknown,
  ) => {
    const hybridViewerStore = getHybridViewerStore();
    console.log("[GEODE] save_viewable_file:", payload);
    await importItem(payload);
    hybridViewerStore.remoteRender();
  },
};

export { backEventHandlers };
