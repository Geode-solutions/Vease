// Third party imports
import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { getAttributeRange } from "@ogw_front/utils/attributes";

// Local imports
import {
  type AttributeKind,
  type BackAttribute,
  MODEL_COMPONENT_TARGETS,
  MODEL_COMPONENT_TYPE,
  type ModelWholeTarget,
  getDataItem,
  meshTargetsOf,
} from "@vease/utils/controller/targets";
import {
  type SourceAttributes,
  fetchSourceAttributes,
  meshAttributeSources,
  modelAttributeSources,
} from "@vease/utils/controller/attributes";
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

function summarizeSources(sourceAttributes: SourceAttributes[]): AttributeSummary[] {
  return sourceAttributes.flatMap(({ source, attributes }) =>
    attributes.map((attribute) => summarizeAttribute(source.target, source.kind, attribute)),
  );
}

async function describeMesh({ id, geode_object_type }: DataItem): Promise<TargetsDescription> {
  const targets = meshTargetsOf(id);
  const sourceAttributes = await fetchSourceAttributes(
    id,
    meshAttributeSources(geode_object_type, targets),
  );
  return { targets, attributes: summarizeSources(sourceAttributes) };
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
  const sourceAttributes = await fetchSourceAttributes(
    id,
    componentTargets.flatMap(({ target, geodeIds }) => modelAttributeSources(target, geodeIds)),
  );
  return {
    targets: [...MODEL_WHOLE_TARGETS, ...componentTargets.map(({ target }) => target)],
    components,
    attributes: summarizeSources(sourceAttributes),
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
