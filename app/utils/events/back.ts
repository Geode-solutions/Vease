// Third party imports
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

// Local imports
import type { NewDataItem } from "@ogw_front/stores/data";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow.js";

function isNewDataItem(value: unknown): value is NewDataItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "viewer_type" in value &&
    "geode_object_type" in value &&
    typeof value.id === "string" &&
    typeof value.viewer_type === "string" &&
    typeof value.geode_object_type === "string"
  );
}

const backEventHandlers = {
  [opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file.$id]: async (
    payload: unknown,
  ): Promise<void> => {
    if (!isNewDataItem(payload)) {
      console.error("[GEODE] Invalid save_viewable_file payload:", payload);
      return;
    }
    const hybridViewerStore = getHybridViewerStore();
    console.log("[GEODE] save_viewable_file:", payload);
    await importItem(payload);
    await hybridViewerStore.remoteRender();
  },
};

export { backEventHandlers };
