import { describe, expect, test, vi } from "vitest";
import { errResult, identityMcpToolDefinition, okResult } from "@vease_tests/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/viewer/render";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

describe("render-viewer MCP tool", () => {
  test("triggers a render and reports success", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(okResult({ rendered: true }));

    const result = await tool.handler({});

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/viewer/render", {
      headers: { "Content-Type": "application/json" },
      errorPrefix: "Error rendering viewer",
    });
    expect(result).toBe('Viewer rendered successfully: {"rendered":true}');
  });

  test("forwards the controller API's error message on failure", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error rendering viewer: viewer unreachable"),
    );

    const result = await tool.handler({});

    expect(result).toBe("Error rendering viewer: viewer unreachable");
  });
});
