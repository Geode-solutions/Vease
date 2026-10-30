// Third party imports
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { defineMcpResource } from "@nuxtjs/mcp-toolkit/server";

// Local imports
import { readControllerResource } from "@vease_server/mcp/utils/controller_resource";

async function readColormaps(uri: URL): Promise<ReadResourceResult> {
  const result = await readControllerResource(
    uri,
    "/api/controller/colormaps",
    "Error reading the colormaps",
  );
  return result;
}

export default defineMcpResource({
  name: "vease-colormaps",
  description:
    "The colormap presets available in Vease for coloring by attribute, grouped by category " +
    '(Sequential, Diverging, ...). The default colormap is "batlow".',
  uri: "vease://colormaps",
  metadata: { mimeType: "application/json" },
  handler: readColormaps,
});

export { readColormaps };
