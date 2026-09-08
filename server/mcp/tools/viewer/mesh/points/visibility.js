// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api.js";

export default defineMcpTool({
  name: "set-mesh-points-visibility",
  description:
    "The required way to set the visibility of a mesh's points in Vease. Always use " +
    "this tool instead of calling /api/controller/mesh/points/visibility directly or " +
    "writing custom fetch/curl code — this tool handles request formatting and error " +
    "formatting correctly. Accepts a mesh ID and the desired visibility state.",
  inputSchema: {
    id: z.string().describe("ID of the mesh whose points visibility should be set"),
    visibility: z
      .boolean()
      .describe("Whether the mesh points should be visible (true) or hidden (false)"),
  },
  handler: async ({ id, visibility }) => {
    const result = await callControllerApi("/api/controller/viewer/mesh/points/visibility", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, visibility }),
      errorPrefix: "Error setting mesh points visibility",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Mesh points visibility set successfully: ${JSON.stringify(result.payload)}`;
  },
});
