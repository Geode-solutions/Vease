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
  // Source points only: picked on the displayed data rather than typed
  picked?: boolean;
}

type AlignMode = "similarity" | "affine";

interface Alignment {
  sourcePoints: CrsPoint[];
  targetPoints: CrsPoint[];
  mode: AlignMode;
}

// Only set without distortion: the affine alignment has no single scale or rotation
interface AlignResult {
  scale?: number;
  rotation?: number;
}

// Converting or aligning rewrites the data coordinates: the viewer object is reloaded and the camera moved to it
// oxlint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types
function useCrs() {
  const backStore = getBackStore();
  const hybridViewerStore = getHybridViewerStore();
  const dataStore = useDataStore();

  async function refresh(
    item: Pick<DataItem, "id">,
    { binary_light_viewable, crs }: { binary_light_viewable?: string; crs?: CRSList },
    focus = true,
  ): Promise<void> {
    // The local actor is rebuilt from the stored light viewable: store the moved one first
    await dataStore.updateItem(item.id, { binary_light_viewable, crs });
    await reloadObject(item.id, { rebuildActor: true });
    if (focus) {
      await hybridViewerStore.focusCameraOnObject(item.id);
    }
  }

  async function convertCrs(
    item: Pick<DataItem, "id">,
    crs: CRSList,
    { focus = true }: { focus?: boolean } = {},
  ): Promise<void> {
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.convert_geographic,
      params: { id: item.id, ...crs },
    });
    await refresh(item, response, focus);
  }

  async function alignCrs(
    item: DataItem,
    crs: CRSList,
    { sourcePoints, targetPoints, mode }: Alignment,
  ): Promise<AlignResult> {
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.align,
      params: {
        id: item.id,
        source_points: sourcePoints,
        target_points: targetPoints,
        mode,
        ...crs,
      },
    });
    await refresh(item, response);
    return { scale: response.scale, rotation: response.rotation };
  }

  return { convertCrs, alignCrs };
}

export type { AlignMode, AlignResult, Alignment, CrsPoint };
export { useCrs };
