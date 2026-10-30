// `ok` is the reply field shared with the browser; it appears in most assertions
// oxlint-disable eslint/id-length
import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/commands/reply.post";
import { resolveReply } from "@vease_server/utils/command_bus";

vi.mock(import("@vease_server/utils/command_bus"));

vi.setConfig({ testTimeout: 10_000 });

const BAD_REQUEST = 400;

describe("the POST /api/controller/commands/reply endpoint", () => {
  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("forwards the reply to the bus", async () => {
    const body = { requestId: "request-1", ok: true, result: { done: true } };

    await expect(handler(eventWithBody(body))).resolves.toStrictEqual({
      statusCode: 200,
      response: {},
    });
    expect(resolveReply).toHaveBeenCalledWith(body);
  });

  test("forwards a failed reply to the bus", async () => {
    await handler(eventWithBody({ requestId: "request-1", ok: false, error: "boom" }));

    expect(resolveReply).toHaveBeenCalledWith({ requestId: "request-1", ok: false, error: "boom" });
  });

  test("returns 400 for a body without requestId", async () => {
    const event = eventWithBody({ ok: true });

    await expect(handler(event)).resolves.toMatchObject({
      code: BAD_REQUEST,
      name: "Bad Request",
    });
    expect(getResponseStatus(event)).toBe(BAD_REQUEST);
    expect(resolveReply).not.toHaveBeenCalled();
  });
});
