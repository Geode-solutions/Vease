// Third party imports
import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { GeodeIdentified } from "@ogw_front/types/identifiers";
import type { GeodeImageType } from "@geode/opengeodeweb-microservice/data_types";
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

interface ComponentSummary extends GeodeIdentified {
  name: string;
  type: string;
}

interface TargetsDescription {
  targets: string[];
  components?: ComponentSummary[];
  attributes: AttributeSummary[];
}

interface ImageDescription extends TargetsDescription {
  dimension: number;
}

const MODEL_WHOLE_TARGETS: ModelWholeTarget[] = ["points", "edges"];

const IMAGE_DIMENSION: Record<GeodeImageType, number> = {
  RasterImage2D: 2,
  RasterImage3D: 3,
};

function isImageType(geodeObjectType: string): geodeObjectType is GeodeImageType {
  return Object.hasOwn(IMAGE_DIMENSION, geodeObjectType);
}

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

// An image is only styled as a whole and carries no attributes: the back is not asked for them
function describeImage({ name, geode_object_type }: DataItem): ImageDescription {
  if (!isImageType(geode_object_type)) {
    throw new ControllerError(`"${name}" is an image of unknown type ${geode_object_type}`);
  }
  return { dimension: IMAGE_DIMENSION[geode_object_type], targets: [], attributes: [] };
}

async function describeMesh({ data_id, geode_object_type }: DataItem): Promise<TargetsDescription> {
  const targets = meshTargetsOf(data_id);
  const sourceAttributes = await fetchSourceAttributes(
    data_id,
    meshAttributeSources(geode_object_type, targets),
  );
  return { targets, attributes: summarizeSources(sourceAttributes) };
}

async function describeModel(modelId: DataId): Promise<TargetsDescription> {
  const meshComponents = await useDataStore().getAllMeshComponents(modelId);
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
    modelId,
    componentTargets.flatMap(({ target, geodeIds }) => modelAttributeSources(target, geodeIds)),
  );
  return {
    targets: [...MODEL_WHOLE_TARGETS, ...componentTargets.map(({ target }) => target)],
    components,
    attributes: summarizeSources(sourceAttributes),
  };
}

async function describe(item: DataItem): Promise<TargetsDescription | ImageDescription> {
  if (item.viewer_object_type === "image") {
    return describeImage(item);
  }
  if (item.viewer_object_type === "mesh") {
    const description = await describeMesh(item);
    return description;
  }
  const description = await describeModel(item.data_id);
  return description;
}

async function dataDetails(params: unknown): Promise<unknown> {
  if (!isDetailsParams(params)) {
    throw new ControllerError("data-details expects the id of a loaded data");
  }
  const item = await getDataItem(params.id);
  const { data_id, name, geode_object_type, viewer_object_type } = item;
  const description = await describe(item);
  return {
    id: data_id,
    name,
    geode_object_type,
    viewer_object_type,
    ...description,
    style: getDataStyleStore().getStyle(data_id),
  };
}

export { dataDetails };
