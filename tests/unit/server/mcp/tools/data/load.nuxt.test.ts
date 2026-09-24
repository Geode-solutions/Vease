import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { errResult, okResult } from "@vease_tests/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { readFile } from "node:fs/promises";
import tool from "@vease_server/mcp/tools/data/load";

vi.mock(import("node:fs/promises"), () => {
  // The source imports fs as a default export; this mock must share one vi.fn() between both.
  const readFileMock = vi.fn<typeof readFile>();
  return { readFile: readFileMock, default: { readFile: readFileMock } };
});

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: <TDefinition>(definition: TDefinition): TDefinition => definition,
}));

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

describe("load-file MCP tool", () => {
  beforeEach(() => {
    vi.mocked(readFile).mockResolvedValue(Buffer.from("binary-data"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  test("uploads the file's contents and reports success", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(okResult({ id: "item-1" }));

    const result = await tool.handler({ filePath: "/data/model.msh" });

    expect(readFile).toHaveBeenCalledWith("/data/model.msh");
    expect(callControllerApi).toHaveBeenCalledWith(
      "/api/controller/data/load",
      expect.objectContaining({ body: expect.any(FormData), errorPrefix: "Error loading file" }),
    );
    expect(result).toBe('File loaded successfully: {"id":"item-1"}');
  });

  test("reports a friendly error when the file cannot be read", async () => {
    vi.mocked(readFile).mockRejectedValue(new Error("ENOENT"));

    const result = await tool.handler({ filePath: "/missing/model.msh" });

    expect(result).toBe("Error: could not read file at /missing/model.msh");
    expect(callControllerApi).not.toHaveBeenCalled();
  });

  test("forwards the controller API's error message on failure", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error loading file: File type not allowed"),
    );

    const result = await tool.handler({ filePath: "/data/model.unsupported" });

    expect(result).toBe("Error loading file: File type not allowed");
  });
});
