import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import create from "@vease_server/api/controller/data/create.post";
import deleteData from "@vease_server/api/controller/data/delete.post";
import { dispatchCommand } from "@vease_server/utils/command_bus";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import rename from "@vease_server/api/controller/data/rename.post";

vi.setConfig({ testTimeout: 10_000 });

// A mock resolving to never fits every result type of the generic dispatchCommand
vi.mock(import("@vease_server/utils/command_bus"), () => ({
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

const BAD_REQUEST = 400;
const DATA_ID = "0123456789abcdef0123456789abcdef";
const OTHER_ID = "fedcba9876543210fedcba9876543210";

const ROUTES = [
  {
    route: "create",
    handler: create,
    command: "create-data",
    params: {
      kind: "curve",
      name: "path",
      points: [
        [0, 0, 0],
        [1, 0, 0],
      ],
      closed: true,
    },
    result: { id: DATA_ID, name: "path" },
  },
  {
    route: "rename",
    handler: rename,
    command: "rename-data",
    params: { id: DATA_ID, name: "renamed" },
    result: { id: DATA_ID, name: "renamed" },
  },
  {
    route: "delete",
    handler: deleteData,
    command: "delete-data",
    params: { ids: [DATA_ID, OTHER_ID] },
    result: { ids: [DATA_ID, OTHER_ID] },
  },
];

const INVALID_BODIES = [
  {
    route: "create",
    handler: create,
    reason: "an unknown kind",
    body: { kind: "volume", name: "solid", points: [[0, 0, 0]] },
  },
  { route: "create", handler: create, reason: "no points", body: { kind: "point", name: "dot" } },
  {
    route: "create",
    handler: create,
    reason: "a 2D point",
    body: { kind: "point", name: "dot", points: [[0, 0]] },
  },
  {
    route: "create",
    handler: create,
    reason: "a stray action",
    body: { action: "create", kind: "point", name: "dot", points: [[0, 0, 0]] },
  },
  { route: "rename", handler: rename, reason: "no name", body: { id: DATA_ID } },
  {
    route: "rename",
    handler: rename,
    reason: "a short id",
    body: { id: "short", name: "renamed" },
  },
  {
    route: "rename",
    handler: rename,
    reason: "an ids list",
    body: { ids: [DATA_ID], name: "renamed" },
  },
  { route: "delete", handler: deleteData, reason: "an empty ids list", body: { ids: [] } },
  { route: "delete", handler: deleteData, reason: "a short id", body: { ids: ["short"] } },
];

describe("the POST /api/controller/data/{create,rename,delete} endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test.each(ROUTES)(
    "data/$route forwards validated params to the $command command",
    async ({ handler, command, params, result }) => {
      vi.mocked(dispatchCommand).mockResolvedValue(result);

      await expect(handler(eventWithBody(params))).resolves.toStrictEqual({
        statusCode: 200,
        response: result,
      });
      expect(dispatchCommand).toHaveBeenCalledWith(command, params);
    },
  );

  test.each(INVALID_BODIES)("data/$route rejects $reason with 400", async ({ handler, body }) => {
    const event = eventWithBody(body);

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
