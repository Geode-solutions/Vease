// Local imports
import type { ControllerHandler } from "@vease/utils/controller/index";
import { applyFilter } from "@vease/utils/controller/handlers/apply_filter";
import { colorByAttribute } from "@vease/utils/controller/handlers/color_by_attribute";
import { dataDetails } from "@vease/utils/controller/handlers/data_details";
import { listData } from "@vease/utils/controller/handlers/list_data";
import { setStyle } from "@vease/utils/controller/handlers/set_style";
import { setView } from "@vease/utils/controller/handlers/set_view";
import { viewerState } from "@vease/utils/controller/handlers/viewer_state";

const commandHandlers: Record<string, ControllerHandler> = {
  "list-data": listData,
  "data-details": dataDetails,
  "viewer-state": viewerState,
  "set-style": setStyle,
  "color-by-attribute": colorByAttribute,
  "set-view": setView,
  "apply-filter": applyFilter,
};

export { commandHandlers };
