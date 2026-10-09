// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import {
  componentIds,
  dataId,
  hexColor,
  styleTarget,
} from "@vease_server/mcp/utils/controller_schemas";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";

export default defineMcpTool({
  name: "color-by-attribute",
  description:
    "The required way to color loaded data by one of its attributes in Vease (a colormap over " +
    "the attribute values). Read vease://data for the data IDs and vease://data/{id} for the " +
    "attributes, their target, location, number of items, range and time steps. Without target, " +
    "the attribute is searched from the highest-dimension target down (mesh: polyhedra, cells, " +
    "polygons, edges, points; model: blocks, surfaces, lines, corners) and the first match is " +
    "colored; give target and/or location to pick another one. On a model, every component of " +
    "the target type is colored unless componentIds (geode ids) restricts it. Defaults: item 0, " +
    "the attribute range (give both minimum and maximum to override it), the current colormap or " +
    "batlow; colormap names come from vease://colormaps. timeStep is one of the attribute " +
    "time_steps values; without it a time series keeps its current step, or shows the first one.",
  inputSchema: {
    id: dataId.describe("ID of the mesh or model to color"),
    target: styleTarget
      .optional()
      .describe("Element or component type to color; omit to use the first one with the attribute"),
    componentIds: componentIds
      .optional()
      .describe("Model component geode ids; needs a corners, lines, surfaces or blocks target"),
    attribute: z.string().min(1).describe("Attribute name, as listed in vease://data/{id}"),
    location: z
      .enum(["vertex", "edge", "cell", "polygon", "polyhedron"])
      .optional()
      .describe("Element the attribute is defined on, to pick between same-name attributes"),
    item: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe("Component of a multi-item attribute (e.g. 1 for the y of a vector); default 0"),
    colormap: z.string().min(1).optional().describe("Colormap name from vease://colormaps"),
    minimum: z.number().optional().describe("Lower bound of the color range; give maximum too"),
    maximum: z.number().optional().describe("Upper bound of the color range; give minimum too"),
    timeStep: z
      .number()
      .optional()
      .describe("Time step to show: one of the attribute time_steps values"),
    noDataColor: hexColor
      .optional()
      .describe("Hex color of the no-data values, #rrggbb or #rrggbbaa"),
  },
  handler: async (input) => {
    const result = await callControllerApi("/api/controller/style/attribute", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error coloring by attribute",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Colored by attribute: ${JSON.stringify(controllerResponse(result.payload))}`;
  },
});
