// Third party imports
import type { DataItem } from "@ogw_front/stores/data";

// Local imports
import { type MeshElement, getDataItem, meshTargetsOf } from "@vease/utils/controller/targets";
import { forEachData, withFailed } from "@vease/utils/controller/for_each_data";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { ControllerError } from "@vease/utils/controller/errors";
import type { ControllerHandler } from "@vease/utils/controller/index";

type StyleStore = ReturnType<typeof getDataStyleStore>;
// Each style command declares its own params, validated by its route schema
type StyleApply = (store: StyleStore, item: DataItem, params: never) => Promise<unknown>;

// Styles every id of the request, renders once and reports the ids that failed
function styleCommand(apply: StyleApply): ControllerHandler {
  return async (params) => {
    // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
    const request = params as { ids: string[] };
    const store = getDataStyleStore();
    const { ids, failed } = await forEachData(request.ids, async (dataId) => {
      const item = await getDataItem(dataId);
      // oxlint-disable-next-line no-unsafe-type-assertion -- the apply of a command takes its route params
      await apply(store, item, request as never);
    });
    await getHybridViewerStore().remoteRender();
    return withFailed({ ids }, failed);
  };
}

function checkMesh(item: DataItem, element?: MeshElement): void {
  if (item.viewer_type === "model") {
    throw new ControllerError(`"${item.name}" is a model; use the style/model routes`);
  }
  const available = meshTargetsOf(item.data_id);
  if (element !== undefined && !available.includes(element)) {
    throw new ControllerError(
      `"${element}" is not available on "${item.name}"; available: ${available.join(", ")}`,
    );
  }
}

function checkModel(item: DataItem): void {
  if (item.viewer_type !== "model") {
    throw new ControllerError(`"${item.name}" is a mesh; use the style/mesh routes`);
  }
}

export { type StyleStore, checkMesh, checkModel, styleCommand };
