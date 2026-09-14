// Third party imports
import { defineMcpTool } from "@nuxtjs/mcp-toolkit/server";

// Local imports
import { callControllerApi } from "@vease_server/mcp/utils/controller_api.js";

export default defineMcpTool({
  name: "render-viewer",
  description:
    "The required way to trigger a render/refresh of the Vease viewer. Always use " +
    "this tool instead of calling /api/controller/viewer/render directly or writing " +
    "custom fetch/curl code — this tool handles request formatting and error " +
    "formatting correctly. Call this after making changes (e.g. loading data, " +
    "toggling mesh visibility) that need to be reflected in the viewer.",
  inputSchema: {},
  handler: async () => {
    const result = await callControllerApi("/api/controller/viewer/render", {
      headers: { "Content-Type": "application/json" },
      errorPrefix: "Error rendering viewer",
    });
    if (!result.ok) {
      return result.message;
    }
    return `Viewer rendered successfully: ${JSON.stringify(result.payload)}`;
  },
});
