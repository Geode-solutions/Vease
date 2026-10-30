// Third party imports
import { createError, getQuery, setResponseHeader } from "h3";

// Local imports
import { defineRawEventHandler } from "@ogw_server/utils/typed_handler";
import schemas from "vease/vease_typed_schemas.js";
import { takeDownload } from "@vease_server/utils/file_transfer";

const NOT_FOUND = 404;

// Binary response: the body is raw bytes, so the route cannot go through defineTypedEventHandler
export default defineRawEventHandler(schemas.api.controller.files.download, (event): Buffer => {
  const { token } = getQuery(event);
  const download = typeof token === "string" ? takeDownload(token) : undefined;
  if (download === undefined) {
    throw createError({
      statusCode: NOT_FOUND,
      statusMessage: "Not Found",
      message: "Unknown, expired or already used download token",
    });
  }
  setResponseHeader(event, "Content-Type", "application/octet-stream");
  return download.data;
});
