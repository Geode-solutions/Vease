import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { createMockEvent } from "@vease_tests/utils/server_utils";
import { expectUpload } from "@vease_server/utils/file_transfer";
import fs from "node:fs/promises";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/files/upload.post";
import os from "node:os";
import path from "node:path";

vi.setConfig({ testTimeout: 10_000 });

const BAD_REQUEST = 400;
const NOT_FOUND = 404;

function uploadEvent(url: string, rawBody: Buffer): ReturnType<typeof createMockEvent> {
  return createMockEvent({
    method: "POST",
    url,
    headers: { "content-type": "application/octet-stream" },
    rawBody,
  });
}

describe("the POST /api/controller/files/upload endpoint", () => {
  let directory = "";

  beforeEach(async () => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "vease-upload-"));
  });

  afterEach(async () => {
    await fs.rm(directory, { recursive: true, force: true });
  });

  test("writes the raw body to the path bound to the token", async () => {
    const filePath = path.join(directory, "shot.png");
    const token = expectUpload(filePath);
    const bytes = Buffer.from("\u0089PNG\u0000\u00FF", "latin1");

    await expect(
      handler(uploadEvent(`/api/controller/files/upload?token=${token}`, bytes)),
    ).resolves.toStrictEqual({ statusCode: 200, response: {} });
    await expect(fs.readFile(filePath)).resolves.toStrictEqual(bytes);
  });

  test("ignores any path passed with the upload", async () => {
    const filePath = path.join(directory, "shot.png");
    const otherPath = path.join(directory, "other.png");
    const token = expectUpload(filePath);

    await handler(
      uploadEvent(
        `/api/controller/files/upload?token=${token}&filePath=${encodeURIComponent(otherPath)}`,
        Buffer.from("bytes"),
      ),
    );

    await expect(fs.readFile(filePath, "utf8")).resolves.toBe("bytes");
    await expect(fs.access(otherPath)).rejects.toThrow("ENOENT");
  });

  test("rejects an empty body without consuming the token", async () => {
    const filePath = path.join(directory, "shot.png");
    const token = expectUpload(filePath);
    const url = `/api/controller/files/upload?token=${token}`;
    const event = uploadEvent(url, Buffer.alloc(0));

    await expect(handler(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    await expect(fs.access(filePath)).rejects.toThrow("ENOENT");
    const retry = uploadEvent(url, Buffer.from("bytes"));
    await expect(handler(retry)).resolves.toStrictEqual({ statusCode: 200, response: {} });
  });

  test("answers 404 to an unknown token before reading the body", async () => {
    const event = uploadEvent("/api/controller/files/upload?token=unknown", Buffer.alloc(0));

    await expect(handler(event)).resolves.toMatchObject({ code: NOT_FOUND });
  });

  test("answers 404 to an unknown token", async () => {
    const event = uploadEvent("/api/controller/files/upload?token=unknown", Buffer.from("x"));

    await expect(handler(event)).resolves.toMatchObject({ code: NOT_FOUND });
    expect(getResponseStatus(event)).toBe(NOT_FOUND);
  });
});
