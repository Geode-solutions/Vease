import { afterEach, describe, expect, test, vi } from "vitest";
import { createMockEvent } from "@vease_tests/server_utils";
import { getLlamaStatus } from "@vease_server/utils/llama_cpp";
import handler from "@vease_server/api/llm/status.get";

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  getLlamaStatus: vi.fn<typeof getLlamaStatus>(),
}));

describe("the GET /api/llm/status endpoint", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  test("reports a running server's connection info", () => {
    vi.mocked(getLlamaStatus).mockReturnValue({
      running: true,
      port: 4891,
      apiKey: "secret",
    });

    const result = handler(createMockEvent({ method: "GET" }));

    expect(result).toStrictEqual({ statusCode: 200, running: true, port: 4891, apiKey: "secret" });
  });

  test("reports when no server is running", () => {
    vi.mocked(getLlamaStatus).mockReturnValue({ running: false });

    const result = handler(createMockEvent({ method: "GET" }));

    expect(result).toStrictEqual({ statusCode: 200, running: false });
  });
});
