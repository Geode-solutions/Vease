// Local imports
import { defineTypedEventHandler } from "@ogw_server/utils/typed_handler";
import { exportToFile } from "@vease_server/utils/controller_export";
import schemas from "vease/vease_typed_schemas.js";

const SCREENSHOT_FORMATS = {
  label: "screenshot",
  formats: ["png", "jpg"],
  expected: ".png or .jpg",
};

export default defineTypedEventHandler(
  schemas.api.controller.export.screenshot,
  async ({ filePath, includeBackground }) => {
    await exportToFile(filePath, SCREENSHOT_FORMATS, "export-screenshot", { includeBackground });
    return { statusCode: 200, response: { filePath } };
  },
);
