// Third party imports
import { createError, getQuery, readRawBody } from "h3";

// Local imports
import { completeUpload, hasUpload } from "@vease_server/utils/file_transfer";
import schemas, { type ControllerFilesUploadResponse } from "vease/vease_typed_schemas.js";
import { defineRawEventHandler } from "@ogw_server/utils/typed_handler";

const BAD_REQUEST = 400;
const NOT_FOUND = 404;

// Binary request body: the route cannot go through defineTypedEventHandler
export default defineRawEventHandler(
  schemas.api.controller.files.upload,
  async (event): Promise<ControllerFilesUploadResponse> => {
    const { token } = getQuery(event);
    if (typeof token !== "string" || token === "") {
      throw createError({ statusCode: BAD_REQUEST, statusMessage: "Missing upload token" });
    }
    // Checked before reading the body so a bogus token never makes the server buffer it
    if (!hasUpload(token)) {
      throw createError({
        statusCode: NOT_FOUND,
        statusMessage: "Not Found",
        message: "Unknown, expired or already used upload token",
      });
    }
    const data = await readRawBody(event, false);
    if (data === undefined || data.length === 0) {
      throw createError({ statusCode: BAD_REQUEST, statusMessage: "Empty upload body" });
    }
    await completeUpload(token, data);
    return { statusCode: 200, response: {} };
  },
);
