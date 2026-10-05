// Third party imports
import { createError, readMultipartFormData } from "h3";
import { consola } from "consola";

// Local imports
import {
  getAllowedFileExtensions,
  getAllowedGeodeObjectTypes,
  saveViewableFile,
  uploadFile,
} from "@vease_server/utils/data_file";

import { getFileExtension } from "@ogw_shared/utils/response_handlers/load";

import schemas, { type ControllerDataLoadResponse } from "vease/vease_typed_schemas.js";
import { defineRawEventHandler } from "@ogw_server/utils/typed_handler";

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
