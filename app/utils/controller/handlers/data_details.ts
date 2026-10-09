// Third party imports
import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { consola } from "consola";
import { getAttributeRange } from "@ogw_front/utils/attributes";

// Local imports
import {
  type AttributeKind,
  type BackAttribute,
  MODEL_COMPONENT_KINDS,
  MODEL_COMPONENT_TYPE,
  type ModelComponentTarget,
  type ModelWholeTarget,
  fetchAttributes,
  getDataItem,
  meshAttributeKinds,
  meshTargetsOf,
} from "@vease/utils/controller/targets";
import { ControllerError } from "@vease/utils/controller/errors";
import { getDataStyleStore } from "@vease/utils/external_stores";

interface AttributeSummary {
  target: string;
  location: AttributeKind;
  name: string;
  nb_items: number;
  min: number;
  max: number;
  time_steps?: number[];
}

interface ComponentSummary {
  geode_id: string;
  name: string;
  type: string;
}

interface TargetsDescription {
  targets: string[];
  components?: ComponentSummary[];
  attributes: AttributeSummary[];
}

const MODEL_WHOLE_TARGETS: ModelWholeTarget[] = ["points", "edges"];
const MODEL_COMPONENT_TARGETS: ModelComponentTarget[] = ["corners", "lines", "surfaces", "blocks"];

function isDetailsParams(params: unknown): params is { id: string } {
  return (
    typeof params === "object" && params !== null && "id" in params && typeof params.id === "string"
  );
}

function summarizeAttribute(
  target: string,
  location: AttributeKind,
  attribute: BackAttribute,
): AttributeSummary {
  const { min, max } = getAttributeRange(attribute, 0);
  const { attribute_name: name, nb_items, time_steps } = attribute;
  const summary: AttributeSummary = { target, location, name, nb_items, min, max };
  if (time_steps !== undefined && time_steps.length > 0) {
    summary.time_steps = time_steps;
  }
  return summary;
}

function settledAttributes(
  result: PromiseSettledResult<BackAttribute[]> | undefined,
  id: string,
  kind: AttributeKind,
): BackAttribute[] {
  if (result?.status === "fulfilled") {
    return result.value;
  }
  consola.warn(`[CONTROLLER] ${kind} attributes of ${id} are unavailable`, result?.reason);
  return [];
}

async function describeMesh({ id, geode_object_type }: DataItem): Promise<TargetsDescription> {
  const targets = meshTargetsOf(id);
  const kinds = [
    ...new Set(targets.flatMap((target) => meshAttributeKinds(geode_object_type, target))),
  ];
  const results = await Promise.allSettled(
    kinds.map(async (kind) => {
      const attributes = await fetchAttributes(id, kind);
      return attributes;
    }),
  );
  const attributesByKind = new Map(
    kinds.map((kind, index) => [kind, settledAttributes(results[index], id, kind)] as const),
  );
  const attributes = targets.flatMap((target) =>
    meshAttributeKinds(geode_object_type, target).flatMap((kind) =>
      (attributesByKind.get(kind) ?? []).map((attribute) =>
        summarizeAttribute(target, kind, attribute),
      ),
    ),
  );
  return { targets, attributes };
}

async function describeModel(id: string): Promise<TargetsDescription> {
  const meshComponents = await useDataStore().getAllMeshComponents(id);
  const components = meshComponents.map(({ geode_id, title, category }) => ({
    geode_id,
    name: title,
    type: category,
  }));
  const componentTargets = MODEL_COMPONENT_TARGETS.map((target) => ({
    target,
    geodeIds: components
      .filter(({ type }) => type === MODEL_COMPONENT_TYPE[target])
      .map(({ geode_id }) => geode_id),
  })).filter(({ geodeIds }) => geodeIds.length > 0);
  const requests = componentTargets.flatMap(({ target, geodeIds }) =>
    MODEL_COMPONENT_KINDS[target].map((kind) => ({ target, kind, geodeIds })),
  );
  const results = await Promise.allSettled(
    requests.map(async ({ kind, geodeIds }) => {
      const attributes = await fetchAttributes(id, kind, geodeIds);
      return attributes;
    }),
  );
  const attributeLists = requests.map(({ target, kind }, index) =>
    settledAttributes(results[index], id, kind).map((attribute) =>
      summarizeAttribute(target, kind, attribute),
    ),
  );
  return {
    targets: [...MODEL_WHOLE_TARGETS, ...componentTargets.map(({ target }) => target)],
    components,
    attributes: attributeLists.flat(),
  };
}

async function dataDetails(params: unknown): Promise<unknown> {
  if (!isDetailsParams(params)) {
    throw new ControllerError("data-details expects the id of a loaded data");
  }
  const item = await getDataItem(params.id);
  const { id, name, geode_object_type, viewer_type } = item;
  const description = viewer_type === "model" ? await describeModel(id) : await describeMesh(item);
  return {
    id,
    name,
    geode_object_type,
    viewer_type,
    ...description,
    style: getDataStyleStore().getStyle(id),
  };
}

export { dataDetails };
