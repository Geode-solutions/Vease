import { LONG_COMMAND_TIMEOUT_MS, dispatchCommand } from "@vease_server/utils/command_bus";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { expectUpload, hasUpload } from "@vease_server/utils/file_transfer";
import { consola } from "consola";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import fs from "node:fs/promises";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/controller/export.post";
import os from "node:os";
import path from "node:path";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/command_bus"), async (importOriginal) => ({
  ...(await importOriginal()),
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

vi.mock(import("@vease_server/utils/file_transfer"), async (importOriginal) => ({
  ...(await importOriginal()),
  expectUpload: vi.fn<typeof expectUpload>(),
}));

const BAD_REQUEST = 400;
const TOKEN = "upload-token";

async function exportResult(
  body: Record<string, unknown>,
): Promise<{ status: number; response: unknown }> {
  const event = eventWithBody(body);
  const response = await handler(event);
  return { status: getResponseStatus(event), response };
}

describe("the POST /api/controller/export endpoint", () => {
  let directory = "";

  beforeEach(async () => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
    vi.mocked(expectUpload).mockReturnValue(TOKEN);
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "vease-export-"));
  });

  afterEach(async () => {
    await fs.rm(directory, { recursive: true, force: true });
  });

  test("dispatches export with an upload url and a long timeout", async () => {
    const filePath = path.join(directory, "shot.png");
    vi.mocked(dispatchCommand).mockResolvedValue({});

    await expect(
      handler(eventWithBody({ kind: "screenshot", filePath, includeBackground: false })),
    ).resolves.toStrictEqual({ statusCode: 200, response: { filePath } });
    expect(expectUpload).toHaveBeenCalledWith(filePath);
    expect(dispatchCommand).toHaveBeenCalledWith(
      "export",
      {
        kind: "screenshot",
        format: "png",
        includeBackground: false,
        uploadUrl: `/api/controller/files/upload?token=${TOKEN}`,
      },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  });

  test("dispatches a project export", async () => {
    const filePath = path.join(directory, "scene.vease");
    vi.mocked(dispatchCommand).mockResolvedValue({});

    await handler(eventWithBody({ kind: "project", filePath }));

    expect(dispatchCommand).toHaveBeenCalledWith(
      "export",
      {
        kind: "project",
        format: "vease",
        includeBackground: undefined,
        uploadUrl: `/api/controller/files/upload?token=${TOKEN}`,
      },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  });

  test("cancels the upload token when the export fails", async () => {
    const actual = await vi.importActual<{ expectUpload: typeof expectUpload }>(
      "@vease_server/utils/file_transfer",
    );
    const filePath = path.join(directory, "shot.png");
    const token = actual.expectUpload(filePath);
    vi.mocked(expectUpload).mockReturnValue(token);
    vi.mocked(dispatchCommand).mockRejectedValue(new Error("Vease did not answer in time"));
    expect(hasUpload(token)).toBe(true);

    await expect(exportResult({ kind: "screenshot", filePath })).resolves.toMatchObject({
      response: { description: "Vease did not answer in time" },
    });
    expect(hasUpload(token)).toBe(false);
  });

  test("rejects a screenshot path that is not png/jpg", async () => {
    await expect(
      exportResult({ kind: "screenshot", filePath: path.join(directory, "shot.gif") }),
    ).resolves.toMatchObject({
      status: BAD_REQUEST,
      response: { description: "A screenshot must be exported to a .png or .jpg file" },
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a project path that is not .vease", async () => {
    await expect(
      exportResult({ kind: "project", filePath: path.join(directory, "scene.zip") }),
    ).resolves.toMatchObject({
      status: BAD_REQUEST,
      response: { description: "A project must be exported to a .vease file" },
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a relative path", async () => {
    await expect(
      exportResult({ kind: "screenshot", filePath: "shots/shot.png" }),
    ).resolves.toMatchObject({
      status: BAD_REQUEST,
      response: { description: "shots/shot.png is not an absolute path" },
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a missing parent directory", async () => {
    const missing = path.join(directory, "missing");

    await expect(
      exportResult({ kind: "screenshot", filePath: path.join(missing, "shot.png") }),
    ).resolves.toMatchObject({
      status: BAD_REQUEST,
      response: { description: `The directory ${missing} does not exist` },
    });
    expect(expectUpload).not.toHaveBeenCalled();
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects an existing file", async () => {
    const filePath = path.join(directory, "shot.png");
    await fs.writeFile(filePath, "existing");

    await expect(exportResult({ kind: "screenshot", filePath })).resolves.toMatchObject({
      status: BAD_REQUEST,
      response: { description: `${filePath} already exists; choose another path` },
    });
    expect(expectUpload).not.toHaveBeenCalled();
    expect(dispatchCommand).not.toHaveBeenCalled();
    await expect(fs.readFile(filePath, "utf8")).resolves.toBe("existing");
  });

  test("rejects an unknown kind", async () => {
    await expect(
      exportResult({ kind: "video", filePath: path.join(directory, "clip.png") }),
    ).resolves.toMatchObject({ status: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
