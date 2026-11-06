// Third party imports
import { getAttributeRange } from "@ogw_front/utils/attributes";
import { getPresetByName } from "@ogw_front/utils/colormap";

// Local imports
import { type AttributeBinding, bindAttribute } from "@vease/utils/controller/attribute_setters";
import {
  type AttributeKind,
  type BackAttribute,
  MESH_ELEMENT_ATTRIBUTE_KINDS,
  MODEL_COMPONENT_KINDS,
  type MeshElement,
  type ModelComponentTarget,
  checkComponentIdsOwner,
  getDataItem,
  isModelComponentTarget,
} from "@vease/utils/controller/targets";
import { type FailedData, forEachData, withFailed } from "@vease/utils/controller/for_each_data";
import { checkMesh, checkModel } from "@vease/utils/controller/handlers/style/common";
import { checkRange, resolveItem } from "@vease/utils/controller/attribute_range";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import {
  requestedTimeStepIndex,
  seriesTimeStepIndex,
} from "@vease/utils/controller/handlers/style/time_step";
import type { AttributeInput } from "@vease/utils/controller/attribute_setter_types";
import { ControllerError } from "@vease/utils/controller/errors";
import type { ControllerHandler } from "@vease/utils/controller/index";
import { findAttribute } from "@vease/utils/controller/attributes";
import { hexToRgba } from "@vease/utils/controller/color";

const DEFAULT_COLORMAP = "batlow";

interface ColorByAttributeParams {
  id: string;
  target?: MeshElement | ModelComponentTarget;
  componentIds?: string[];
  attribute: string;
  location?: AttributeKind;
  item?: number;
  colormap?: string;
  minimum?: number;
  maximum?: number;
  timeStep?: number;
  noDataColor?: string;
}

interface AttributeColoring {
  id: string;
  target: string;
  location: string;
  attribute: string;
  item: number;
  colormap: string;
  minimum: number;
  maximum: number;
  timeStep?: number;
}

function resolveColorMap(colormap: string | undefined, binding: AttributeBinding): string {
  const resolved = colormap ?? binding.currentColorMap() ?? DEFAULT_COLORMAP;
  if (getPresetByName(resolved) === undefined) {
    throw new ControllerError(`Unknown colormap "${resolved}"; read vease://colormaps`);
  }
  return resolved;
}

function attributeInput(
  request: ColorByAttributeParams,
  attribute: BackAttribute,
  colorMap: string,
): AttributeInput {
  const item = resolveItem(request.item, attribute);
  const range = getAttributeRange(attribute, item);
  const input: AttributeInput = {
    name: attribute.attribute_name,
    item,
    minimum: request.minimum ?? range.min,
    maximum: request.maximum ?? range.max,
    colorMap,
  };
  if (request.noDataColor !== undefined) {
    input.no_data_color = hexToRgba(request.noDataColor);
  }
  return input;
}

async function colorItemByAttribute(request: ColorByAttributeParams): Promise<AttributeColoring> {
  const { id, target, componentIds, location } = request;
  checkRange(request.minimum, request.maximum);
  const found = await findAttribute({
    id,
    name: request.attribute,
    target,
    location,
    componentIds,
  });
  const { attribute } = found;
  const requestedIndex = requestedTimeStepIndex(request.timeStep, attribute);
  const binding = bindAttribute(getDataStyleStore(), id, found);
  const colormap = resolveColorMap(request.colormap, binding);
  const input = attributeInput(request, attribute, colormap);
  await binding.apply(input);
  const timeStepIndex = seriesTimeStepIndex(requestedIndex, attribute, binding);
  if (timeStepIndex !== undefined) {
    await binding.applyTimeStep(timeStepIndex);
  }
  await binding.activate();
  const coloring: AttributeColoring = {
    id,
    target: found.target,
    location: found.kind,
    attribute: input.name,
    item: input.item,
    colormap,
    minimum: input.minimum,
    maximum: input.maximum,
  };
  if (timeStepIndex !== undefined) {
    coloring.timeStep = attribute.time_steps?.[timeStepIndex];
  }
  return coloring;
}

interface AttributeRouteParams {
  ids: string[];
  componentIds?: string[];
  name: string;
  item?: number;
  colormap?: string;
  minimum?: number;
  maximum?: number;
  timeStep?: number;
  noDataColor?: string;
}

interface ColorByAttributeResult {
  ids: string[];
  attributes: AttributeColoring[];
  failed?: FailedData[];
}

// Each data gets its own attribute range unless minimum and maximum are given
function attributeCommand(
  target: MeshElement | ModelComponentTarget,
  location: AttributeKind,
): ControllerHandler {
  return async (params): Promise<ColorByAttributeResult> => {
    // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
    const { ids, name, ...request } = params as AttributeRouteParams;
    checkComponentIdsOwner(ids, request.componentIds);
    const {
      ids: colored,
      results,
      failed,
    } = await forEachData(ids, async (dataId) => {
      const item = await getDataItem(dataId);
      if (isModelComponentTarget(target)) {
        checkModel(item);
      } else {
        checkMesh(item, target);
      }
      const coloring = await colorItemByAttribute({
        ...request,
        id: dataId,
        attribute: name,
        target,
        location,
      });
      return coloring;
    });
    await getHybridViewerStore().remoteRender();
    return withFailed({ ids: colored, attributes: results }, failed);
  };
}

const ATTRIBUTE_TARGETS = [
  ...Object.entries(MESH_ELEMENT_ATTRIBUTE_KINDS).map(([target, kinds]) => ({
    type: "mesh",
    target,
    kinds,
  })),
  ...Object.entries(MODEL_COMPONENT_KINDS).map(([target, kinds]) => ({
    type: "model",
    target,
    kinds,
  })),
];

const ATTRIBUTE_STYLE_COMMANDS: Record<string, ControllerHandler> = Object.fromEntries(
  ATTRIBUTE_TARGETS.flatMap(({ type, target, kinds }) =>
    kinds.map((kind) => [
      `style/${type}/${target}/${kind}/attribute`,
      // oxlint-disable-next-line no-unsafe-type-assertion -- the keys of both kind tables are targets
      attributeCommand(target as MeshElement | ModelComponentTarget, kind),
    ]),
  ),
);

export { ATTRIBUTE_STYLE_COMMANDS };
