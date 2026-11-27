// Third party imports
import type { ColorRGBA, PointSize } from "@geode/opengeodeweb-viewer/schema_types";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { DataItem } from "@ogw_front/stores/data";

// Local imports
import {
  MODEL_COMPONENT_TARGETS,
  type ModelComponentTarget,
  checkComponentIdsOwner,
  resolveComponentIds,
} from "@vease/utils/controller/targets";
import {
  type StyleStore,
  checkModel,
  styleCommand,
} from "@vease/utils/controller/handlers/style/common";
import type { ControllerHandler } from "@vease/utils/controller/index";
import type { CssColor } from "@ogw_front/types/ui";
import type { ModelComponentId } from "@ogw_front/types/identifiers";
import { hexToRgba } from "@vease/utils/controller/color";
import { setDataVisibility } from "@vease/utils/data_actions";

type ComponentSetter<Value> = (
  store: StyleStore,
  modelId: DataId,
  componentIds: ModelComponentId[],
  value: Value,
) => Promise<unknown>;

interface ModelComponentSetters {
  visibility: ComponentSetter<boolean>;
  color: ComponentSetter<ColorRGBA>;
  coloring: ComponentSetter<"constant" | "random">;
}

/* oxlint-disable typescript/promise-function-async -- thin forwards to the store setters, which are already async */
const MODEL_COMPONENT_SETTERS: Record<ModelComponentTarget, ModelComponentSetters> = {
  corners: {
    visibility: (store, modelId, ids, value) =>
      store.setModelCornersVisibility(modelId, ids, value),
    color: (store, modelId, ids, value) =>
      store.setModelCornersColor(modelId, ids, value, "constant"),
    coloring: (store, modelId, ids, value) =>
      store.setModelCornersActiveColoring(modelId, ids, value),
  },
  lines: {
    visibility: (store, modelId, ids, value) => store.setModelLinesVisibility(modelId, ids, value),
    color: (store, modelId, ids, value) =>
      store.setModelLinesColor(modelId, ids, value, "constant"),
    coloring: (store, modelId, ids, value) =>
      store.setModelLinesActiveColoring(modelId, ids, value),
  },
  surfaces: {
    visibility: (store, modelId, ids, value) =>
      store.setModelSurfacesVisibility(modelId, ids, value),
    color: (store, modelId, ids, value) =>
      store.setModelSurfacesColor(modelId, ids, value, "constant"),
    coloring: (store, modelId, ids, value) =>
      store.setModelSurfacesActiveColoring(modelId, ids, value),
  },
  blocks: {
    visibility: (store, modelId, ids, value) => store.setModelBlocksVisibility(modelId, ids, value),
    color: (store, modelId, ids, value) =>
      store.setModelBlocksColor(modelId, ids, value, "constant"),
    coloring: (store, modelId, ids, value) =>
      store.setModelBlocksActiveColoring(modelId, ids, value),
  },
};
/* oxlint-enable typescript/promise-function-async */

interface ComponentParams {
  ids: DataId[];
  componentIds?: ModelComponentId[];
}

// Without componentIds every component of the target type is styled
async function targetComponents(
  item: DataItem,
  target: ModelComponentTarget,
  { ids, componentIds }: ComponentParams,
): Promise<ModelComponentId[]> {
  checkModel(item);
  checkComponentIdsOwner(ids, componentIds);
  const resolved = await resolveComponentIds(item, target, componentIds);
  return resolved;
}

function componentCommands(target: ModelComponentTarget): Record<string, ControllerHandler> {
  const setters = MODEL_COMPONENT_SETTERS[target];
  return {
    [`style/model/${target}/visibility`]: styleCommand(
      async (store, item, params: ComponentParams & { visibility: boolean }) => {
        const components = await targetComponents(item, target, params);
        await setters.visibility(store, item.data_id, components, params.visibility);
      },
    ),
    [`style/model/${target}/color`]: styleCommand(
      async (store, item, params: ComponentParams & { color: CssColor }) => {
        const components = await targetComponents(item, target, params);
        await setters.color(store, item.data_id, components, hexToRgba(params.color));
      },
    ),
    [`style/model/${target}/coloring`]: styleCommand(
      async (store, item, params: ComponentParams & { coloring: "constant" | "random" }) => {
        const components = await targetComponents(item, target, params);
        await setters.coloring(store, item.data_id, components, params.coloring);
      },
    ),
  };
}

const MODEL_STYLE_COMMANDS: Record<string, ControllerHandler> = {
  // The whole model visibility also shows or hides it in the data tree
  "style/model/visibility": styleCommand(
    async (_store, item, { visibility }: { visibility: boolean }) => {
      checkModel(item);
      await setDataVisibility(item.data_id, visibility);
    },
  ),
  "style/model/points/visibility": styleCommand(
    async (store, item, { visibility }: { visibility: boolean }) => {
      checkModel(item);
      await store.setModelPointsVisibility(item.data_id, visibility);
    },
  ),
  "style/model/points/size": styleCommand(async (store, item, { size }: { size: PointSize }) => {
    checkModel(item);
    await store.setModelPointsSize(item.data_id, size);
  }),
  "style/model/edges/visibility": styleCommand(
    async (store, item, { visibility }: { visibility: boolean }) => {
      checkModel(item);
      await store.setModelEdgesVisibility(item.data_id, visibility);
    },
  ),
  ...Object.fromEntries(
    MODEL_COMPONENT_TARGETS.flatMap((target) => Object.entries(componentCommands(target))),
  ),
};

export { MODEL_STYLE_COMMANDS };
