// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";
import { dataId } from "@vease_server/mcp/utils/controller_schemas";

const VECTOR_LENGTH = 3;

const vector = z.array(z.number()).length(VECTOR_LENGTH);
const sliceAxis = z.union([z.literal(0), z.literal(1), z.literal(2)]);
const slice = z.object({ axis: sliceAxis, index: z.number().int().min(0) });
const plane = z.object({ origin: vector, normal: vector });

export default defineMcpTool({
  name: "apply-filter",
  description:
    "The required way to apply a viewer filter to loaded data in Vease: shrink, explode, slice, " +
    "clip or threshold. Read vease://data for the data IDs and vease://data/{id} for the " +
    "attributes. shrink and explode take an optional factor (defaults 0.8 and 0.2); slice needs " +
    "slices (axis 0, 1 or 2 and an index) and returns maxIndices; clip needs planes (origin and " +
    "normal vectors); threshold needs attribute (searched from the highest-dimension element " +
    "down, location vertex, edge, cell, polygon or polyhedron narrows it) and keeps values " +
    "between minimum and maximum, by default the whole attribute range (on a model it applies to " +
    "the whole model, not to one component). Set remove to true to undo the filter.",
  inputSchema: {
    filter: z.enum(["shrink", "explode", "slice", "clip", "threshold"]).describe("Filter to apply"),
    ids: z.array(dataId).min(1).describe("IDs of the data to filter"),
    remove: z.boolean().optional().describe("Remove the filter instead of applying it"),
    factor: z.number().min(0).optional().describe("Shrink or explode factor"),
    slices: z.array(slice).optional().describe("Slices to show; for slice"),
    planes: z.array(plane).optional().describe("Clipping planes; for clip"),
    attribute: z.string().min(1).optional().describe("Attribute name; for threshold"),
    location: z
      .enum(["vertex", "edge", "cell", "polygon", "polyhedron", "point"])
      .optional()
      .describe(
        "Element the attribute is defined on, as in vease://data/{id}; point means vertex and " +
          "cell any non-vertex element; for threshold",
      ),
    item: z.number().int().min(0).optional().describe("Attribute component index; for threshold"),
    minimum: z.number().optional().describe("Lower bound; for threshold"),
    maximum: z.number().optional().describe("Upper bound; for threshold"),
  },
  handler: async (input) => {
    const result = await callControllerApi("/api/controller/filter/apply", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error applying filter",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Filter applied: ${JSON.stringify(controllerResponse(result.payload))}`;
  },
});
