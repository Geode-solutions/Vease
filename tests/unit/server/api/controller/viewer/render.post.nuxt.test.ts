import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { callSchema } from "@ogw_shared/utils/call_schema";
import { createMockEvent } from "@vease_tests/server_utils";
import { getViewerWebSocketClient } from "@ogw_server/utils/server_config";
import handler from "@vease_server/api/controller/viewer/render.post";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

vi.mock(import("@ogw_shared/utils/call_schema"), () => ({
  callSchema: vi.fn<typeof callSchema>(),
}));
vi.mock(import("@ogw_server/utils/server_config"), () => ({
  getViewerWebSocketClient: vi.fn<typeof getViewerWebSocketClient>(),
}));

const fakeClient = { isOpen: () => true };

describe("the POST /api/controller/viewer/render endpoint", () => {
  beforeEach(() => {
    vi.mocked(getViewerWebSocketClient).mockResolvedValue(
      fakeClient as unknown as Awaited<ReturnType<typeof getViewerWebSocketClient>>,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
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

  test("wraps a downstream failure into a 500 h3 error", async () => {
    vi.mocked(callSchema).mockRejectedValue(new Error("viewer unreachable"));

    await expect(handler(createMockEvent({ method: "POST" }))).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: "viewer unreachable",
    });
  });
});
