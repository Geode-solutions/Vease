/* oxlint-disable import/max-dependencies -- the registry imports every command handler */
// Local imports
import type { ControllerHandler } from "@vease/utils/controller/index";
import { applyFilter } from "@vease/utils/controller/handlers/apply_filter";
import { colorByAttribute } from "@vease/utils/controller/handlers/color_by_attribute";
import { createData } from "@vease/utils/controller/handlers/create_data";
import { dataDetails } from "@vease/utils/controller/handlers/data_details";
import { exportFile } from "@vease/utils/controller/handlers/export";
import { importProjectFile } from "@vease/utils/controller/handlers/import_project";
import { listData } from "@vease/utils/controller/handlers/list_data";
import { manageData } from "@vease/utils/controller/handlers/manage_data";
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
  "manage-data": manageData,
  "create-data": createData,
  export: exportFile,
  "import-project": importProjectFile,
};

export { commandHandlers };
