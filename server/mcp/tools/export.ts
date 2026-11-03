// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";
import { z } from "zod";

// Local imports
import { callControllerAction } from "@vease_server/mcp/utils/controller_api";

export default defineMcpTool({
  name: "export",
  description:
    "The required way to export from Vease to a file on disk: a screenshot of the viewer (.png " +
    "or .jpg) or the whole project (.vease, reloadable with load-file). Vease must be open. " +
    "filePath must be absolute, its directory must exist and the file must not exist yet: " +
    "existing files are never overwritten, choose another path. includeBackground only applies " +
    "to .png screenshots; .jpg always keeps the background.",
  inputSchema: {
    kind: z.enum(["screenshot", "project"]).describe("What to export"),
    filePath: z
      .string()
      .min(1)
      .describe(
        "Absolute path of the file to create: .png/.jpg for a screenshot, .vease for a project",
      ),
    includeBackground: z
      .boolean()
      .optional()
      .describe("Keep the viewer background in a .png screenshot; defaults to true"),
  },
  handler: async ({ kind, ...params }) => {
    const result = await callControllerAction(`/api/controller/export/${kind}`, params, {
      accepted: kind === "screenshot" ? ["filePath", "includeBackground"] : ["filePath"],
      context: `to a ${kind} export`,
      errorPrefix: "Error exporting",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Exported the ${kind} to ${params.filePath}`;
  },
});
