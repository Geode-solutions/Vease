import { LONG_COMMAND_TIMEOUT_MS, dispatchCommand } from "@vease_server/utils/command_bus";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { buildMultipartBody, createMockEvent } from "@vease_tests/utils/server_utils";
import { createError, getResponseStatus } from "h3";
import {
  getAllowedFileExtensions,
  getAllowedGeodeObjectTypes,
  saveViewableFile,
  uploadFile,
} from "@vease_server/utils/data_file";
import { stageDownload, takeDownload } from "@vease_server/utils/file_transfer";
import { consola } from "consola";
import handler from "@vease_server/api/controller/data/load.post";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/data_file"), () => ({
  getAllowedFileExtensions: vi.fn<typeof getAllowedFileExtensions>(),
  getAllowedGeodeObjectTypes: vi.fn<typeof getAllowedGeodeObjectTypes>(),
  uploadFile: vi.fn<typeof uploadFile>(),
  saveViewableFile: vi.fn<typeof saveViewableFile>(),
}));

vi.mock(import("@vease_server/utils/file_transfer"), async (importOriginal) => ({
  ...(await importOriginal()),
  stageDownload: vi.fn<typeof stageDownload>(),
}));

vi.mock(import("@vease_server/utils/command_bus"), async (importOriginal) => ({
  ...(await importOriginal()),
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

function eventWithFile(
  filename: string | undefined,
  fieldName = "file",
): ReturnType<typeof createMockEvent> {
  const { contentType, body } = buildMultipartBody(
    filename === undefined
      ? []
      : [
          {
            name: fieldName,
            filename,
            contentType: "application/octet-stream",
            data: "binary-data",
          },
        ],
  );
  return createMockEvent({
    method: "POST",
    headers: { "content-type": contentType },
    rawBody: body,
  });
}

const BAD_REQUEST = 400;
const BAD_GATEWAY = 502;
const INTERNAL_SERVER_ERROR = 500;

// Errors are not thrown: they are returned as an ErrorResponse body, with the HTTP status set on the event
async function runHandler(
  event: ReturnType<typeof createMockEvent>,
): Promise<{ body: Awaited<ReturnType<typeof handler>>; status: number }> {
  const body = await handler(event);
  return { body, status: getResponseStatus(event) };
}

describe("the POST /api/controller/data/load endpoint", () => {
  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
    vi.mocked(getAllowedFileExtensions).mockResolvedValue(["msh", "vtk"]);
    vi.mocked(uploadFile).mockResolvedValue(undefined);
    vi.mocked(getAllowedGeodeObjectTypes).mockResolvedValue("BRep");
    vi.mocked(saveViewableFile).mockResolvedValue({ id: "item-1" });
  });

  test("uploads an allowed file and saves it as its resolved geode object type", async () => {
    const result = await handler(eventWithFile("model.msh"));

    expect(uploadFile).toHaveBeenCalledWith(expect.objectContaining({ filename: "model.msh" }));
    expect(saveViewableFile).toHaveBeenCalledWith("model.msh", "BRep");
    expect(result).toStrictEqual({ statusCode: 200, response: { id: "item-1" } });
  });

  test("relays a .vease file to the browser as a project import", async () => {
    vi.mocked(stageDownload).mockReturnValue("import-token");
    vi.mocked(dispatchCommand).mockResolvedValue({});

    await expect(handler(eventWithFile("scene.vease"))).resolves.toStrictEqual({
      statusCode: 200,
      response: { project: "scene.vease" },
    });
    expect(stageDownload).toHaveBeenCalledWith(Buffer.from("binary-data"), "scene.vease");
    expect(dispatchCommand).toHaveBeenCalledWith(
      "import-project",
      { downloadUrl: "/api/controller/files/download?token=import-token", filename: "scene.vease" },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
    expect(getAllowedFileExtensions).not.toHaveBeenCalled();
    expect(uploadFile).not.toHaveBeenCalled();
  });

  test("discards the staged project when the import fails", async () => {
    const actual = await vi.importActual<{ stageDownload: typeof stageDownload }>(
      "@vease_server/utils/file_transfer",
    );
    const token = actual.stageDownload(Buffer.from("binary-data"), "scene.vease");
    vi.mocked(stageDownload).mockReturnValue(token);
    vi.mocked(dispatchCommand).mockRejectedValue(new Error("Vease did not answer in time"));

    await expect(runHandler(eventWithFile("scene.vease"))).resolves.toMatchObject({
      body: { code: INTERNAL_SERVER_ERROR, description: "Vease did not answer in time" },
      status: INTERNAL_SERVER_ERROR,
    });
    expect(takeDownload(token)).toBeUndefined();
  });

  test("returns a 400 error response when no file field is present", async () => {
    await expect(runHandler(eventWithFile(undefined))).resolves.toMatchObject({
      body: { code: BAD_REQUEST, name: "No file field found" },
      status: BAD_REQUEST,
    });
    expect(uploadFile).not.toHaveBeenCalled();
  });

  test("returns a 400 error response when the file field has no filename", async () => {
    await expect(runHandler(eventWithFile(""))).resolves.toMatchObject({
      body: { code: BAD_REQUEST, name: "No filename found" },
      status: BAD_REQUEST,
    });
  });

  test("returns a 400 error response for a disallowed file extension before uploading", async () => {
    vi.mocked(getAllowedFileExtensions).mockResolvedValue(["vtk"]);

    await expect(runHandler(eventWithFile("model.msh"))).resolves.toMatchObject({
      body: { code: BAD_REQUEST, name: "File type not allowed" },
      status: BAD_REQUEST,
    });
    expect(uploadFile).not.toHaveBeenCalled();
  });

  test("returns a 400 error response when no allowed geode object type is found after upload", async () => {
    vi.mocked(getAllowedGeodeObjectTypes).mockResolvedValue(undefined);

    await expect(runHandler(eventWithFile("model.msh"))).resolves.toMatchObject({
      body: { code: BAD_REQUEST, name: "No allowed geode object type found for file" },
      status: BAD_REQUEST,
    });
    expect(saveViewableFile).not.toHaveBeenCalled();
  });

  test("forwards the status of a downstream h3 error as an error response", async () => {
    vi.mocked(uploadFile).mockRejectedValueOnce(
      createError({ statusCode: BAD_GATEWAY, statusMessage: "Back down" }),
    );

    await expect(runHandler(eventWithFile("model.msh"))).resolves.toMatchObject({
      body: { code: BAD_GATEWAY, name: "Back down" },
      status: BAD_GATEWAY,
    });
  });

  test("turns an unexpected downstream exception into a 500 error response", async () => {
    vi.mocked(saveViewableFile).mockRejectedValueOnce(new Error("disk full"));

    const event = eventWithFile("model.msh");
    await expect(handler(event)).resolves.toStrictEqual({
      code: INTERNAL_SERVER_ERROR,
      name: "Internal Server Error",
      description: "disk full",
    });
    expect(getResponseStatus(event)).toBe(INTERNAL_SERVER_ERROR);
  });
});
