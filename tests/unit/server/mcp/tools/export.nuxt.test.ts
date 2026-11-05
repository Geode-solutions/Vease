import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  controllerUrl,
  jsonResponse,
  sentRequest,
  stubControllerFetch,
} from "@vease_tests/unit/server/mcp/tools/controller_fetch";
import { fakeMcpRequestExtra, identityMcpToolDefinition } from "@vease_tests/utils/server_utils";
import tool from "@vease_server/mcp/tools/export";

vi.setConfig({ testTimeout: 10_000 });

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

describe("export MCP tool", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    stubControllerFetch(fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("posts a screenshot to /api/controller/export/screenshot without the kind", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ statusCode: 200, response: { filePath: "/tmp/shot.png" } }),
    );

    const result = await tool.handler(
      { kind: "screenshot", filePath: "/tmp/shot.png", includeBackground: false },
      fakeMcpRequestExtra(),
    );

    expect(sentRequest(fetchMock)).toStrictEqual({
      url: controllerUrl("export/screenshot"),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { filePath: "/tmp/shot.png", includeBackground: false },
    });
    expect(result).toBe("Exported the screenshot to /tmp/shot.png");
  });

  test("posts a project to /api/controller/export/project", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ statusCode: 200, response: { filePath: "/tmp/scene.vease" } }),
    );

    const result = await tool.handler(
      { kind: "project", filePath: "/tmp/scene.vease", includeBackground: undefined },
      fakeMcpRequestExtra(),
    );

    expect(sentRequest(fetchMock)).toMatchObject({
      url: controllerUrl("export/project"),
      body: { filePath: "/tmp/scene.vease" },
    });
    expect(result).toBe("Exported the project to /tmp/scene.vease");
  });

  test("rejects includeBackground on a project export without calling the controller", async () => {
    const result = await tool.handler(
      { kind: "project", filePath: "/tmp/scene.vease", includeBackground: true },
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error exporting: includeBackground cannot be given to a project export");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("forwards the controller error", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { description: "/tmp/shot.png already exists; choose another path" },
        { failed: true },
      ),
    );

    const result = await tool.handler(
      { kind: "screenshot", filePath: "/tmp/shot.png", includeBackground: undefined },
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error exporting: /tmp/shot.png already exists; choose another path");
  });
});
