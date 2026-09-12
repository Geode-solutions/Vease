// Third party imports
import { createError, defineEventHandler, readMultipartFormData } from "h3";

// Local imports
import {
  getAllowedFileExtensions,
  getAllowedGeodeObjectTypes,
  saveViewableFile,
  uploadFile,
} from "@vease_server/utils/data_file";

import { asErrorLike } from "@vease_server/utils/errors";
import { getFileExtension } from "@ogw_shared/utils/response_handlers/load.js";

export default defineEventHandler(async (event) => {
  try {
    const formData = (await readMultipartFormData(event)) ?? [];
    const filePart = formData.find((part) => part.name === "file");
    if (!filePart) {
      throw createError({ statusCode: 400, statusMessage: "No file field found" });
    }
    const { filename } = filePart;
    if (!filename) {
      throw createError({ statusCode: 400, statusMessage: "No filename found" });
    }

    const allowedFileExtensions = await getAllowedFileExtensions();
    if (!allowedFileExtensions.includes(getFileExtension(filename))) {
      throw createError({ statusCode: 400, statusMessage: "File type not allowed" });
    }

    await uploadFile(filePart);
    const allowedGeodeObjectType = await getAllowedGeodeObjectTypes(filename);
    if (!allowedGeodeObjectType) {
      throw createError({
        statusCode: 400,
        statusMessage: "No allowed geode object type found for file",
      });
    }
    console.log(`Saving file as ${allowedGeodeObjectType}...`);
    const response = await saveViewableFile(filename, allowedGeodeObjectType);

    return { statusCode: 200, response };
  } catch (error) {
    console.log(error);
    const err = asErrorLike(error);
    throw createError({
      statusCode: err.statusCode,
      statusMessage: err.statusMessage ?? err.message,
    });
  }
});
