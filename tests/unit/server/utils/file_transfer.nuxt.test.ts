import {
  TRANSFER_TOKEN_TTL_MS,
  cancelUpload,
  completeUpload,
  expectUpload,
  hasUpload,
  stageDownload,
  takeDownload,
} from "@vease_server/utils/file_transfer";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

vi.setConfig({ testTimeout: 10_000 });

const NOT_FOUND = 404;
const CONFLICT = 409;

function ioError(): Error {
  return Object.assign(new Error("EIO: i/o error, write"), { code: "EIO" });
}

describe("file transfer tokens", () => {
  let directory = "";

  beforeEach(async () => {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "vease-transfer-"));
  });

  afterEach(async () => {
    vi.useRealTimers();
    await fs.rm(directory, { recursive: true, force: true });
  });

  test("serves a staged download once", () => {
    const data = Buffer.from("project-bytes");
    const token = stageDownload(data, "project.vease");

    expect(takeDownload(token)).toStrictEqual({ data, filename: "project.vease" });
    expect(takeDownload(token)).toBeUndefined();
  });

  test("forgets an expired download", () => {
    vi.useFakeTimers();
    const token = stageDownload(Buffer.from("bytes"), "project.vease");

    vi.advanceTimersByTime(TRANSFER_TOKEN_TTL_MS);

    expect(takeDownload(token)).toBeUndefined();
  });

  test("writes an upload to its file path", async () => {
    const filePath = path.join(directory, "shot.png");
    const token = expectUpload(filePath);

    await completeUpload(token, Buffer.from("png-bytes"));

    await expect(fs.readFile(filePath, "utf8")).resolves.toBe("png-bytes");
  });

  test("rejects an expired upload token", async () => {
    vi.useFakeTimers();
    const filePath = path.join(directory, "shot.png");
    const token = expectUpload(filePath);

    vi.advanceTimersByTime(TRANSFER_TOKEN_TTL_MS);

    await expect(completeUpload(token, Buffer.from("png-bytes"))).rejects.toMatchObject({
      statusCode: NOT_FOUND,
    });
    await expect(fs.access(filePath)).rejects.toThrow("ENOENT");
  });

  test("rejects a reused upload token", async () => {
    const filePath = path.join(directory, "shot.png");
    const token = expectUpload(filePath);
    await completeUpload(token, Buffer.from("first"));

    await expect(completeUpload(token, Buffer.from("second"))).rejects.toMatchObject({
      statusCode: NOT_FOUND,
    });
    await expect(fs.readFile(filePath, "utf8")).resolves.toBe("first");
  });

  test("never overwrites an existing file", async () => {
    const filePath = path.join(directory, "shot.png");
    await fs.writeFile(filePath, "existing");
    const token = expectUpload(filePath);

    await expect(completeUpload(token, Buffer.from("new"))).rejects.toMatchObject({
      statusCode: CONFLICT,
      message: `${filePath} already exists; choose another path`,
    });
    await expect(fs.readFile(filePath, "utf8")).resolves.toBe("existing");
  });

  test("removes the partial file of a failed write", async () => {
    const filePath = path.join(directory, "shot.png");
    const token = expectUpload(filePath);
    vi.spyOn(fs, "writeFile").mockImplementationOnce(async () => {
      await fs.appendFile(filePath, "partial");
      throw ioError();
    });

    await expect(completeUpload(token, Buffer.from("bytes"))).rejects.toThrow("EIO");
    await expect(fs.access(filePath)).rejects.toThrow("ENOENT");
  });

  test("cancels an upload token", async () => {
    const filePath = path.join(directory, "shot.png");
    const token = expectUpload(filePath);

    cancelUpload(token);

    expect(hasUpload(token)).toBe(false);
    await expect(completeUpload(token, Buffer.from("bytes"))).rejects.toMatchObject({
      statusCode: NOT_FOUND,
    });
    await expect(fs.access(filePath)).rejects.toThrow("ENOENT");
  });
});
