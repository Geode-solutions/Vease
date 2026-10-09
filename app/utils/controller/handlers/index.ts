// Local imports
import type { ControllerHandler } from "@vease/utils/controller/index";
import { dataDetails } from "@vease/utils/controller/handlers/data_details";
import { listData } from "@vease/utils/controller/handlers/list_data";
import { viewerState } from "@vease/utils/controller/handlers/viewer_state";

const commandHandlers: Record<string, ControllerHandler> = {
  "list-data": listData,
  "data-details": dataDetails,
  "viewer-state": viewerState,
};

export { commandHandlers };
