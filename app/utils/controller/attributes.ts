// Third party imports
import type { DataItem } from "@ogw_front/stores/data";
import { consola } from "consola";

// Local imports
import {
  type AttributeKind,
  type BackAttribute,
  MODEL_COMPONENT_KINDS,
  type MeshElement,
  type ModelComponentTarget,
  TARGET_PRIORITY,
  fetchAttributes,
  getDataItem,
  isModelComponentTarget,
  meshAttributeKinds,
  meshTargetsOf,
  modelComponentGeodeIds,
  resolveComponentIds,
} from "@vease/utils/controller/targets";
import { ControllerError, errorMessage } from "@vease/utils/controller/errors";

interface AttributeSource {
  target: MeshElement | ModelComponentTarget;
  kind: AttributeKind;
  componentIds?: string[];
}

interface SourceAttributes {
  source: AttributeSource;
  attributes: BackAttribute[];
}

interface FoundAttribute {
  target: MeshElement | ModelComponentTarget;
  kind: AttributeKind;
  attribute: BackAttribute;
  componentIds?: string[];
}

interface FindAttributeArgs {
  id: string;
  name: string;
  target?: string;
  location?: AttributeKind | AttributeKind[];
  componentIds?: string[];
}

function meshAttributeSources(geodeObjectType: string, targets: MeshElement[]): AttributeSource[] {
  return targets.flatMap((target) =>
    meshAttributeKinds(geodeObjectType, target).map((kind) => ({ target, kind })),
  );
}

function modelAttributeSources(
  target: ModelComponentTarget,
  componentIds: string[],
): AttributeSource[] {
  return MODEL_COMPONENT_KINDS[target].map((kind) => ({ target, kind, componentIds }));
}

function settledAttributes(
  result: PromiseSettledResult<BackAttribute[]> | undefined,
  id: string,
  kind: AttributeKind,
): BackAttribute[] {
  if (result?.status === "fulfilled") {
    return result.value;
  }
  consola.warn(
    `[CONTROLLER] ${kind} attributes of ${id} are unavailable`,
    errorMessage(result?.reason),
  );
  return [];
}

function requestKey({ kind, componentIds }: AttributeSource): string {
  return `${kind}|${componentIds?.join(",") ?? ""}`;
}

// Mesh elements share their vertex attributes: each kind and component set is requested once
async function fetchSourceAttributes(
  id: string,
  sources: AttributeSource[],
): Promise<SourceAttributes[]> {
  const requests = new Map(sources.map((source) => [requestKey(source), source] as const));
  const results = await Promise.allSettled(
    [...requests.values()].map(async ({ kind, componentIds }) => {
      const attributes = await fetchAttributes(id, kind, componentIds);
      return attributes;
    }),
  );
  const attributesByKey = new Map(
    [...requests.entries()].map(
      ([key, { kind }], index) => [key, settledAttributes(results[index], id, kind)] as const,
    ),
  );
  return sources.map((source) => ({
    source,
    attributes: attributesByKey.get(requestKey(source)) ?? [],
  }));
}

function meshSearchSources(
  item: DataItem,
  { target, componentIds }: FindAttributeArgs,
): AttributeSource[] {
  if (componentIds !== undefined) {
    throw new ControllerError(
      "componentIds only applies to model corners, lines, surfaces, blocks",
    );
  }
  const available = meshTargetsOf(item.id);
  if (target !== undefined && !available.some((element) => element === target)) {
    throw new ControllerError(
      `"${target}" is not available on "${item.name}"; available: ${available.join(", ")}`,
    );
  }
  const targets = TARGET_PRIORITY.mesh.filter((element) =>
    target === undefined ? available.includes(element) : element === target,
  );
  return meshAttributeSources(item.geode_object_type, targets);
}

async function modelSearchSources(
  item: DataItem,
  { target, componentIds }: FindAttributeArgs,
): Promise<AttributeSource[]> {
  if (target === undefined) {
    if (componentIds !== undefined) {
      throw new ControllerError("componentIds needs a target: corners, lines, surfaces or blocks");
    }
    const targets = await Promise.all(
      TARGET_PRIORITY.model.map(async (component) => ({
        component,
        ids: await modelComponentGeodeIds(item.id, component),
      })),
    );
    return targets.flatMap(({ component, ids }) =>
      ids.length > 0 ? modelAttributeSources(component, ids) : [],
    );
  }
  if (!isModelComponentTarget(target)) {
    throw new ControllerError(
      `Model attributes are on corners, lines, surfaces or blocks, not "${target}"`,
    );
  }
  return modelAttributeSources(target, await resolveComponentIds(item, target, componentIds));
}

// Elements sharing vertex attributes list them once, under the first element searched
function availableAttributes(sourceAttributes: SourceAttributes[]): string {
  const listed = new Set<string>();
  const groups = sourceAttributes
    .filter(({ source, attributes }) => {
      const key = requestKey(source);
      if (attributes.length === 0 || listed.has(key)) {
        return false;
      }
      listed.add(key);
      return true;
    })
    .map(
      ({ source, attributes }) =>
        `${source.target}/${source.kind}: ${[...new Set(attributes.map(({ attribute_name }) => attribute_name))].join(", ")}`,
    );
  return groups.length > 0 ? groups.join("; ") : "none";
}

function matchesLocation(
  location: AttributeKind | AttributeKind[] | undefined,
  kind: AttributeKind,
): boolean {
  if (location === undefined) {
    return true;
  }
  return Array.isArray(location) ? location.includes(kind) : location === kind;
}

function checkRange(minimum: number | undefined, maximum: number | undefined): void {
  if ((minimum === undefined) !== (maximum === undefined)) {
    throw new ControllerError("Give both minimum and maximum, or neither for the attribute range");
  }
  if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
    throw new ControllerError(
      `minimum (${minimum}) is greater than maximum (${maximum}); swap them or omit both for the attribute range`,
    );
  }
}

function resolveItem(item: number | undefined, attribute: BackAttribute): number {
  const resolved = item ?? 0;
  if (resolved >= attribute.nb_items) {
    throw new ControllerError(
      `item ${resolved} is out of range for "${attribute.attribute_name}" (nb_items ${attribute.nb_items})`,
    );
  }
  return resolved;
}

async function findAttribute(args: FindAttributeArgs): Promise<FoundAttribute> {
  const item = await getDataItem(args.id);
  const sources =
    item.viewer_type === "model"
      ? await modelSearchSources(item, args)
      : meshSearchSources(item, args);
  const sourceAttributes = await fetchSourceAttributes(item.id, sources);
  for (const { source, attributes } of sourceAttributes) {
    const attribute = attributes.find(({ attribute_name }) => attribute_name === args.name);
    if (attribute !== undefined && matchesLocation(args.location, source.kind)) {
      return { ...source, attribute };
    }
  }
  throw new ControllerError(
    `Attribute "${args.name}" not found on "${item.name}". Available: ${availableAttributes(sourceAttributes)}`,
  );
}

export {
  checkRange,
  fetchSourceAttributes,
  findAttribute,
  meshAttributeSources,
  modelAttributeSources,
  resolveItem,
};
export type { AttributeSource, FindAttributeArgs, FoundAttribute, SourceAttributes };
