// Third party imports
import { getAttributeRange } from "@ogw_front/utils/attributes";
import { getPresetByName } from "@ogw_front/utils/colormap";

// Local imports
import {
  type AttributeBinding,
  type AttributeInput,
  bindAttribute,
} from "@vease/utils/controller/attribute_setters";
import type {
  AttributeKind,
  BackAttribute,
  MeshElement,
  ModelComponentTarget,
} from "@vease/utils/controller/targets";
import { checkRange, findAttribute, resolveItem } from "@vease/utils/controller/attributes";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { ControllerError } from "@vease/utils/controller/errors";
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

function resolveColorMap(colormap: string | undefined, binding: AttributeBinding): string {
  const resolved = colormap ?? binding.currentColorMap() ?? DEFAULT_COLORMAP;
  if (getPresetByName(resolved) === undefined) {
    throw new ControllerError(`Unknown colormap "${resolved}"; read vease://colormaps`);
  }
  return resolved;
}

// The store keeps a step as an index into time_steps, while the tool speaks in time values
function requestedTimeStepIndex(
  timeStep: number | undefined,
  attribute: BackAttribute,
): number | undefined {
  if (timeStep === undefined) {
    return undefined;
  }
  const timeSteps = attribute.time_steps ?? [];
  const index = timeSteps.indexOf(timeStep);
  if (index === -1) {
    throw new ControllerError(
      `Time step ${timeStep} does not exist for "${attribute.attribute_name}"; available: ${
        timeSteps.length > 0 ? timeSteps.join(", ") : "none"
      }`,
    );
  }
  return index;
}

// Like the attribute selector: a series keeps its stored step when valid, otherwise shows the first one
function seriesTimeStepIndex(
  requested: number | undefined,
  attribute: BackAttribute,
  binding: AttributeBinding,
): number | undefined {
  const stepCount = attribute.time_steps?.length ?? 0;
  if (requested !== undefined || stepCount === 0) {
    return requested;
  }
  const stored = binding.storedTimeStep();
  return stored !== undefined && stored >= 0 && stored < stepCount ? stored : 0;
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

async function colorByAttribute(params: unknown): Promise<unknown> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const request = params as ColorByAttributeParams;
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
  await getHybridViewerStore().remoteRender();
  return {
    id,
    target: found.target,
    location: found.kind,
    attribute: input.name,
    item: input.item,
    colormap,
    minimum: input.minimum,
    maximum: input.maximum,
    ...(timeStepIndex === undefined ? {} : { timeStep: attribute.time_steps?.[timeStepIndex] }),
  };
}

export { colorByAttribute };
