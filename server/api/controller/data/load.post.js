// Third party imports
import { createError, defineEventHandler, readMultipartFormData } from "h3";

// Local imports
import {
  getAllowedFileExtensions,
  getAllowedGeodeObjectTypes,
  saveViewableFile,
  uploadFile
} from "@vease_server/utils/fetch_functions.js";

import { getFileExtension } from "@ogw_shared/utils/utils.js";


export default defineEventHandler(
  async (event) => {
    try {
      const formData = await readMultipartFormData(event);
      const filePart = formData.find((part) => part.name === "file");
      if (!filePart) {
        throw createError({ statusCode: 400, statusMessage: "No file field found" });
      }
      const { filename, type: mimeType } = filePart;

      const allowedFileExtensions = await getAllowedFileExtensions();
      console.log(`Allowed files: ${allowedFileExtensions}`);
      console.log(`Allowed files: ${allowedFileExtensions.values()}`);
      console.log(`typeof Allowed files: ${typeof allowedFileExtensions.values()}`);

      if (!allowedFileExtensions.includes(getFileExtension(filename))) {
        throw createError({ statusCode: 400, statusMessage: "File type not allowed" });
      }

      await uploadFile(filePart);
      const allowedGeodeObjectType = await getAllowedGeodeObjectTypes(filename);
      console.log(`Saving file as ${allowedGeodeObjectType}...`);
      await saveViewableFile(filename, allowedGeodeObjectType);

      return { statusCode: 200, filename, mimeType, size: filePart.data.length };
    } catch (error) {
      console.log(error);
      throw createError({
        statusCode: error.statusCode ?? 500,
        statusMessage: error.statusMessage ?? error.message,
      });
    }
  }
);