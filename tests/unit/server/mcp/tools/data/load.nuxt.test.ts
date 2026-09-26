import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  errResult,
  fakeMcpRequestExtra,
  identityMcpToolDefinition,
  okResult,
} from "@vease_tests/server_utils";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";
import { readFile } from "node:fs/promises";
import tool from "@vease_server/mcp/tools/data/load";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("node:fs/promises"), async (importOriginal) => {
  const actual = await importOriginal();
  // The source imports fs as a default export; this mock must share one vi.fn() between both.
  const readFileMock = vi.fn<typeof readFile>();
  const mocked = {
    ...actual,
    readFile: readFileMock,
    default: { ...actual, readFile: readFileMock },
  };
  // Node:fs/promises's `readFile` has a large overload set; a vi.fn mock can
  // Only implement the single (path) form this codebase calls.
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock can't reproduce readFile's full native overload set
  return mocked as unknown as typeof actual;
});

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpTool: identityMcpToolDefinition,
}));

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

describe("load-file MCP tool", () => {
  beforeEach(() => {
    vi.mocked(readFile).mockResolvedValue(Buffer.from("binary-data"));
  });

  test("uploads the file's contents and reports success", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(okResult({ id: "item-1" }));

    const result = await tool.handler({ filePath: "/data/model.msh" }, fakeMcpRequestExtra());

    expect(readFile).toHaveBeenCalledWith("/data/model.msh");
    expect(callControllerApi).toHaveBeenCalledWith(
      "/api/controller/data/load",
      expect.objectContaining({
        // oxlint-disable-next-line no-unsafe-type-assertion -- expect.any() is typed as any by vitest
        body: expect.any(FormData) as FormData,
        errorPrefix: "Error loading file",
      }),
    );
    expect(result).toBe('File loaded successfully: {"id":"item-1"}');
  });

  test("reports a friendly error when the file cannot be read", async () => {
    vi.mocked(readFile).mockRejectedValue(new Error("ENOENT"));

    const result = await tool.handler({ filePath: "/missing/model.msh" }, fakeMcpRequestExtra());

    expect(result).toBe("Error: could not read file at /missing/model.msh");
    expect(callControllerApi).not.toHaveBeenCalled();
  });

  test("forwards the controller API's error message on failure", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error loading file: File type not allowed"),
    );

    const result = await tool.handler(
      { filePath: "/data/model.unsupported" },
      fakeMcpRequestExtra(),
    );

    expect(result).toBe("Error loading file: File type not allowed");
  });
});
