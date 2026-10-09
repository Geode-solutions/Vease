// Third party imports
import { type MultiPartData, createError, readMultipartFormData } from "h3";
import { consola } from "consola";

// Local imports
import { LONG_COMMAND_TIMEOUT_MS, dispatchCommand } from "@vease_server/utils/command_bus";
import {
  getAllowedFileExtensions,
  getAllowedGeodeObjectTypes,
  saveViewableFile,
  uploadFile,
} from "@vease_server/utils/data_file";
import { stageDownload, takeDownload } from "@vease_server/utils/file_transfer";

import { getFileExtension } from "@ogw_shared/utils/response_handlers/load";

import schemas, { type ControllerDataLoadResponse } from "vease/vease_typed_schemas.js";
import { defineRawEventHandler } from "@ogw_server/utils/typed_handler";

const DOWNLOAD_URL = "/api/controller/files/download";

// The browser fetches the project bytes itself: binary content never goes through the command channel
async function importProject(
  filePart: MultiPartData,
  filename: string,
): Promise<ControllerDataLoadResponse> {
  const token = stageDownload(filePart.data, filename);
  try {
    await dispatchCommand(
      "import-project",
      { downloadUrl: `${DOWNLOAD_URL}?token=${token}`, filename },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  } catch (error) {
    // A late download after a failed or timed out import must not replace the session anyway
    takeDownload(token);
    throw error;
  }
  return { statusCode: 200, response: { project: filename } };
}

// Multipart file upload: the body is not JSON, so the route cannot go through defineTypedEventHandler
export default defineRawEventHandler(
  schemas.api.controller.data.load,
  async (event): Promise<ControllerDataLoadResponse> => {
    const formData = (await readMultipartFormData(event)) ?? [];
    const filePart = formData.find((part) => part.name === "file");
    if (!filePart) {
      throw createError({ statusCode: 400, statusMessage: "No file field found" });
    }
    const { filename } = filePart;
    if (filename === undefined || filename === "") {
      throw createError({ statusCode: 400, statusMessage: "No filename found" });
    }

    if (getFileExtension(filename).toLowerCase() === "vease") {
      return importProject(filePart, filename);
    }

    const allowedFileExtensions = await getAllowedFileExtensions();
    if (!allowedFileExtensions.includes(getFileExtension(filename))) {
      throw createError({ statusCode: 400, statusMessage: "File type not allowed" });
    }

    await uploadFile(filePart);
    const allowedGeodeObjectType = await getAllowedGeodeObjectTypes(filename);
    if (allowedGeodeObjectType === undefined || allowedGeodeObjectType === "") {
      throw createError({
        statusCode: 400,
        statusMessage: "No allowed geode object type found for file",
      });
    }
    consola.info(`Saving file as ${allowedGeodeObjectType}...`);
    const response = await saveViewableFile(filename, allowedGeodeObjectType);

    return { statusCode: 200, response };
  },
);
