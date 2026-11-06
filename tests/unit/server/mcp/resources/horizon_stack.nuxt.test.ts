import { describe, expect, test, vi } from "vitest";
import { identityMcpToolDefinition, okResult } from "@vease_tests/utils/server_utils";
import resource, { readHorizonStack } from "@vease_server/mcp/resources/horizon_stack";
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

const STACK_ID = "0123456789abcdef0123456789abcdef";

describe("vease-horizon-stack MCP resource", () => {
  test("is exposed as the vease://horizon-stack/{id} template", () => {
    expect(resource.uri).toStrictEqual(
      new ResourceTemplate("vease://horizon-stack/{id}", { list: undefined }),
    );
  });

  test("reads the horizon stack with the id from the template", async () => {
    const response = { horizons: [{ id: "h", name: "Top" }], units: [] };
    vi.mocked(callControllerApi).mockResolvedValue(okResult({ statusCode: 200, response }));
    const uri = new URL(`vease://horizon-stack/${STACK_ID}`);

    const result = await readHorizonStack(uri, { id: STACK_ID });

    expect(callControllerApi).toHaveBeenCalledWith(
      `/api/controller/horizon_stack/info?id=${STACK_ID}`,
      { method: "GET", errorPrefix: "Error reading horizon stack" },
    );
    expect(result).toStrictEqual({
      contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(response) }],
    });
  });
});
