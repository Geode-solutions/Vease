// Third party imports
import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { MESH_ELEMENT_KINDS as ELEMENT_KIND_BY_MESH_TYPE } from "@ogw_front/utils/attributes";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";

// Local imports
import { type ApiSchema, getBackStore, getDataStyleStore } from "@vease/utils/external_stores";
import { ControllerError } from "@vease/utils/controller/errors";

type MeshElement = "points" | "edges" | "cells" | "polygons" | "polyhedra";
type ModelComponentTarget = "corners" | "lines" | "surfaces" | "blocks";
type ModelWholeTarget = "points" | "edges";
type AttributeKind = "vertex" | "edge" | "cell" | "polygon" | "polyhedron";

interface BackAttribute {
  attribute_name: string;
  nb_items: number;
  min_value?: number;
  max_value?: number;
  min_values?: number[];
  max_values?: number[];
  no_data?: boolean;
  time_steps?: number[];
}

// Every kind an element can carry; a given mesh type only has some of them, so read them through meshAttributeKinds
const MESH_ELEMENT_ATTRIBUTE_KINDS: Readonly<Record<MeshElement, readonly AttributeKind[]>> = {
  points: ["vertex"],
  edges: ["edge", "vertex"],
  cells: ["cell", "vertex"],
  polygons: ["polygon", "vertex"],
  polyhedra: ["polyhedron", "vertex"],
};

const MODEL_COMPONENT_KINDS: Record<ModelComponentTarget, AttributeKind[]> = {
  corners: ["vertex"],
  lines: ["edge", "vertex"],
  surfaces: ["polygon", "vertex"],
  blocks: ["polyhedron", "vertex"],
};

const MODEL_COMPONENT_TYPE: Record<ModelComponentTarget, "Corner" | "Line" | "Surface" | "Block"> =
  {
    corners: "Corner",
    lines: "Line",
    surfaces: "Surface",
    blocks: "Block",
  };

const MODEL_COMPONENT_TARGETS: ModelComponentTarget[] = ["corners", "lines", "surfaces", "blocks"];

const TARGET_PRIORITY: { mesh: MeshElement[]; model: ModelComponentTarget[] } = {
  mesh: ["polyhedra", "cells", "polygons", "edges", "points"],
  model: ["blocks", "surfaces", "lines", "corners"],
};

const backSchemas = back_schemas.opengeodeweb_back;

const MESH_ATTRIBUTE_SCHEMAS: Record<AttributeKind, ApiSchema> = {
  vertex: backSchemas.vertex_attribute_names,
  edge: backSchemas.edge_attribute_names,
  cell: backSchemas.cell_attribute_names,
  polygon: backSchemas.polygon_attribute_names,
  polyhedron: backSchemas.polyhedron_attribute_names,
};

const MODEL_COMPONENT_ATTRIBUTE_SCHEMAS: Partial<Record<AttributeKind, ApiSchema>> = {
  vertex: backSchemas.model_component_vertex_attribute_names,
  edge: backSchemas.model_component_edge_attribute_names,
  polygon: backSchemas.model_component_polygon_attribute_names,
  polyhedron: backSchemas.model_component_polyhedron_attribute_names,
};

function isModelComponentTarget(target: string): target is ModelComponentTarget {
  return Object.hasOwn(MODEL_COMPONENT_TYPE, target);
}

function isMeshElement(key: string): key is MeshElement {
  return Object.hasOwn(MESH_ELEMENT_ATTRIBUTE_KINDS, key);
}

function meshTargetsOf(id: string): MeshElement[] {
  return Object.keys(getDataStyleStore().getStyle(id)).filter((key) => isMeshElement(key));
}

// The back rejects an element kind the mesh type does not have (e.g. edge attributes of a surface)
function meshAttributeKinds(geodeObjectType: string, target: MeshElement): AttributeKind[] {
  const elementKind = ELEMENT_KIND_BY_MESH_TYPE[geodeObjectType];
  return MESH_ELEMENT_ATTRIBUTE_KINDS[target].filter(
    (kind) => kind === "vertex" || kind === elementKind,
  );
}

async function modelComponentGeodeIds(
  modelId: string,
  target: ModelComponentTarget,
): Promise<string[]> {
  const geodeIds = await useDataStore().getMeshComponentGeodeIds(
    modelId,
    MODEL_COMPONENT_TYPE[target],
  );
  return geodeIds;
}

// Without target, the ids may be components of any type, as for a camera focus
async function resolveComponentIds(
  item: DataItem,
  target: ModelComponentTarget | undefined,
  componentIds: string[] | undefined,
): Promise<string[]> {
  const targets = target === undefined ? MODEL_COMPONENT_TARGETS : [target];
  const knownIds = await Promise.all(
    targets.map(async (component) => {
      const ids = await modelComponentGeodeIds(item.id, component);
      return ids;
    }),
  );
  const geodeIds = knownIds.flat();
  if (geodeIds.length === 0) {
    throw new ControllerError(`"${item.name}" has no ${target ?? "components"}`);
  }
  if (componentIds === undefined) {
    return geodeIds;
  }
  const unknownIds = componentIds.filter((componentId) => !geodeIds.includes(componentId));
  if (unknownIds.length > 0) {
    throw new ControllerError(
      `"${item.name}" has no ${target ?? "component"} with geode id ${unknownIds.join(", ")}; read vease://data/${item.id} for its components`,
    );
  }
  return componentIds;
}

async function getDataItem(id: string): Promise<DataItem> {
  try {
    return await useDataStore().item(id);
  } catch (error) {
    if (error instanceof Error && error.message === `Item not found: ${id}`) {
      throw new ControllerError(`No data with id "${id}"; read vease://data for the loaded data`);
    }
    throw error;
  }
}

function hasAttributes(response: unknown): response is { attributes: BackAttribute[] } {
  return (
    typeof response === "object" &&
    response !== null &&
    "attributes" in response &&
    Array.isArray(response.attributes)
  );
}

async function fetchAttributes(
  id: string,
  kind: AttributeKind,
  componentIds?: string[],
): Promise<BackAttribute[]> {
  const schema =
    componentIds === undefined
      ? MESH_ATTRIBUTE_SCHEMAS[kind]
      : MODEL_COMPONENT_ATTRIBUTE_SCHEMAS[kind];
  if (schema === undefined) {
    throw new ControllerError(`Model components have no ${kind} attributes`);
  }
  const params = componentIds === undefined ? { id } : { id, component_ids: componentIds };
  const response = await getBackStore().request({ schema, params });
  return hasAttributes(response) ? response.attributes : [];
}

export {
  MESH_ELEMENT_ATTRIBUTE_KINDS,
  MODEL_COMPONENT_KINDS,
  MODEL_COMPONENT_TARGETS,
  MODEL_COMPONENT_TYPE,
  TARGET_PRIORITY,
  fetchAttributes,
  getDataItem,
  isModelComponentTarget,
  meshAttributeKinds,
  meshTargetsOf,
  modelComponentGeodeIds,
  resolveComponentIds,
};
export type { AttributeKind, BackAttribute, MeshElement, ModelComponentTarget, ModelWholeTarget };
