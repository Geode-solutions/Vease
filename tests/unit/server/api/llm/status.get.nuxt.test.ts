import { beforeEach, describe, expect, test, vi } from "vitest";
import { getLlamaStatus, isLlamaServerStarting } from "@vease_server/utils/llama_cpp";
import { consola } from "consola";
import { createMockEvent } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/llm/status.get";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  getLlamaStatus: vi.fn<typeof getLlamaStatus>(),
  isLlamaServerStarting: vi.fn<typeof isLlamaServerStarting>().mockReturnValue(false),
}));

const BAD_REQUEST = 400;

describe("the GET /api/llm/status endpoint", () => {
  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("reports a running server without leaking its connection info", async () => {
    vi.mocked(getLlamaStatus).mockReturnValue({
      running: true,
      port: 4891,
      apiKey: "secret",
    });

    const result = await handler(createMockEvent({ method: "GET" }));

    expect(result).toStrictEqual({ statusCode: 200, running: true, starting: false });
  });

  test("reports when no server is running", async () => {
    vi.mocked(getLlamaStatus).mockReturnValue({ running: false });

    const result = await handler(createMockEvent({ method: "GET" }));

    expect(result).toStrictEqual({ statusCode: 200, running: false, starting: false });
  });

  test("reports a server still starting", async () => {
    vi.mocked(getLlamaStatus).mockReturnValue({ running: false });
    vi.mocked(isLlamaServerStarting).mockReturnValueOnce(true);

    const result = await handler(createMockEvent({ method: "GET" }));

    expect(result).toStrictEqual({ statusCode: 200, running: false, starting: true });
  });

  test("returns a 400 error response when the query has unexpected parameters", async () => {
    const event = createMockEvent({ method: "GET", url: "/?unexpected=true" });

    await expect(handler(event)).resolves.toMatchObject({
      code: BAD_REQUEST,
      name: "Bad Request",
    });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(getLlamaStatus).not.toHaveBeenCalled();
  });
});
