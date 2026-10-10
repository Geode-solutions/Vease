// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { componentIds, dataId, hexColor } from "@vease_server/mcp/utils/controller_schemas";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";

export default defineMcpTool({
  name: "set-view",
  description:
    "The required way to move the camera or change the scene of the Vease viewer. Read " +
    "vease://viewer for the saved camera positions and the current z scaling, and vease://data " +
    "for the data IDs. Actions: reset (fit everything), focus (needs id; componentIds, model " +
    "component geode ids, narrows the focus), orient (needs orientation: xplus, xminus, yplus, " +
    "yminus, zplus or zminus), save (needs name; saves the current camera and returns the saved " +
    "positions), restore (needs positionId of a saved position) and scene (at least one of " +
    "zScaling, backgroundColor, axes, grid).",
  inputSchema: {
    action: z
      .enum(["reset", "focus", "orient", "save", "restore", "scene"])
      .describe("What to do with the view"),
    id: dataId.optional().describe("Data to focus on; for focus"),
    componentIds: componentIds
      .optional()
      .describe("Model component geode ids to focus on; for focus on a model"),
    orientation: z
      .enum(["xplus", "xminus", "yplus", "yminus", "zplus", "zminus"])
      .optional()
      .describe("Axis the camera looks along; for orient"),
    name: z.string().min(1).optional().describe("Name of the camera position; for save"),
    positionId: z.number().int().optional().describe("ID of a saved camera position; for restore"),
    zScaling: z.number().positive().optional().describe("Vertical exaggeration; for scene"),
    backgroundColor: hexColor.optional().describe("Hex background color, #rrggbb; for scene"),
    axes: z.boolean().optional().describe("Show (true) or hide (false) the axes; for scene"),
    grid: z.boolean().optional().describe("Show (true) or hide (false) the grid scale; for scene"),
  },
  handler: async (input) => {
    const result = await callControllerApi("/api/controller/view/set", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error setting view",
    });
    if (!result.ok) {
      return result.message;
    }
    return `View updated: ${JSON.stringify(controllerResponse(result.payload))}`;
  },
});
