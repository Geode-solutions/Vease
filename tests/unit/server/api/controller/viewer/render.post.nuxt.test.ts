import { beforeEach, describe, expect, test, vi } from "vitest";
import { createMockEvent, eventWithBody } from "@vease_tests/server_utils";
import { callSchema } from "@ogw_shared/utils/call_schema";
import { consola } from "consola";
import { getResponseStatus } from "h3";
import { getViewerWebSocketClient } from "@ogw_server/utils/server_config";
import handler from "@vease_server/api/controller/viewer/render.post";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_shared/utils/call_schema"), () => ({
  callSchema: vi.fn<typeof callSchema>(),
}));
vi.mock(import("@ogw_server/utils/server_config"), () => ({
  getViewerWebSocketClient: vi.fn<typeof getViewerWebSocketClient>(),
}));

const fakeClient = { isOpen: (): boolean => true };
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

describe("the POST /api/controller/viewer/render endpoint", () => {
  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
    vi.mocked(getViewerWebSocketClient).mockResolvedValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the `isOpen` member this codebase reads, not the full ServerWsRpcClient shape
      fakeClient as unknown as Awaited<ReturnType<typeof getViewerWebSocketClient>>,
    );
  });

  test("renders the viewer and returns the response", async () => {
    vi.mocked(callSchema).mockResolvedValue({ success: true });

    const result = await handler(createMockEvent({ method: "POST" }));

    expect(callSchema).toHaveBeenCalledWith({
      schema: opengeodeweb_viewer_schemas.opengeodeweb_viewer.viewer.render,
      client: fakeClient,
      timeout: undefined,
    });
    expect(result).toStrictEqual({ statusCode: 200, response: { success: true } });
  });

  test("returns a 400 error response when the body has unexpected properties", async () => {
    const event = eventWithBody({ unexpected: true });

    await expect(handler(event)).resolves.toMatchObject({
      code: BAD_REQUEST,
      name: "Bad Request",
    });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(callSchema).not.toHaveBeenCalled();
  });

  test("turns a downstream failure into a 500 error response", async () => {
    vi.mocked(callSchema).mockRejectedValue(new Error("viewer unreachable"));

    const event = createMockEvent({ method: "POST" });
    await expect(handler(event)).resolves.toStrictEqual({
      code: INTERNAL_SERVER_ERROR,
      name: "Internal Server Error",
      description: "viewer unreachable",
    });
    expect(getResponseStatus(event)).toBe(INTERNAL_SERVER_ERROR);
  });
});
