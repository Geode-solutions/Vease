import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import focus from "@vease_server/api/controller/view/focus.post";
import orient from "@vease_server/api/controller/view/orient.post";
import reset from "@vease_server/api/controller/view/reset.post";
import restore from "@vease_server/api/controller/view/restore.post";
import save from "@vease_server/api/controller/view/save.post";
import scene from "@vease_server/api/controller/view/scene.post";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;
const DATA_ID = "0123456789abcdef0123456789abcdef";
const POSITION_ID = 7;
const Z_SCALING = 2.5;

const ROUTES = [
  { route: "reset", handler: reset, command: "reset-view", params: {} },
  { route: "focus", handler: focus, command: "focus-view", params: { id: DATA_ID } },
  {
    route: "focus",
    handler: focus,
    command: "focus-view",
    params: { id: DATA_ID, componentIds: ["corner-1"] },
  },
  { route: "orient", handler: orient, command: "orient-view", params: { orientation: "zplus" } },
  { route: "save", handler: save, command: "save-view", params: { name: "top" } },
  {
    route: "restore",
    handler: restore,
    command: "restore-view",
    params: { positionId: POSITION_ID },
  },
  {
    route: "scene",
    handler: scene,
    command: "set-scene",
    params: { zScaling: Z_SCALING, backgroundColor: "#202020", axes: false, grid: true },
  },
];

const INVALID_BODIES = [
  { route: "reset", handler: reset, reason: "a stray action", body: { action: "reset" } },
  { route: "focus", handler: focus, reason: "no id", body: {} },
  { route: "focus", handler: focus, reason: "a short id", body: { id: "short" } },
  {
    route: "focus",
    handler: focus,
    reason: "an empty componentIds list",
    body: { id: DATA_ID, componentIds: [] },
  },
  { route: "orient", handler: orient, reason: "no orientation", body: {} },
  {
    route: "orient",
    handler: orient,
    reason: "an unknown orientation",
    body: { orientation: "up" },
  },
  { route: "save", handler: save, reason: "an empty name", body: { name: "" } },
  { route: "restore", handler: restore, reason: "a non integer id", body: { positionId: 1.5 } },
  { route: "scene", handler: scene, reason: "a zero zScaling", body: { zScaling: 0 } },
  {
    route: "scene",
    handler: scene,
    reason: "a malformed background color",
    body: { backgroundColor: "orange" },
  },
];

describe("the POST /api/controller/view/* endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test.each(ROUTES)(
    "view/$route forwards $params to the $command command",
    async ({ handler, command, params }) => {
      const result = { applied: true };
      vi.mocked(dispatchCommand).mockResolvedValue(result);

      await expect(handler(eventWithBody(params))).resolves.toStrictEqual({
        statusCode: 200,
        response: result,
      });
      expect(dispatchCommand).toHaveBeenCalledWith(command, params);
    },
  );

  test.each(INVALID_BODIES)("view/$route rejects $reason with 400", async ({ handler, body }) => {
    await expect(handler(eventWithBody(body))).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
