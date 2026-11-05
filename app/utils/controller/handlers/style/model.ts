// Third party imports
import type { DataItem } from "@ogw_front/stores/data";
import type { RGBAColor } from "@ogw_front/utils/default_styles/constants";

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
import { hexToRgba } from "@vease/utils/controller/color";
import { setDataVisibility } from "@vease/utils/data_actions";

type ComponentSetter<Value> = (
  store: StyleStore,
  id: string,
  componentIds: string[],
  value: Value,
) => Promise<unknown>;

interface ModelComponentSetters {
  visibility: ComponentSetter<boolean>;
  color: ComponentSetter<RGBAColor>;
  coloring: ComponentSetter<"constant" | "random">;
}

/* oxlint-disable typescript/promise-function-async -- thin forwards to the store setters, which are already async */
const MODEL_COMPONENT_SETTERS: Record<ModelComponentTarget, ModelComponentSetters> = {
  corners: {
    visibility: (store, id, ids, value) => store.setModelCornersVisibility(id, ids, value),
    color: (store, id, ids, value) => store.setModelCornersColor(id, ids, value, "constant"),
    coloring: (store, id, ids, value) => store.setModelCornersActiveColoring(id, ids, value),
  },
  lines: {
    visibility: (store, id, ids, value) => store.setModelLinesVisibility(id, ids, value),
    color: (store, id, ids, value) => store.setModelLinesColor(id, ids, value, "constant"),
    coloring: (store, id, ids, value) => store.setModelLinesActiveColoring(id, ids, value),
  },
  surfaces: {
    visibility: (store, id, ids, value) => store.setModelSurfacesVisibility(id, ids, value),
    color: (store, id, ids, value) => store.setModelSurfacesColor(id, ids, value, "constant"),
    coloring: (store, id, ids, value) => store.setModelSurfacesActiveColoring(id, ids, value),
  },
  blocks: {
    visibility: (store, id, ids, value) => store.setModelBlocksVisibility(id, ids, value),
    color: (store, id, ids, value) => store.setModelBlocksColor(id, ids, value, "constant"),
    coloring: (store, id, ids, value) => store.setModelBlocksActiveColoring(id, ids, value),
  },
};
/* oxlint-enable typescript/promise-function-async */

interface ComponentParams {
  ids: string[];
  componentIds?: string[];
}

// Without componentIds every component of the target type is styled
async function targetComponents(
  item: DataItem,
  target: ModelComponentTarget,
  { ids, componentIds }: ComponentParams,
): Promise<string[]> {
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
        await setters.visibility(store, item.id, components, params.visibility);
      },
    ),
    [`style/model/${target}/color`]: styleCommand(
      async (store, item, params: ComponentParams & { color: string }) => {
        const components = await targetComponents(item, target, params);
        await setters.color(store, item.id, components, hexToRgba(params.color));
      },
    ),
    [`style/model/${target}/coloring`]: styleCommand(
      async (store, item, params: ComponentParams & { coloring: "constant" | "random" }) => {
        const components = await targetComponents(item, target, params);
        await setters.coloring(store, item.id, components, params.coloring);
      },
    ),
  };
}

const MODEL_STYLE_COMMANDS: Record<string, ControllerHandler> = {
  // The whole model visibility also shows or hides it in the data tree
  "style/model/visibility": styleCommand(
    async (_store, item, { visibility }: { visibility: boolean }) => {
      checkModel(item);
      await setDataVisibility(item.id, visibility);
    },
  ),
  "style/model/points/visibility": styleCommand(
    async (store, item, { visibility }: { visibility: boolean }) => {
      checkModel(item);
      await store.setModelPointsVisibility(item.id, visibility);
    },
  ),
  "style/model/points/size": styleCommand(async (store, item, { size }: { size: number }) => {
    checkModel(item);
    await store.setModelPointsSize(item.id, size);
  }),
  "style/model/edges/visibility": styleCommand(
    async (store, item, { visibility }: { visibility: boolean }) => {
      checkModel(item);
      await store.setModelEdgesVisibility(item.id, visibility);
    },
  ),
  ...Object.fromEntries(
    MODEL_COMPONENT_TARGETS.flatMap((target) => Object.entries(componentCommands(target))),
  ),
};

export { MODEL_STYLE_COMMANDS };
