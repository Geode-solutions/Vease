import { describe, expect, test, vi } from "vitest";
import { errResult, identityMcpToolDefinition, okResult } from "@vease_tests/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/viewer/mesh/points/visibility";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

describe("set-mesh-points-visibility MCP tool", () => {
  test("sends the id and visibility flag and reports success", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(okResult({ success: true }));

    const result = await tool.handler({ id: "mesh-1", visibility: false });

    expect(callControllerApi).toHaveBeenCalledWith(
      "/api/controller/viewer/mesh/points/visibility",
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "mesh-1", visibility: false }),
        errorPrefix: "Error setting mesh points visibility",
      },
    );
    expect(result).toBe('Mesh points visibility set successfully: {"success":true}');
  });

  test("forwards the controller API's error message on failure", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error setting mesh points visibility: mesh not found"),
    );

    const result = await tool.handler({ id: "missing", visibility: true });

    expect(result).toBe("Error setting mesh points visibility: mesh not found");
  });
});
