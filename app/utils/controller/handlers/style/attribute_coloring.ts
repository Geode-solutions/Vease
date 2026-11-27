// Local imports
import type {
  AttributeColorMap,
  AttributeLocation,
  AttributeTimeValue,
} from "@ogw_front/types/attribute";
import type {
  AttributeItem,
  AttributeName,
  AttributeRangeMaximum,
  AttributeRangeMinimum,
} from "@geode/opengeodeweb-viewer/schema_types";
import type {
  AttributeKind,
  MeshElement,
  ModelComponentTarget,
  TargetName,
} from "@vease/utils/controller/targets";
import type { AttributeBinding } from "@vease/utils/controller/attribute_setters";
import { ControllerError } from "@vease/utils/controller/errors";
import type { CssColor } from "@ogw_front/types/ui";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { FailedData } from "@vease/utils/controller/for_each_data";
import type { ModelComponentId } from "@ogw_front/types/identifiers";
import { getPresetByName } from "@ogw_front/utils/colormap";

const DEFAULT_COLORMAP = "batlow";

interface ColorByAttributeParams {
  id: DataId;
  target?: MeshElement | ModelComponentTarget;
  componentIds?: ModelComponentId[];
  attribute: AttributeName;
  location?: AttributeKind;
  item?: AttributeItem;
  colormap?: AttributeColorMap;
  minimum?: AttributeRangeMinimum;
  maximum?: AttributeRangeMaximum;
  timeStep?: AttributeTimeValue;
  noDataColor?: CssColor;
}

interface AttributeColoring {
  id: DataId;
  target: TargetName;
  location: AttributeLocation;
  attribute: AttributeName;
  item: AttributeItem;
  colormap: AttributeColorMap;
  minimum: AttributeRangeMinimum;
  maximum: AttributeRangeMaximum;
  timeStep?: AttributeTimeValue;
}

interface AttributeRouteParams {
  ids: DataId[];
  componentIds?: ModelComponentId[];
  name: AttributeName;
  item?: AttributeItem;
  colormap?: AttributeColorMap;
  minimum?: AttributeRangeMinimum;
  maximum?: AttributeRangeMaximum;
  timeStep?: AttributeTimeValue;
  noDataColor?: CssColor;
}

interface ColorByAttributeResult {
  ids: DataId[];
  attributes: AttributeColoring[];
  failed?: FailedData[];
}

function resolveColorMap(
  colormap: AttributeColorMap | undefined,
  binding: AttributeBinding,
): AttributeColorMap {
  const resolved = colormap ?? binding.currentColorMap() ?? DEFAULT_COLORMAP;
  if (getPresetByName(resolved) === undefined) {
    throw new ControllerError(`Unknown colormap "${resolved}"; read vease://colormaps`);
  }
  return resolved;
}

export { resolveColorMap };
export type {
  AttributeColoring,
  AttributeRouteParams,
  ColorByAttributeParams,
  ColorByAttributeResult,
};
