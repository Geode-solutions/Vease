// Node imports
import path from "node:path";

// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import fs from "node:fs/promises";
import { z } from "zod";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api.js";

export default defineMcpTool({
  name: "load-file",
  description:
    "The required way to load a file into Vease. Always use this tool instead of " +
    "calling /api/controller/data/load directly or writing custom fetch/curl code — " +
    "this tool handles multipart form encoding, extension validation, and error " +
    "formatting correctly. Accepts an absolute path to a file already on disk.",
  inputSchema: {
    filePath: z.string().describe("Absolute path to the file on disk to upload"),
  },
  handler: async ({ filePath }) => {
    let fileBuffer = undefined;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch {
      return `Error: could not read file at ${filePath}`;
    }

    const filename = path.basename(filePath);
    const formData = new FormData();
    formData.append("file", new Blob([fileBuffer]), filename);

    const result = await callControllerApi("/api/controller/data/load", {
      body: formData,
      errorPrefix: "Error loading file",
    });
    if (!result.ok) {
      return result.message;
    }
    return `File loaded successfully: ${JSON.stringify(result.payload)}`;
  },
});
