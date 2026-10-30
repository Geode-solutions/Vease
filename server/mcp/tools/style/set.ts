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
  name: "set-style",
  description:
    "The required way to change how loaded data looks in Vease: visibility, color, point size, " +
    "edge width, coloring mode, or coloring by an attribute. Style several data in one call by " +
    "listing all their IDs. Read vease://data for the data IDs and vease://data/{id} for the " +
    "targets, components and attributes a mesh or model offers.\n" +
    "Style: without target the whole mesh is styled (visibility and color only; a whole model " +
    "accepts visibility only). Mesh targets: points, edges, cells, polygons, polyhedra (size only " +
    "on points, width only on edges, textures only on cells and polygons). Model targets: points, " +
    "edges, corners, lines, surfaces, blocks; for corners, lines, surfaces and blocks, " +
    "componentIds (geode ids, single model only) restricts the change, otherwise every component " +
    'of that type is styled. coloring "random" gives each listed mesh, or each model component, ' +
    "its own distinct color.\n" +
    "Attribute: give attribute (alone, without visibility, color, size, width or coloring) to " +
    "color by its values through a colormap. Without target, the attribute is searched from the " +
    "highest-dimension target down and the first match is colored; give target and/or location " +
    "to pick another one. Defaults: item 0, each data's own attribute range (give both minimum " +
    "and maximum to override it), the current colormap or batlow; colormap names come from " +
    "vease://colormaps. timeStep is one of the attribute time_steps values; without it a time " +
    "series keeps its current step, or shows the first one.",
  inputSchema: {
    ids: z.array(dataId).min(1).describe("IDs of the meshes or models to style"),
    target: styleTarget
      .optional()
      .describe("Element or component type; omit to style the whole data or find the attribute"),
    componentIds: componentIds
      .optional()
      .describe("Geode ids of one model's corners, lines, surfaces or blocks"),
    visibility: z.boolean().optional().describe("Show (true) or hide (false)"),
    color: hexColor.optional().describe("Hex color, #rrggbb or #rrggbbaa (e.g. #ff8800)"),
    size: z.number().positive().optional().describe("Point size; only for the points target"),
    width: z.number().positive().optional().describe("Edge width; only for the edges target"),
    coloring: z
      .enum(["constant", "random", "textures"])
      .optional()
      .describe("Coloring mode: constant, random (a distinct color each) or textures"),
    attribute: z
      .string()
      .min(1)
      .optional()
      .describe("Attribute name to color by, as listed in vease://data/{id}"),
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
    const result = await callControllerApi("/api/controller/style/set", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error setting style",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Style updated: ${JSON.stringify(controllerResponse(result.payload))}`;
  },
});
