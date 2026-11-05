// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerAction } from "@vease_server/mcp/utils/controller_api";
import { controllerResponse } from "@vease_server/mcp/utils/controller_response";

export default defineMcpTool({
  name: "create-horizon-stack",
  description:
    "The required way to create a horizon stack (HorizonStack3D) in Vease, from scratch. Builds " +
    "the stratigraphic column from horizon names ordered from top to bottom. Unit names are " +
    "optional; when given there must be one more unit name than horizon names (a unit above the " +
    "top horizon, one between each pair of horizons, and one below the bottom horizon). The new " +
    "horizon stack is added to Vease and its id is returned; read vease://horizon-stack/{id} " +
    "for its content. It is the horizon stack needed by create-implicit-structural-model.",
  inputSchema: {
    name: z.string().min(1).describe("Name of the horizon stack"),
    horizons: z.array(z.string().min(1)).min(1).describe("Horizon names, ordered top to bottom"),
    unitNames: z
      .array(z.string())
      .optional()
      .describe("Stratigraphic unit names, ordered top to bottom: one more than horizons"),
  },
  handler: async ({ name, horizons, unitNames }) => {
    const result = await callControllerAction(
      "/api/controller/horizon_stack/create",
      { name, horizons, unit_names: unitNames },
      {
        accepted: ["name", "horizons", "unit_names"],
        context: "to create a horizon stack",
        errorPrefix: "Error creating horizon stack",
      },
    );
    if (!result.ok) {
      return result.message;
    }
    return `Horizon stack created: ${JSON.stringify(controllerResponse(result.payload))}`;
  },
});
