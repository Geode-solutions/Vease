import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { callSchema } from "@ogw_shared/utils/call_schema";
import { createMockEvent } from "@vease_tests/server_utils";
import { getViewerWebSocketClient } from "@ogw_server/utils/server_config";
import handler from "@vease_server/api/controller/viewer/mesh/points/visibility.post";
import opengeodeweb_viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";

vi.mock(import("@ogw_shared/utils/call_schema"), () => ({
  callSchema: vi.fn<typeof callSchema>(),
}));
vi.mock(import("@ogw_server/utils/server_config"), () => ({
  getViewerWebSocketClient: vi.fn<typeof getViewerWebSocketClient>(),
}));

const fakeClient = { isOpen: () => true };

function eventWithBody(body: unknown): ReturnType<typeof createMockEvent> {
  return createMockEvent({
    method: "POST",
    headers: { "content-type": "application/json" },
    rawBody: JSON.stringify(body),
  });
}

describe("the POST /api/controller/viewer/mesh/points/visibility endpoint", () => {
  beforeEach(() => {
    vi.mocked(getViewerWebSocketClient).mockResolvedValue(
      fakeClient as unknown as Awaited<ReturnType<typeof getViewerWebSocketClient>>,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  test("parses the visibility flag and forwards it to the viewer", async () => {
    vi.mocked(callSchema).mockResolvedValue({ success: true });

    const result = await handler(eventWithBody({ id: "mesh-1", visibility: "true" }));

    expect(callSchema).toHaveBeenCalledWith({
      schema: opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility,
      params: { id: "mesh-1", visibility: true },
      client: fakeClient,
      timeout: undefined,
    });
    expect(result).toStrictEqual({ statusCode: 200, response: { success: true } });
  });

  test("accepts boolean and numeric visibility values", async () => {
    vi.mocked(callSchema).mockResolvedValue({ success: true });

    await handler(eventWithBody({ id: "mesh-1", visibility: false }));
    expect(callSchema).toHaveBeenLastCalledWith(
      expect.objectContaining({ params: { id: "mesh-1", visibility: false } }),
    );

    await handler(eventWithBody({ id: "mesh-1", visibility: 0 }));
    expect(callSchema).toHaveBeenLastCalledWith(
      expect.objectContaining({ params: { id: "mesh-1", visibility: false } }),
    );
  });

  test("wraps a downstream failure into a 500 h3 error", async () => {
    vi.mocked(callSchema).mockRejectedValue(new Error("mesh not found"));

    await expect(
      handler(eventWithBody({ id: "missing", visibility: true })),
    ).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: "mesh not found",
    });
  });
});
