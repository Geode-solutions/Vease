// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";

const HEX_COLOR = /^#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?$/u;
const DATA_ID_LENGTH = 32;

function responseOf(payload: unknown): unknown {
  return typeof payload === "object" && payload !== null && "response" in payload
    ? payload.response
    : payload;
}

export default defineMcpTool({
  name: "set-style",
  description:
    "The required way to change how loaded data looks in Vease: visibility, color, " +
    "point size, edge width or coloring mode. Always use this tool instead of calling " +
    "/api/controller/style/set directly or writing custom fetch/curl code. Read " +
    "vease://data for the data IDs and vease://data/{id} for the targets a mesh or " +
    "model offers. Without target the whole mesh is styled (visibility and color only; " +
    "a whole model accepts visibility only). Mesh targets: points, edges, cells, polygons, " +
    "polyhedra (size only on points, width only on edges, coloring constant, or textures " +
    "on cells and polygons). Model targets: points, edges, corners, lines, surfaces, " +
    "blocks; for corners, lines, surfaces and blocks, componentIds (geode ids) restricts " +
    "the change, otherwise every component of that type is styled, and coloring is " +
    "constant or random. Give at least one of visibility, color, size, width, coloring.",
  inputSchema: {
    id: z.string().length(DATA_ID_LENGTH).describe("ID of the mesh or model to style"),
    target: z
      .enum([
        "points",
        "edges",
        "cells",
        "polygons",
        "polyhedra",
        "corners",
        "lines",
        "surfaces",
        "blocks",
      ])
      .optional()
      .describe("Element or component type to style; omit to style the whole data"),
    componentIds: z
      .array(z.string())
      .min(1)
      .optional()
      .describe("Model component geode ids; only for corners, lines, surfaces or blocks"),
    visibility: z.boolean().optional().describe("Show (true) or hide (false)"),
    color: z
      .string()
      .regex(HEX_COLOR)
      .optional()
      .describe("Hex color, #rrggbb or #rrggbbaa (e.g. #ff8800)"),
    size: z.number().positive().optional().describe("Point size; only for the points target"),
    width: z.number().positive().optional().describe("Edge width; only for the edges target"),
    coloring: z
      .enum(["constant", "random", "textures"])
      .optional()
      .describe("Coloring mode: constant, random (model components) or textures (cells, polygons)"),
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
    return `Style updated: ${JSON.stringify(responseOf(result.payload))}`;
  },
});
