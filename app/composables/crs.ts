import back_schemas, {
  type CRSList,
} from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import type { DataItem } from "@vease/types/data_item";
import { reloadObject } from "@ogw_front/utils/import_workflow";
import { useDataStore } from "@ogw_front/stores/data";

interface CrsPoint {
  x: number;
  y: number;
}

// Converting or aligning rewrites the data coordinates: the viewer object is reloaded and the camera moved to it
// oxlint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types
function useCrs() {
  const backStore = getBackStore();
  const hybridViewerStore = getHybridViewerStore();
  const dataStore = useDataStore();

  async function refresh(
    item: DataItem,
    { binary_light_viewable }: { binary_light_viewable?: string },
  ): Promise<void> {
    // The local actor is rebuilt from the stored light viewable: store the moved one first
    if (binary_light_viewable !== undefined) {
      await dataStore.updateItem(item.id, { binary_light_viewable });
    }
    await reloadObject(item.id);
    await hybridViewerStore.focusCameraOnObject(item.id);
  }

  async function convertCrs(item: DataItem, crs: CRSList): Promise<void> {
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.convert_geographic,
      params: { id: item.id, ...crs },
    });
    await refresh(item, response);
  }

  async function alignCrs(
    item: DataItem,
    sourcePoints: CrsPoint[],
    targetPoints: CrsPoint[],
    crs: CRSList,
  ): Promise<void> {
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.align,
      params: { id: item.id, source_points: sourcePoints, target_points: targetPoints, ...crs },
    });
    await refresh(item, response);
  }

  return { convertCrs, alignCrs };
}

export type { CrsPoint };
export { useCrs };
