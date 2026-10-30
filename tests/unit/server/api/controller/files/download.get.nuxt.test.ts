import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { createMockEvent } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/files/download.get";
import { stageDownload } from "@vease_server/utils/file_transfer";

vi.setConfig({ testTimeout: 10_000 });

const NOT_FOUND = 404;

function downloadEvent(token: string): ReturnType<typeof createMockEvent> {
  return createMockEvent({ url: `/api/controller/files/download?token=${token}` });
}

describe("the GET /api/controller/files/download endpoint", () => {
  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
  });

  test("sends the staged bytes once", async () => {
    const data = Buffer.from("project-bytes");
    const token = stageDownload(data, "project.vease");
    const event = downloadEvent(token);

    await expect(handler(event)).resolves.toStrictEqual(data);
    expect(event.node.res.getHeader("content-type")).toBe("application/octet-stream");

    const replayed = downloadEvent(token);
    await handler(replayed);
    expect(getResponseStatus(replayed)).toBe(NOT_FOUND);
  });

  test("answers 404 to an unknown token", async () => {
    const event = downloadEvent("unknown");

    await expect(handler(event)).resolves.toMatchObject({ code: NOT_FOUND });
    expect(getResponseStatus(event)).toBe(NOT_FOUND);
  });
});
