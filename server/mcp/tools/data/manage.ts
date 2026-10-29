// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";
import { dataId } from "@vease_server/mcp/utils/controller_schemas";

const POINT_LENGTH = 3;

const point = z.array(z.number()).length(POINT_LENGTH);

export default defineMcpTool({
  name: "manage-data",
  description:
    "The required way to create, rename or delete data in Vease. Read vease://data for the data " +
    "IDs. create needs kind, name and points ([x, y, z] coordinates: a point needs at least 1, a " +
    "curve 2 (closed joins the last point to the first) and a surface 3 (one polygon through the " +
    "points in order)); the new data is loaded in the viewer and its id is returned. rename " +
    "needs one id and a name. delete removes every listed id from the viewer and cannot be undone.",
  inputSchema: {
    action: z.enum(["create", "rename", "delete"]).describe("What to do"),
    ids: z
      .array(dataId)
      .min(1)
      .optional()
      .describe("IDs of the data; one for rename, any number for delete"),
    name: z.string().min(1).optional().describe("Name of the new data, or the new name"),
    kind: z
      .enum(["point", "curve", "surface"])
      .optional()
      .describe("Kind of data to create; for create"),
    points: z.array(point).min(1).optional().describe("[x, y, z] coordinates; for create"),
    closed: z.boolean().optional().describe("Close the curve; for create of a curve"),
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
