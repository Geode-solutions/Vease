import { describe, expect, test, vi } from "vitest";
import { identityMcpToolDefinition, okResult } from "@vease_tests/utils/server_utils";
import resource, { readDataDetails } from "@vease_server/mcp/resources/data_details";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpResource: identityMcpToolDefinition,
}));

const DATA_ID = "0123456789abcdef0123456789abcdef";

describe("vease-data-details MCP resource", () => {
  test("is exposed as the vease://data/{id} template", () => {
    expect(resource.uri).toStrictEqual(
      new ResourceTemplate("vease://data/{id}", { list: undefined }),
    );
  });

  test("reads vease://data/{id} with the id from the template", async () => {
    const response = { id: DATA_ID, targets: ["points"] };
    vi.mocked(callControllerApi).mockResolvedValue(okResult({ statusCode: 200, response }));
    const uri = new URL(`vease://data/${DATA_ID}`);

    const result = await readDataDetails(uri, { id: DATA_ID });

    expect(callControllerApi).toHaveBeenCalledWith(`/api/controller/data/details?id=${DATA_ID}`, {
      method: "GET",
      errorPrefix: "Error reading data details",
    });
    expect(result).toStrictEqual({
      contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(response) }],
    });
  });
});
