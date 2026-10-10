import { describe, expect, test, vi } from "vitest";
import {
  errResult,
  fakeMcpRequestExtra,
  identityMcpToolDefinition,
  okResult,
} from "@vease_tests/utils/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import tool from "@vease_server/mcp/tools/export";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

describe("export MCP tool", () => {
  test("exports a screenshot and reports the file path", async () => {
    const input = {
      kind: "screenshot" as const,
      filePath: "/tmp/shot.png",
      includeBackground: false,
    };
    vi.mocked(callControllerApi).mockResolvedValue(
      okResult({ statusCode: 200, response: { filePath: "/tmp/shot.png" } }),
    );

    const result = await tool.handler(input, fakeMcpRequestExtra());

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/export", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      errorPrefix: "Error exporting",
    });
    expect(result).toBe("Exported the screenshot to /tmp/shot.png");
  });

  test("forwards the controller error", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error exporting: /tmp/shot.png already exists; choose another path"),
    );

    const result = await tool.handler(
      { kind: "screenshot", filePath: "/tmp/shot.png", includeBackground: undefined },
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error exporting: /tmp/shot.png already exists; choose another path");
  });
});
