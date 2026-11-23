import { beforeEach, describe, expect, test, vi } from "vitest";
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

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_shared/utils/fetch_schema"), () => ({
  fetchSchema: vi.fn<typeof fetchSchema>(),
}));
vi.mock(import("@ogw_shared/utils/fetch_raw"), () => ({ fetchRaw: vi.fn<typeof fetchRaw>() }));
vi.mock(import("@ogw_server/utils/server_config"), () => ({
  getBackBaseUrl: vi.fn<typeof getBackBaseUrl>(),
}));

describe("server/utils/data_file", () => {
  beforeEach(() => {
    vi.mocked(getBackBaseUrl).mockReturnValue("http://back.local");
  });

  describe("getAllowedFileExtensions()", () => {
    test("returns the extensions list from the back microservice", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({
        data_extensions: ["msh", "vtk"],
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
    test("returns the geode object types the back selected to load the whole file", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({
        allowed_objects: {
          TriangulatedSurface3D: {
            is_loadable: 1,
            object_priority: 1,
            loadable_family: "SurfaceMesh",
          },
          TetrahedralSolid3D: { is_loadable: 1, object_priority: 1, loadable_family: "SolidMesh" },
        },
        objects_to_load: ["TriangulatedSurface3D", "TetrahedralSolid3D"],
      });

      const result = await getAllowedGeodeObjectTypes("model.msh");

      expect(fetchSchema).toHaveBeenCalledWith({
        schema: back_schemas.opengeodeweb_back.allowed_objects,
        params: { filename: "model.msh" },
        baseURL: "http://back.local",
        headers: undefined,
        timeout: undefined,
      });
      expect(result).toStrictEqual(["TriangulatedSurface3D", "TetrahedralSolid3D"]);
    });

    test("returns no type when the back could not select any", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({ allowed_objects: {}, objects_to_load: [] });

      const result = await getAllowedGeodeObjectTypes("model.unknown");

      expect(result).toStrictEqual([]);
    });

    test("throws when the response has an unexpected shape", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({ wrong: "shape" });

      await expect(getAllowedGeodeObjectTypes("model.msh")).rejects.toThrow(
        "unexpected response shape",
      );
    });

    test("throws when the back does not give the types to load", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({ allowed_objects: {} });

      await expect(getAllowedGeodeObjectTypes("model.msh")).rejects.toThrow(
        "unexpected response shape",
      );
    });
  });

  describe("uploadFile()", () => {
    test("sends the file as a raw blob to the back microservice", async () => {
      vi.mocked(fetchRaw).mockResolvedValue({ success: true });

      const result = await uploadFile({
        name: "file",
        filename: "model.msh",
        type: "application/octet-stream",
        data: Buffer.from("binary"),
      });

      expect(fetchRaw).toHaveBeenCalledWith(
        expect.objectContaining({
          route:
            `${back_schemas.opengeodeweb_back.upload_file.$id}?filename=model.msh` +
            `&chunk_index=0&total_chunks=1`,
          method: "PUT",
          baseURL: "http://back.local",
          // oxlint-disable-next-line no-unsafe-type-assertion -- expect.any() is typed as any by vitest
          params: expect.any(Blob) as Blob,
        }),
      );
      expect(result).toStrictEqual({ success: true });
    });
  });

  describe("saveViewableFile()", () => {
    test("requests the back microservice to save the viewable file", async () => {
      vi.mocked(fetchSchema).mockResolvedValue({ data: [{ id: "item-1" }] });

      const result = await saveViewableFile("model.msh", "BRep");

      expect(fetchSchema).toHaveBeenCalledWith({
        schema: back_schemas.opengeodeweb_back.save_viewable_file,
        params: { filename: "model.msh", geode_object_type: "BRep" },
        baseURL: "http://back.local",
        expectEvent: true,
        headers: undefined,
        timeout: undefined,
      });
      expect(result).toStrictEqual({ data: [{ id: "item-1" }] });
    });
  });
});
