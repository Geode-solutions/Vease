/* oxlint-disable import/max-dependencies -- the registry imports every command handler */
// Local imports
import {
  applyClip,
  applyExplode,
  applyShrink,
  applySlice,
  applyThreshold,
} from "@vease/utils/controller/handlers/apply_filter";
import { exportProject, exportScreenshot } from "@vease/utils/controller/handlers/export";
import {
  focusView,
  orientView,
  resetView,
  restoreView,
  saveView,
  setScene,
} from "@vease/utils/controller/handlers/set_view";
import type { ControllerHandler } from "@vease/utils/controller/index";
import { STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/index";
import { awaitData } from "@vease/utils/controller/handlers/await_data";
import { createData } from "@vease/utils/controller/handlers/create_data";
import { dataDetails } from "@vease/utils/controller/handlers/data_details";
import { deleteData } from "@vease/utils/controller/handlers/delete_data";
import { importProjectFile } from "@vease/utils/controller/handlers/import_project";
import { listData } from "@vease/utils/controller/handlers/list_data";
import { renameData } from "@vease/utils/controller/handlers/rename_data";
import { viewerState } from "@vease/utils/controller/handlers/viewer_state";

// One command per controller route
const commandHandlers: Record<string, ControllerHandler> = {
  "list-data": listData,
  "data-details": dataDetails,
  "viewer-state": viewerState,
  "import-project": importProjectFile,
  "await-data": awaitData,
  "create-data": createData,
  "rename-data": renameData,
  "delete-data": deleteData,
  ...STYLE_COMMANDS,
  "reset-view": resetView,
  "focus-view": focusView,
  "orient-view": orientView,
  "save-view": saveView,
  "restore-view": restoreView,
  "set-scene": setScene,
  "apply-shrink": applyShrink,
  "apply-explode": applyExplode,
  "apply-slice": applySlice,
  "apply-clip": applyClip,
  "apply-threshold": applyThreshold,
  "export-screenshot": exportScreenshot,
  "export-project": exportProject,
};

export { commandHandlers };
