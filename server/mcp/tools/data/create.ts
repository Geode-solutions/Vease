// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";

const POINT_LENGTH = 3;

const point = z.array(z.number()).length(POINT_LENGTH);

export default defineMcpTool({
  name: "create-data",
  description:
    "The required way to create a point, a curve or a surface from coordinates in Vease. " +
    "Always use this tool instead of calling /api/controller/data/create directly or " +
    "writing custom fetch/curl code. points are [x, y, z] coordinates: a point needs at " +
    "least 1, a curve 2 (closed joins the last point to the first) and a surface 3 (one " +
    "polygon through the points in order). The new data is loaded in the viewer; its id " +
    "and name are returned.",
  inputSchema: {
    kind: z.enum(["point", "curve", "surface"]).describe("Kind of data to create"),
    name: z.string().min(1).describe("Name of the new data"),
    points: z.array(point).min(1).describe("[x, y, z] coordinates"),
    closed: z.boolean().optional().describe("Close the curve; only for curve"),
  },
  handler: async (input) => {
    const result = await callControllerApi("/api/controller/data/create", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error creating data",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Data created: ${JSON.stringify(controllerResponse(result.payload))}`;
  },
});
