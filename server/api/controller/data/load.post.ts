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

import schemas, {
  type ControllerDataLoadResponse,
  type ControllerDataLoadedItem,
} from "vease/vease_typed_schemas.js";
import { defineRawEventHandler } from "@ogw_server/utils/typed_handler";

const DOWNLOAD_URL = "/api/controller/files/download";
const BAD_GATEWAY = 502;

interface SavedData {
  data: [ControllerDataLoadedItem, ...ControllerDataLoadedItem[]];
}

function isControllerDataLoadedItem(item: unknown): item is ControllerDataLoadedItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "name" in item &&
    "geode_object_type" in item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.geode_object_type === "string"
  );
}

// One file may hold several objects: the back returns one item per saved object
function isSavedData(response: unknown): response is SavedData {
  return (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    Array.isArray(response.data) &&
    response.data.length > 0 &&
    response.data.every((item) => isControllerDataLoadedItem(item))
  );
}

function savedData(response: unknown): SavedData {
  if (isSavedData(response)) {
    return response;
  }
  throw createError({ statusCode: BAD_GATEWAY, statusMessage: "The back returned no data id" });
}

// A file may hold several contents: it is saved once per geode object type, one after the other
async function saveAllTypes(
  filename: string,
  geodeObjectTypes: string[],
): Promise<ControllerDataLoadedItem[]> {
  const data: ControllerDataLoadedItem[] = [];
  for (const geodeObjectType of geodeObjectTypes) {
    consola.info(`Saving file as ${geodeObjectType}...`);
    // oxlint-disable-next-line no-await-in-loop
    const saved = savedData(await saveViewableFile(filename, geodeObjectType));
    data.push(...saved.data);
  }
  return data;
}

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
    const allowedGeodeObjectTypes = await getAllowedGeodeObjectTypes(filename);
    if (allowedGeodeObjectTypes.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No allowed geode object type found for file",
      });
    }
    const data = await saveAllTypes(filename, allowedGeodeObjectTypes);
    // The browser imports the saved data on the back event: answer once every object is ready to style
    await Promise.all(
      data.map(async ({ id }) => {
        await dispatchCommand("await-data", { id }, { timeout: LONG_COMMAND_TIMEOUT_MS });
      }),
    );

    return { statusCode: 200, response: { data } };
  },
);
