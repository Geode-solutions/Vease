// Third party imports
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Variables } from "@modelcontextprotocol/sdk/shared/uriTemplate.js";
import { defineMcpResource } from "@nuxtjs/mcp-toolkit/server";

// Local imports
import { readControllerResource } from "@vease_server/mcp/utils/controller_resource";

async function readDataDetails(uri: URL, { id }: Variables): Promise<ReadResourceResult> {
  if (typeof id !== "string") {
    throw new TypeError(`Invalid data ID in ${uri.href}`);
  }
  const query = new URLSearchParams({ id });
  const result = await readControllerResource(
    uri,
    `/api/controller/data/details?${query}`,
    "Error reading data details",
  );
  return result;
}

export default defineMcpResource({
  name: "vease-data-details",
  description:
    "Details of one item loaded in Vease (ID from vease://data): its stylable targets " +
    "(mesh elements, or model points, edges and component types), its model components " +
    "(geode ID, name, type), its attributes per target and location with their value range " +
    "and time steps, and its current style.",
  uri: new ResourceTemplate("vease://data/{id}", { list: undefined }),
  metadata: { mimeType: "application/json" },
  handler: readDataDetails,
});

export { readDataDetails };
