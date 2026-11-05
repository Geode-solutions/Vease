import { describe, expect, test, vi } from "vitest";
import { errResult, identityMcpToolDefinition, okResult } from "@vease_tests/utils/server_utils";
import resource, { readData } from "@vease_server/mcp/resources/data";
import { callControllerApi } from "@vease_server/mcp/utils/controller_api";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/mcp/utils/controller_api"), () => ({
  callControllerApi: vi.fn<typeof callControllerApi>(),
}));

// The real @nuxtjs/mcp-toolkit/server pulls in Nitro internals vitest can't resolve.
vi.mock(import("@nuxtjs/mcp-toolkit/server"), () => ({
  defineMcpResource: identityMcpToolDefinition,
}));

const DATA_URI = new URL("vease://data");

describe("vease-data MCP resource", () => {
  test("is exposed as vease://data", () => {
    expect(resource).toMatchObject({ name: "vease-data", uri: "vease://data" });
  });

  test("reads vease://data", async () => {
    const response = { data: [{ id: "mesh-1", name: "surface" }] };
    vi.mocked(callControllerApi).mockResolvedValue(okResult({ statusCode: 200, response }));

    const result = await readData(DATA_URI);

    expect(callControllerApi).toHaveBeenCalledWith("/api/controller/data/list", {
      method: "GET",
      errorPrefix: "Error reading the loaded data",
    });
    expect(result).toStrictEqual({
      contents: [
        { uri: "vease://data", mimeType: "application/json", text: JSON.stringify(response) },
      ],
    });
  });

  test("throws with the controller message on failure", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(
      errResult("Error reading the loaded data: Vease is not ready"),
    );

    await expect(readData(DATA_URI)).rejects.toThrow(
      "Error reading the loaded data: Vease is not ready",
    );
  });

  test("throws when the route payload has no response", async () => {
    vi.mocked(callControllerApi).mockResolvedValue(okResult({ statusCode: 200 }));

    await expect(readData(DATA_URI)).rejects.toThrow(
      "Error reading the loaded data: the route payload has no response",
    );
  });
});
