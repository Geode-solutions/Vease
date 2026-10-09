// Third party imports
import type { DataItem } from "@ogw_front/stores/data";
import type { RGBAColor } from "@ogw_front/utils/default_styles/constants";

// Local imports
import {
  MODEL_COMPONENT_TARGETS,
  type MeshElement,
  type ModelComponentTarget,
  getDataItem,
  isModelComponentTarget,
  meshTargetsOf,
  resolveComponentIds,
} from "@vease/utils/controller/targets";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { ControllerError } from "@vease/utils/controller/errors";
import { hexToRgba } from "@vease/utils/controller/color";
import { setDataVisibility } from "@vease/utils/data_actions";

type Coloring = "constant" | "random" | "textures";
type StyleStore = ReturnType<typeof getDataStyleStore>;
type Setter<Value> = (store: StyleStore, id: string, value: Value) => Promise<unknown>;
type ComponentSetter<Value> = (
  store: StyleStore,
  id: string,
  componentIds: string[],
  value: Value,
) => Promise<unknown>;

interface SetStyleParams {
  id: string;
  target?: MeshElement | ModelComponentTarget;
  componentIds?: string[];
  visibility?: boolean;
  color?: string;
  size?: number;
  width?: number;
  coloring?: Coloring;
}

interface MeshElementSetters {
  visibility: Setter<boolean>;
  color: Setter<RGBAColor>;
  coloring: Setter<"constant" | "textures">;
  texturesAllowed: boolean;
}

interface ModelComponentSetters {
  visibility: ComponentSetter<boolean>;
  color: ComponentSetter<RGBAColor>;
  coloring: ComponentSetter<"constant" | "random">;
}

/* oxlint-disable typescript/promise-function-async -- thin forwards to the store setters, which are already async */
const MESH_ELEMENT_SETTERS: Record<MeshElement, MeshElementSetters> = {
  points: {
    visibility: (store, id, value) => store.setMeshPointsVisibility(id, value),
    color: (store, id, value) => store.setMeshPointsColor(id, value),
    coloring: (store, id) => store.setMeshPointsActiveColoring(id, "constant"),
    texturesAllowed: false,
  },
  edges: {
    visibility: (store, id, value) => store.setMeshEdgesVisibility(id, value),
    color: (store, id, value) => store.setMeshEdgesColor(id, value),
    coloring: (store, id) => store.setMeshEdgesActiveColoring(id, "constant"),
    texturesAllowed: false,
  },
  cells: {
    visibility: (store, id, value) => store.setMeshCellsVisibility(id, value),
    color: (store, id, value) => store.setMeshCellsColor(id, value),
    coloring: (store, id, value) => store.setMeshCellsActiveColoring(id, value),
    texturesAllowed: true,
  },
  polygons: {
    visibility: (store, id, value) => store.setMeshPolygonsVisibility(id, value),
    color: (store, id, value) => store.setMeshPolygonsColor(id, value),
    coloring: (store, id, value) => store.setMeshPolygonsActiveColoring(id, value),
    texturesAllowed: true,
  },
  polyhedra: {
    visibility: (store, id, value) => store.setMeshPolyhedraVisibility(id, value),
    color: (store, id, value) => store.setMeshPolyhedraColor(id, value),
    coloring: (store, id) => store.setMeshPolyhedraActiveColoring(id, "constant"),
    texturesAllowed: false,
  },
};

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

function isMeshElement(target: string): target is MeshElement {
  return Object.hasOwn(MESH_ELEMENT_SETTERS, target);
}

function rejectUnsupported(
  params: SetStyleParams,
  supported: (keyof SetStyleParams)[],
  scope: string,
): void {
  const unsupported = (["visibility", "color", "size", "width", "coloring"] as const).filter(
    (property) => params[property] !== undefined && !supported.includes(property),
  );
  if (unsupported.length > 0) {
    throw new ControllerError(`${unsupported.join(", ")} cannot be set on ${scope}`);
  }
}

function appliedProperties(params: SetStyleParams): string[] {
  return (["visibility", "color", "size", "width", "coloring"] as const).filter(
    (property) => params[property] !== undefined,
  );
}

async function styleWholeMesh(
  params: SetStyleParams,
  store: StyleStore,
  name: string,
): Promise<void> {
  const { id, visibility, color } = params;
  rejectUnsupported(params, ["visibility", "color"], `the whole mesh "${name}"`);
  if (visibility !== undefined) {
    await setDataVisibility(id, visibility);
  }
  if (color !== undefined) {
    await store.setMeshColor(id, hexToRgba(color));
  }
}

async function styleMeshElement(
  params: SetStyleParams,
  store: StyleStore,
  target: MeshElement,
): Promise<void> {
  const { id, visibility, color, size, width, coloring } = params;
  const supported: (keyof SetStyleParams)[] = ["visibility", "color", "coloring"];
  if (target === "points") {
    supported.push("size");
  }
  if (target === "edges") {
    supported.push("width");
  }
  rejectUnsupported(params, supported, `mesh ${target}`);
  const setters = MESH_ELEMENT_SETTERS[target];
  if (coloring === "random" || (coloring === "textures" && !setters.texturesAllowed)) {
    throw new ControllerError(`coloring "${coloring}" cannot be set on mesh ${target}`);
  }
  if (visibility !== undefined) {
    await setters.visibility(store, id, visibility);
  }
  if (color !== undefined) {
    await setters.color(store, id, hexToRgba(color));
  }
  if (coloring !== undefined || color !== undefined) {
    await setters.coloring(store, id, coloring === "textures" ? "textures" : "constant");
  }
  if (size !== undefined) {
    await store.setMeshPointsSize(id, size);
  }
  if (width !== undefined) {
    await store.setMeshEdgesWidth(id, width);
  }
}

async function styleMesh(params: SetStyleParams, store: StyleStore, name: string): Promise<void> {
  const { id, target } = params;
  if (params.componentIds !== undefined) {
    throw new ControllerError(
      "componentIds only applies to model corners, lines, surfaces, blocks",
    );
  }
  if (target === undefined) {
    await styleWholeMesh(params, store, name);
    return;
  }
  const available = meshTargetsOf(id);
  if (!isMeshElement(target) || !available.includes(target)) {
    throw new ControllerError(
      `"${target}" is not available on "${name}"; available: ${available.join(", ")}`,
    );
  }
  await styleMeshElement(params, store, target);
}

async function styleWholeModel(params: SetStyleParams): Promise<void> {
  const { id, visibility } = params;
  const onlyVisibility = appliedProperties(params).every((property) => property === "visibility");
  if (visibility === undefined || !onlyVisibility) {
    throw new ControllerError(
      "Give a target to style a model: points, edges, corners, lines, surfaces or blocks",
    );
  }
  await setDataVisibility(id, visibility);
}

async function styleModelPointsOrEdges(
  params: SetStyleParams,
  store: StyleStore,
  target: "points" | "edges",
): Promise<void> {
  const { id, componentIds, visibility, size } = params;
  if (componentIds !== undefined) {
    throw new ControllerError(`componentIds does not apply to model ${target}`);
  }
  rejectUnsupported(
    params,
    target === "points" ? ["visibility", "size"] : ["visibility"],
    `model ${target}`,
  );
  if (visibility !== undefined) {
    await (target === "points"
      ? store.setModelPointsVisibility(id, visibility)
      : store.setModelEdgesVisibility(id, visibility));
  }
  if (size !== undefined) {
    await store.setModelPointsSize(id, size);
  }
}

async function styleModelComponents(
  params: SetStyleParams,
  store: StyleStore,
  target: ModelComponentTarget,
  item: DataItem,
): Promise<void> {
  const { id, componentIds, visibility, color, coloring } = params;
  rejectUnsupported(params, ["visibility", "color", "coloring"], `model ${target}`);
  if (coloring === "textures") {
    throw new ControllerError(`coloring "textures" cannot be set on model ${target}`);
  }
  const setters = MODEL_COMPONENT_SETTERS[target];
  const ids = await resolveComponentIds(item, target, componentIds);
  if (visibility !== undefined) {
    await setters.visibility(store, id, ids, visibility);
  }
  if (color !== undefined) {
    await setters.color(store, id, ids, hexToRgba(color));
  }
  if (coloring !== undefined) {
    await setters.coloring(store, id, ids, coloring);
  }
}

async function styleModel(
  params: SetStyleParams,
  store: StyleStore,
  item: DataItem,
): Promise<void> {
  const { target } = params;
  if (target === undefined) {
    await styleWholeModel(params);
  } else if (target === "points" || target === "edges") {
    await styleModelPointsOrEdges(params, store, target);
  } else if (isModelComponentTarget(target)) {
    await styleModelComponents(params, store, target, item);
  } else {
    throw new ControllerError(
      `"${target}" is not a model target; use points, edges, ${MODEL_COMPONENT_TARGETS.join(", ")}`,
    );
  }
}

async function setStyle(params: unknown): Promise<{ id: string; applied: string[] }> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const style = params as SetStyleParams;
  const applied = appliedProperties(style);
  if (applied.length === 0) {
    throw new ControllerError("Nothing to change: give visibility, color, size, width or coloring");
  }
  const item = await getDataItem(style.id);
  const store = getDataStyleStore();
  await (item.viewer_type === "model"
    ? styleModel(style, store, item)
    : styleMesh(style, store, item.name));
  await getHybridViewerStore().remoteRender();
  return { id: style.id, applied };
}

export { setStyle };
