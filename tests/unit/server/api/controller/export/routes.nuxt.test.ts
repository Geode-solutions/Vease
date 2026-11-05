import { LONG_COMMAND_TIMEOUT_MS, dispatchCommand } from "@vease_server/utils/command_bus";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { expectUpload } from "@vease_server/utils/file_transfer";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import project from "@vease_server/api/controller/export/project.post";
import screenshot from "@vease_server/api/controller/export/screenshot.post";

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
const UPLOAD_URL = `/api/controller/files/upload?token=${TOKEN}`;

describe("the POST /api/controller/export/* endpoints", () => {
  let directory = "";

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.spyOn(consola, "error").mockReturnValue(undefined);
    vi.mocked(expectUpload).mockReturnValue(TOKEN);
    vi.mocked(dispatchCommand).mockResolvedValue({});
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "vease-export-"));
  });

  afterEach(async () => {
    await fs.rm(directory, { recursive: true, force: true });
  });

  test("export/screenshot dispatches a png screenshot and returns the path", async () => {
    const filePath = path.join(directory, "shot.png");

    await expect(
      screenshot(eventWithBody({ filePath, includeBackground: false })),
    ).resolves.toStrictEqual({ statusCode: 200, response: { filePath } });
    expect(expectUpload).toHaveBeenCalledWith(filePath);
    expect(dispatchCommand).toHaveBeenCalledWith(
      "export-screenshot",
      { includeBackground: false, format: "png", uploadUrl: UPLOAD_URL },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  });

  test("export/screenshot dispatches a jpg screenshot", async () => {
    const filePath = path.join(directory, "shot.jpg");

    await screenshot(eventWithBody({ filePath }));

    expect(dispatchCommand).toHaveBeenCalledWith(
      "export-screenshot",
      { includeBackground: undefined, format: "jpg", uploadUrl: UPLOAD_URL },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  });

  test("export/screenshot rejects a path that is not png/jpg", async () => {
    const event = eventWithBody({ filePath: path.join(directory, "shot.vease") });

    await expect(screenshot(event)).resolves.toMatchObject({
      code: BAD_REQUEST,
      description: "A screenshot must be exported to a .png or .jpg file",
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("export/screenshot rejects a stray kind with 400", async () => {
    const event = eventWithBody({ kind: "screenshot", filePath: path.join(directory, "shot.png") });

    await expect(screenshot(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("export/project dispatches a project export and returns the path", async () => {
    const filePath = path.join(directory, "scene.vease");

    await expect(project(eventWithBody({ filePath }))).resolves.toStrictEqual({
      statusCode: 200,
      response: { filePath },
    });
    expect(dispatchCommand).toHaveBeenCalledWith(
      "export-project",
      { format: "vease", uploadUrl: UPLOAD_URL },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  });

  test("export/project rejects a path that is not .vease", async () => {
    const event = eventWithBody({ filePath: path.join(directory, "scene.png") });

    await expect(project(event)).resolves.toMatchObject({
      code: BAD_REQUEST,
      description: "A project must be exported to a .vease file",
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("export/project rejects includeBackground with 400", async () => {
    const event = eventWithBody({
      filePath: path.join(directory, "scene.vease"),
      includeBackground: true,
    });

    await expect(project(event)).resolves.toMatchObject({ code: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("forwards a path check failure as a 400", async () => {
    const event = eventWithBody({ filePath: "scene.vease" });

    await expect(project(event)).resolves.toMatchObject({
      code: BAD_REQUEST,
      description: "scene.vease is not an absolute path",
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
