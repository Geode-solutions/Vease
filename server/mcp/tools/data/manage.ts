// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";

const DATA_ID_LENGTH = 32;

export default defineMcpTool({
  name: "manage-data",
  description:
    "The required way to rename or delete loaded data in Vease. Always use this tool " +
    "instead of calling /api/controller/data/manage directly or writing custom fetch/curl " +
    "code. Read vease://data for the data IDs. rename needs a name; delete removes the data " +
    "from the viewer and cannot be undone.",
  inputSchema: {
    action: z.enum(["rename", "delete"]).describe("What to do with the data"),
    id: z.string().length(DATA_ID_LENGTH).describe("ID of the data"),
    name: z.string().min(1).optional().describe("New name; required for rename"),
  },
  handler: async (input) => {
    const result = await callControllerApi("/api/controller/data/manage", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error managing data",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Data managed: ${JSON.stringify(controllerResponse(result.payload))}`;
  },
});
