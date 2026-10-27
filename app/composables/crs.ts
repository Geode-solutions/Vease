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
  // Data sharing the local frame of the aligned item: aligned in the same request
  linkedItems?: Pick<DataItem, "id">[];
}

// Only set without distortion: the affine alignment has no single scale or rotation
interface AlignResult {
  scale?: number;
  rotation?: number;
}

// Converting or aligning rewrites the data coordinates: the viewer object is reloaded and the camera moved to it
// oxlint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types, max-lines-per-function
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

  // Each reload rebuilds an actor: one after another, then the camera moves once on the item
  async function refreshLinked(
    linked: { id: string; binary_light_viewable?: string; crs?: CRSList }[] | undefined,
  ): Promise<void> {
    for (const entry of linked ?? []) {
      // oxlint-disable-next-line no-await-in-loop
      await refresh({ id: entry.id }, entry, false);
    }
  }

  async function convertCrs(
    item: Pick<DataItem, "id">,
    crs: CRSList,
    {
      focus = true,
      linkedItems = [],
    }: { focus?: boolean; linkedItems?: Pick<DataItem, "id">[] } = {},
  ): Promise<void> {
    const linkedIds = linkedItems.map(({ id }) => id);
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.convert_geographic,
      params: { id: item.id, ...(linkedIds.length > 0 ? { linked_ids: linkedIds } : {}), ...crs },
    });
    await refreshLinked(response.linked);
    await refresh(item, response, focus);
  }

  async function alignCrs(
    item: DataItem,
    crs: CRSList,
    { sourcePoints, targetPoints, mode, linkedItems = [] }: Alignment,
  ): Promise<AlignResult> {
    const linkedIds = linkedItems.map(({ id }) => id);
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.align,
      params: {
        id: item.id,
        source_points: sourcePoints,
        target_points: targetPoints,
        mode,
        ...(linkedIds.length > 0 ? { linked_ids: linkedIds } : {}),
        ...crs,
      },
    });
    await refreshLinked(response.linked);
    await refresh(item, response);
    return { scale: response.scale, rotation: response.rotation };
  }

  return { convertCrs, alignCrs };
}

export type { AlignMode, AlignResult, Alignment, CrsPoint };
export { useCrs };
