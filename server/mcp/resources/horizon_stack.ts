// Third party imports
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Variables } from "@modelcontextprotocol/sdk/shared/uriTemplate.js";
import { defineMcpResource } from "@nuxtjs/mcp-toolkit/server";

// Local imports
import { readControllerResource } from "@vease_server/mcp/utils/controller_resource";

async function readHorizonStack(uri: URL, { id }: Variables): Promise<ReadResourceResult> {
  if (typeof id !== "string") {
    throw new TypeError(`Invalid horizon stack ID in ${uri.href}`);
  }
  const query = new URLSearchParams({ id });
  const result = await readControllerResource(
    uri,
    `/api/controller/horizon_stack/info?${query}`,
    "Error reading horizon stack",
  );
  return result;
}

export default defineMcpResource({
  name: "vease-horizon-stack",
  description:
    "Horizons and stratigraphic units of a horizon stack (HorizonStack3D) loaded in Vease (ID " +
    "from vease://data): the ID and name of each horizon and unit, ordered from top to bottom.",
  uri: new ResourceTemplate("vease://horizon-stack/{id}", { list: undefined }),
  metadata: { mimeType: "application/json" },
  handler: readHorizonStack,
});

export { readHorizonStack };
