// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import { exportToFile } from "@vease_server/utils/controller_export";
import schemas from "vease/vease_typed_schemas.js";

const PROJECT_FORMATS = { label: "project", formats: ["vease"], expected: ".vease" };

export default defineTypedEventHandler(
  schemas.api.controller.export.project,
  async ({ filePath }) => {
    await exportToFile(filePath, PROJECT_FORMATS, "export-project", {});
    return { statusCode: 200, response: { filePath } };
  },
);
