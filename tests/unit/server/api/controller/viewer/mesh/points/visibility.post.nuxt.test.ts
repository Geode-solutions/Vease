import { beforeEach, describe, expect, test, vi } from "vitest";
import { callSchema } from "@ogw_shared/utils/call_schema";
import { consola } from "consola";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import { getViewerWebSocketClient } from "@ogw_server/utils/server_config";
import handler from "@vease_server/api/controller/viewer/mesh/points/visibility.post";
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
// The schema requires a 32 characters id
const MESH_ID = "0123456789abcdef0123456789abcdef";

describe("the POST /api/controller/viewer/mesh/points/visibility endpoint", () => {
  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
    vi.mocked(getViewerWebSocketClient).mockResolvedValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the `isOpen` member this codebase reads, not the full ServerWsRpcClient shape
      fakeClient as unknown as Awaited<ReturnType<typeof getViewerWebSocketClient>>,
    );
  });

  test("parses the visibility flag and forwards it to the viewer", async () => {
    vi.mocked(callSchema).mockResolvedValue({ success: true });

    const result = await handler(eventWithBody({ id: MESH_ID, visibility: "true" }));

    expect(callSchema).toHaveBeenCalledWith({
      schema: opengeodeweb_viewer_schemas.opengeodeweb_viewer.mesh.points.visibility,
      params: { id: MESH_ID, visibility: true },
      client: fakeClient,
      timeout: undefined,
    });
    expect(result).toStrictEqual({ statusCode: 200, response: { success: true } });
  });

  test("accepts boolean and numeric visibility values", async () => {
    vi.mocked(callSchema).mockResolvedValue({ success: true });

    await handler(eventWithBody({ id: MESH_ID, visibility: false }));
    expect(callSchema).toHaveBeenLastCalledWith(
      expect.objectContaining({ params: { id: MESH_ID, visibility: false } }),
    );

    await handler(eventWithBody({ id: MESH_ID, visibility: 0 }));
    expect(callSchema).toHaveBeenLastCalledWith(
      expect.objectContaining({ params: { id: MESH_ID, visibility: false } }),
    );
  });

  test.each([
    { case: "an id that is not 32 characters long", body: { id: "mesh-1", visibility: true } },
    { case: "a missing visibility", body: { id: MESH_ID } },
    { case: "a visibility of an unsupported type", body: { id: MESH_ID, visibility: {} } },
    { case: "unexpected properties", body: { id: MESH_ID, visibility: true, extra: 1 } },
  ])("returns a 400 error response for $case", async ({ body }) => {
    const event = eventWithBody(body);

    await expect(handler(event)).resolves.toMatchObject({
      code: BAD_REQUEST,
      name: "Bad Request",
    });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(callSchema).not.toHaveBeenCalled();
  });

  test("turns a downstream failure into a 500 error response", async () => {
    vi.mocked(callSchema).mockRejectedValue(new Error("mesh not found"));

    const event = eventWithBody({ id: MESH_ID, visibility: true });
    await expect(handler(event)).resolves.toStrictEqual({
      code: INTERNAL_SERVER_ERROR,
      name: "Internal Server Error",
      description: "mesh not found",
    });
    expect(getResponseStatus(event)).toBe(INTERNAL_SERVER_ERROR);
  });
});
