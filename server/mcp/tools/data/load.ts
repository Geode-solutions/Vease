// Node imports
import path from "node:path";

// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import fs from "node:fs/promises";
import { z } from "zod";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";

const LOADED_DATA_KEYS = ["id", "name", "geode_object_type"];

function loadedSummary(payload: unknown): unknown {
  const response = controllerResponse(payload);
  if (typeof response !== "object" || response === null) {
    return response;
  }
  const keys = "project" in response ? ["project"] : LOADED_DATA_KEYS;
  return Object.fromEntries(
    keys
      .filter((key) => Object.hasOwn(response, key))
      .map((key): [string, unknown] => [key, Reflect.get(response, key)]),
  );
}

export default defineMcpTool({
  name: "load-file",
  description:
    "The required way to load a file into Vease. Accepts an absolute path to a file already on " +
    "disk and returns the id, name and geode_object_type of the loaded data, ready to style. A " +
    ".vease project file (from the export tool) is opened as a project and replaces everything " +
    "currently loaded in Vease.",
  inputSchema: {
    filePath: z.string().describe("Absolute path to the file on disk to upload"),
  },
  handler: async ({ filePath }) => {
    let fileBuffer: Buffer | undefined = undefined;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch {
      return `Error: could not read file at ${filePath}`;
    }

    const filename = path.basename(filePath);
    const formData = new FormData();
    formData.append("file", new Blob([new Uint8Array(fileBuffer)]), filename);

    const result = await callControllerApi("/api/controller/data/load", {
      body: formData,
      errorPrefix: "Error loading file",
    });
    if (!result.ok) {
      return result.message;
    }
    return `File loaded successfully: ${JSON.stringify(loadedSummary(result.payload))}`;
  },
});
