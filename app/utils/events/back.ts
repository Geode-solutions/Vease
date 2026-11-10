// Third party imports
import { consola } from "consola";
import opengeodeweb_back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";

// Local imports
import type { LegacyDataId } from "@ogw_front/utils/legacy_data_id";
import type { NewDataItem } from "@ogw_front/stores/data";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { importItem } from "@ogw_front/utils/import_workflow.js";
import { trackImport } from "@vease/utils/controller/pending_imports";

// The back-end still names the data id `id`
function isNewDataItem(value: unknown): value is LegacyDataId<NewDataItem> {
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

function isSavedDataPayload(
  value: unknown,
): value is { data: [LegacyDataId<NewDataItem>, ...LegacyDataId<NewDataItem>[]] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray(value.data) &&
    value.data.length > 0 &&
    value.data.every((item) => isNewDataItem(item))
  );
}

async function importAndRender(item: LegacyDataId<NewDataItem>): Promise<void> {
  await importItem(item);
  await getHybridViewerStore().remoteRender();
}

const backEventHandlers = {
  [opengeodeweb_back_schemas.opengeodeweb_back.save_viewable_file.$id]: async (
    payload: unknown,
  ): Promise<void> => {
    if (!isSavedDataPayload(payload)) {
      consola.error("[GEODE] Invalid save_viewable_file payload:", payload);
      return;
    }
    consola.debug("[GEODE] save_viewable_file:", payload);
    // One file may hold several objects: each one is imported and awaited on its own id
    await Promise.all(
      payload.data.map(async (item) => {
        const imported = importAndRender(item);
        trackImport(item.id, imported);
        await imported;
      }),
    );
  },
};

export { backEventHandlers };
