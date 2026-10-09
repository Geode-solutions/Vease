// Third party imports
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { defineMcpResource } from "@nuxtjs/mcp-toolkit/server";

// Local imports
import { readControllerResource } from "@vease_server/mcp/utils/controller_resource";

async function readViewer(uri: URL): Promise<ReadResourceResult> {
  const result = await readControllerResource(
    uri,
    "/api/controller/viewer/state",
    "Error reading the viewer state",
  );
  return result;
}

export default defineMcpResource({
  name: "vease-viewer",
  description:
    "The Vease viewer state: the current z scaling, the saved camera positions (ID and name) " +
    "and the available camera orientations.",
  uri: "vease://viewer",
  metadata: { mimeType: "application/json" },
  handler: readViewer,
});

export { readViewer };
