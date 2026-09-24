import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  getAllowedFileExtensions,
  getAllowedGeodeObjectTypes,
  saveViewableFile,
  uploadFile,
} from "@vease_server/utils/data_file";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { fetchRaw } from "@ogw_shared/utils/fetch_raw";
import { fetchSchema } from "@ogw_shared/utils/fetch_schema";
import { getBackBaseUrl } from "@ogw_server/utils/server_config";
import { resolveAllowedObjects } from "@ogw_shared/utils/response_handlers/load";

vi.mock(import("@ogw_shared/utils/fetch_schema"), () => ({
  fetchSchema: vi.fn<typeof fetchSchema>(),
}));
vi.mock(import("@ogw_shared/utils/fetch_raw"), () => ({ fetchRaw: vi.fn<typeof fetchRaw>() }));
vi.mock(import("@ogw_shared/utils/response_handlers/load"), () => ({
  resolveAllowedObjects: vi.fn<typeof resolveAllowedObjects>(),
}));
vi.mock(import("@ogw_server/utils/server_config"), () => ({
  getBackBaseUrl: vi.fn<typeof getBackBaseUrl>(),
}));

describe("server/utils/data_file", () => {
  beforeEach(() => {
    vi.mocked(getBackBaseUrl).mockReturnValue("http://back.local");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe("getAllowedFileExtensions()", () => {
    test("returns the extensions list from the back microservice", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({
        extensions: ["msh", "vtk"],
      });

      const result = await getAllowedFileExtensions();

      expect(fetchSchema).toHaveBeenCalledWith({
        schema: back_schemas.opengeodeweb_back.allowed_files,
        baseURL: "http://back.local",
        headers: undefined,
        timeout: undefined,
      });
      expect(result).toStrictEqual(["msh", "vtk"]);
    });

    test("throws when the response has an unexpected shape", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({ wrong: "shape" });

      await expect(getAllowedFileExtensions()).rejects.toThrow("unexpected response shape");
    });
  });

  describe("getAllowedGeodeObjectTypes()", () => {
    test("resolves the selected geode object type for a filename", async () => {
      const allowedObjects = { BRep: [".msh"] };
      vi.mocked(fetchSchema).mockResolvedValue({
        allowed_objects: allowedObjects,
      });
      vi.mocked(resolveAllowedObjects).mockReturnValue({
        mergedAllowedObjects: allowedObjects,
        multipleFilesNoCommon: false,
        selectedGeodeObject: "BRep",
      });

      const result = await getAllowedGeodeObjectTypes("model.msh");

      expect(fetchSchema).toHaveBeenCalledWith({
        schema: back_schemas.opengeodeweb_back.allowed_objects,
        params: { filename: "model.msh" },
        baseURL: "http://back.local",
        headers: undefined,
        timeout: undefined,
      });
      expect(resolveAllowedObjects).toHaveBeenCalledWith(["model.msh"], [allowedObjects]);
      expect(result).toBe("BRep");
    });

    test("returns undefined when no geode object type is selected", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({ allowed_objects: {} });
      vi.mocked(resolveAllowedObjects).mockReturnValue({
        mergedAllowedObjects: {},
        multipleFilesNoCommon: false,
        selectedGeodeObject: "",
      });

      const result = await getAllowedGeodeObjectTypes("model.unknown");

      expect(result).toBeUndefined();
    });

    test("throws when the response has an unexpected shape", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({ wrong: "shape" });

      await expect(getAllowedGeodeObjectTypes("model.msh")).rejects.toThrow(
        "unexpected response shape",
      );
    });
  });

  describe("uploadFile()", () => {
    test("sends the file as form data to the back microservice", async () => {
      vi.mocked(fetchRaw).mockResolvedValue({ success: true });

      const result = await uploadFile({
        name: "file",
        filename: "model.msh",
        type: "application/octet-stream",
        data: Buffer.from("binary"),
      });

      expect(fetchRaw).toHaveBeenCalledWith(
        expect.objectContaining({
          route: back_schemas.opengeodeweb_back.upload_file.$id,
          baseURL: "http://back.local",
          params: expect.any(FormData),
        }),
      );
      expect(result).toStrictEqual({ success: true });
    });
  });

  describe("saveViewableFile()", () => {
    test("requests the back microservice to save the viewable file", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({ id: "item-1" });

      const result = await saveViewableFile("model.msh", "BRep");

      expect(fetchSchema).toHaveBeenCalledWith({
        schema: back_schemas.opengeodeweb_back.save_viewable_file,
        params: { filename: "model.msh", geode_object_type: "BRep" },
        baseURL: "http://back.local",
        expectEvent: true,
        headers: undefined,
        timeout: undefined,
      });
      expect(result).toStrictEqual({ id: "item-1" });
    });
  });
});
