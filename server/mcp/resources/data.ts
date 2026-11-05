// Third party imports
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { defineMcpResource } from "@nuxtjs/mcp-toolkit/server";

// Local imports
import { readControllerResource } from "@vease_server/mcp/utils/controller_resource";

async function readData(uri: URL): Promise<ReadResourceResult> {
  const result = await readControllerResource(
    uri,
    "/api/controller/data/list",
    "Error reading the loaded data",
  );
  return result;
}

export default defineMcpResource({
  name: "vease-data",
  description:
    "The data loaded in Vease: the ID, name, Geode object type, viewer type (mesh or model) " +
    "and visibility of each item. Read vease://data/{id} for the details of one item.",
  uri: "vease://data",
  metadata: { mimeType: "application/json" },
  handler: readData,
});

export { readData };
