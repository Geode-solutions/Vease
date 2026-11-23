import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import type { AssignResponse } from "@vease/composables/crs_assign";
import type { CRS } from "@geode/opengeodeweb-back/schema_types";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { DataItem } from "@vease/types/data_item";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { formatCrsCode } from "@ogw_front/utils/crs";
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
  linkedItems?: Pick<DataItem, "data_id">[];
}

// Converting or aligning rewrites the data coordinates: the viewer object is reloaded and the camera moved to it
// oxlint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types, max-lines-per-function
function useCrs() {
  const backStore = getBackStore();
  const hybridViewerStore = getHybridViewerStore();
  const dataStore = useDataStore();

  async function refresh(
    item: Pick<DataItem, "data_id">,
    { binary_light_viewable, crs }: { binary_light_viewable?: string; crs?: CRS },
    focus = true,
  ): Promise<void> {
    // The local actor is rebuilt from the stored light viewable: store the moved one first
    await dataStore.updateItem(item.data_id, { binary_light_viewable });
    await reloadObject(item.data_id, { rebuildActor: true });
    // Only then the CRS: a basemap built for the new CRS reads the data bounds from the actors,
    // Which must no longer hold the previous coordinates
    await dataStore.updateItem(item.data_id, { crs });
    if (focus) {
      await hybridViewerStore.focusCameraOnObject(item.data_id);
    }
  }

  // Each reload rebuilds an actor: one after another, then the camera moves once on the item
  async function refreshLinked(
    linked: { id: string; binary_light_viewable?: string; crs?: CRS }[] | undefined,
  ): Promise<void> {
    for (const entry of linked ?? []) {
      // oxlint-disable-next-line no-await-in-loop
      await refresh({ data_id: entry.id }, entry, false);
    }
  }

  // PROJ has no geoid grid: a change of vertical datum leaves the heights as they are
  async function warnHeightsUnchanged(
    entries: { id: string; heights_unchanged?: boolean }[],
  ): Promise<void> {
    const ids = entries.filter((entry) => entry.heights_unchanged === true).map(({ id }) => id);
    if (ids.length === 0) {
      return;
    }
    const storedNames: string[] = [];
    for (const id of ids) {
      // oxlint-disable-next-line no-await-in-loop
      const stored = await dataStore.item(id);
      storedNames.push(stored.name);
    }
    const names = storedNames.join(", ");
    const keep = ids.length === 1 ? "keeps its heights" : "keep their heights";
    useFeedbackStore().add_warning(`Heights not converted: ${names} ${keep}`);
  }

  async function convertCrs(
    item: Pick<DataItem, "data_id">,
    crs: CRS,
    {
      focus = true,
      linkedItems = [],
    }: { focus?: boolean; linkedItems?: Pick<DataItem, "data_id">[] } = {},
  ): Promise<void> {
    const linkedIds = linkedItems.map(({ data_id }) => data_id);
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.convert_geographic,
      params: { id: item.data_id, ...(linkedIds.length > 0 && { linked_ids: linkedIds }), ...crs },
    });
    await refreshLinked(response.linked);
    await refresh(item, response, focus);
    await warnHeightsUnchanged([{ id: item.data_id, ...response }, ...(response.linked ?? [])]);
  }

  // Assigning only relabels the coordinates: nothing to reload, the stored CRS follows the back.
  // With onlyPlausible, data whose coordinates miss the CRS area are left as they are
  async function assignCrs(
    item: Pick<DataItem, "data_id">,
    crs: CRS,
    {
      linkedItems = [],
      onlyPlausible = false,
    }: { linkedItems?: Pick<DataItem, "data_id">[]; onlyPlausible?: boolean } = {},
  ): Promise<AssignResponse> {
    const linkedIds = linkedItems.map(({ data_id }) => data_id);
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.assign_geographic,
      params: {
        id: item.data_id,
        ...(linkedIds.length > 0 && { linked_ids: linkedIds }),
        ...(onlyPlausible && { only_plausible: true }),
        ...crs,
      },
    });
    for (const { id, crs: assigned } of [
      { id: item.data_id, ...response },
      ...(response.linked ?? []),
    ]) {
      if (assigned !== undefined) {
        // oxlint-disable-next-line no-await-in-loop
        await dataStore.updateItem(id, { crs: assigned });
      }
    }
    return response;
  }

  async function alignCrs(
    item: DataItem,
    crs: CRS,
    { sourcePoints, targetPoints, linkedItems = [] }: Alignment,
  ): Promise<void> {
    const linkedIds = linkedItems.map(({ data_id }) => data_id);
    const response = await backStore.request({
      schema: back_schemas.opengeodeweb_back.crs.align,
      params: {
        id: item.data_id,
        source_points: sourcePoints,
        target_points: targetPoints,
        ...(linkedIds.length > 0 && { linked_ids: linkedIds }),
        ...crs,
      },
    });
    await refreshLinked(response.linked);
    await refresh(item, response);
  }

  // One request moves every georeferenced data, from its own CRS: all or nothing.
  // Data without CRS are assigned afterwards, by useProjectCrs().adoptProjectCrs.
  // The project CRS only changes once the back accepted the conversion
  async function changeProjectCrs(crs: CRS): Promise<void> {
    const crsStore = useCrsStore();
    const items = crsStore.crsItems;
    // Heights are a label of each data: only the data placed elsewhere in X and Y move
    const moved = items.filter(
      (item) => item.crs !== undefined && !crsStore.sameProjectCrs(item.crs, crs),
    );
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
    entries: { data_id: DataId; name: string; crs: CRS }[],
    project: CRS | undefined = useCrsStore().projectCrs,
  ): Promise<void> {
    const crsStore = useCrsStore();
    if (project === undefined) {
      return;
    }
    const moved = entries.filter((entry) => !crsStore.sameProjectCrs(entry.crs, project));
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
            crsStore.requestCrsEdit(first.data_id);
          },
        });
      } else {
        useFeedbackStore().add_warning(warning);
      }
    }
  }

  return { assignCrs, convertCrs, alignCrs, changeProjectCrs, followProject };
}

export type { Alignment, CrsPoint };
export { useCrs };
