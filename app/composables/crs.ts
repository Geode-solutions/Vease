import back_schemas, {
  type CRSList,
} from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { formatCrsCode, sameCrs } from "@ogw_front/utils/crs";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import type { DataItem } from "@vease/types/data_item";
import { reloadObject } from "@ogw_front/utils/import_workflow";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useDataStore } from "@ogw_front/stores/data";
import { useFeedbackStore } from "@ogw_front/stores/feedback";

interface CrsPoint {
  x: number;
  y: number;
  // Source points only: picked on the displayed data rather than typed
  picked?: boolean;
}

interface Alignment {
  sourcePoints: CrsPoint[];
  targetPoints: CrsPoint[];
  // Data sharing the local frame of the aligned item: aligned in the same request
  linkedItems?: Pick<DataItem, "id">[];
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
      params: { id: item.id, ...(linkedIds.length > 0 && { linked_ids: linkedIds }), ...crs },
    });
    await refreshLinked(response.linked);
    await refresh(item, response, focus);
  }

  async function alignCrs(
    item: DataItem,
    crs: CRSList,
    { sourcePoints, targetPoints, linkedItems = [] }: Alignment,
  ): Promise<void> {
    const linkedIds = linkedItems.map(({ id }) => id);
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.align,
      params: {
        id: item.id,
        source_points: sourcePoints,
        target_points: targetPoints,
        ...(linkedIds.length > 0 && { linked_ids: linkedIds }),
        ...crs,
      },
    });
    await refreshLinked(response.linked);
    await refresh(item, response);
  }

  // One request moves every georeferenced data, from its own CRS: all or nothing. The data without
  // CRS keep none. The project CRS only changes once the back accepted the conversion
  async function changeProjectCrs(crs: CRSList): Promise<void> {
    const crsStore = useCrsStore();
    const items = crsStore.crsItems;
    const moved = items.filter((item) => item.crs !== undefined && !sameCrs(item.crs, crs));
    const [first, ...linkedItems] = moved;
    if (first !== undefined) {
      await convertCrs(first, crs, { focus: false, linkedItems });
    }
    crsStore.setProjectCrs(crs);
  }

  // Data placed in another CRS than the project are converted to it, in one request.
  // The project may already have followed them: callers pass the project CRS taken before.
  // A refused conversion keeps their CRS and the project one: the warning points to their dialog
  async function followProject(
    entries: { id: string; name: string; crs: CRSList }[],
    project: CRSList | undefined = useCrsStore().projectCrs,
  ): Promise<void> {
    const crsStore = useCrsStore();
    if (project === undefined) {
      return;
    }
    const moved = entries.filter((entry) => !sameCrs(entry.crs, project));
    const [first, ...linkedItems] = moved;
    if (first === undefined) {
      return;
    }
    try {
      await convertCrs(first, project, { focus: false, linkedItems });
    } catch {
      crsStore.setProjectCrs(project);
      const names = moved.map(({ name }) => name).join(", ");
      const warning = `Cannot convert ${names} to ${formatCrsCode(project)}. Check its CRS (Assign) or georeference it.`;
      if (moved.length === 1) {
        useFeedbackStore().add_warning(warning, {
          label: "Edit CRS",
          onClick: (): void => {
            crsStore.requestCrsEdit(first.id);
          },
        });
      } else {
        useFeedbackStore().add_warning(warning);
      }
    }
  }

  return { convertCrs, alignCrs, changeProjectCrs, followProject };
}

export type { Alignment, CrsPoint };
export { useCrs };
