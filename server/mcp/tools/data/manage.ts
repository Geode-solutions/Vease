// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerAction } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";
import { dataId } from "@vease_server/mcp/utils/controller_schemas";

const POINT_LENGTH = 3;

const point = z.array(z.number()).length(POINT_LENGTH);

const ACCEPTED = {
  create: ["kind", "name", "points", "closed"],
  rename: ["id", "name"],
  delete: ["ids"],
} as const;

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
  handler: async ({ action, ids, ...params }) => {
    if (action === "rename" && ids?.length !== 1) {
      return "Error managing data: rename takes exactly one id";
    }
    // Rename speaks of the single data it renames, the other actions of a list
    const id = action === "rename" ? ids?.[0] : undefined;
    const actionParams = { ...params, id, ids: id === undefined ? ids : undefined };
    const result = await callControllerAction(`/api/controller/data/${action}`, actionParams, {
      accepted: ACCEPTED[action],
      context: `to ${action}`,
      errorPrefix: "Error managing data",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Data managed (${action}): ${JSON.stringify(controllerResponse(result.payload))}`;
  },
});
