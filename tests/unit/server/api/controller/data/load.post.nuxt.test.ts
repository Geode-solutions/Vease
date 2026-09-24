import { beforeEach, describe, expect, test, vi } from "vitest";
import { buildMultipartBody, createMockEvent } from "@vease_tests/server_utils";
import {
  getAllowedFileExtensions,
  getAllowedGeodeObjectTypes,
  saveViewableFile,
  uploadFile,
} from "@vease_server/utils/data_file";
import handler from "@vease_server/api/controller/data/load.post";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/data_file"), () => ({
  getAllowedFileExtensions: vi.fn<typeof getAllowedFileExtensions>(),
  getAllowedGeodeObjectTypes: vi.fn<typeof getAllowedGeodeObjectTypes>(),
  uploadFile: vi.fn<typeof uploadFile>(),
  saveViewableFile: vi.fn<typeof saveViewableFile>(),
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

describe("the POST /api/controller/data/load endpoint", () => {
  beforeEach(() => {
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

  test("rejects when no file field is present", async () => {
    await expect(handler(eventWithFile(undefined))).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: "No file field found",
    });
    expect(uploadFile).not.toHaveBeenCalled();
  });

  test("rejects when the file field has no filename", async () => {
    await expect(handler(eventWithFile(""))).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: "No filename found",
    });
  });

  test("rejects a disallowed file extension before uploading", async () => {
    vi.mocked(getAllowedFileExtensions).mockResolvedValue(["vtk"]);

    await expect(handler(eventWithFile("model.msh"))).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: "File type not allowed",
    });
    expect(uploadFile).not.toHaveBeenCalled();
  });

  test("rejects when no allowed geode object type is found after upload", async () => {
    vi.mocked(getAllowedGeodeObjectTypes).mockResolvedValue(undefined);

    await expect(handler(eventWithFile("model.msh"))).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: "No allowed geode object type found for file",
    });
    expect(saveViewableFile).not.toHaveBeenCalled();
  });

  test("wraps a downstream failure, preserving its status code when present", async () => {
    vi.mocked(uploadFile).mockRejectedValueOnce({
      statusCode: 502,
      statusMessage: "Back down",
    });

    await expect(handler(eventWithFile("model.msh"))).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: "Back down",
    });
  });
});
