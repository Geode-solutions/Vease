// oxlint-disable max-lines
import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getDataStyleStore } from "@vease/utils/external_stores";
import { ControllerError } from "@vease/utils/controller/errors";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { consola } from "consola";
import { controllerHandlers } from "@vease/utils/controller/index";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getDataStyleStore: vi.fn<typeof getDataStyleStore>(),
}));

interface RequestArgs {
  schema: { $id: string };
  params?: Record<string, unknown>;
}

const backSchemas = back_schemas.opengeodeweb_back;
const DEPTH_MAX = 10;

const MESH: DataItem = {
  data_id: "mesh-1",
  geode_id: "geode-1",
  name: "surface",
  viewer_object_type: "mesh",
  geode_object_type: "PolygonalSurface3D",
  visible: true,
  created_at: "2026-10-08",
};

const MODEL: DataItem = {
  data_id: "model-1",
  geode_id: "geode-2",
  name: "brep",
  viewer_object_type: "model",
  geode_object_type: "BRep",
  visible: true,
  created_at: "2026-10-08",
};

const IMAGE_2D: DataItem = {
  data_id: "image-1",
  geode_id: "geode-3",
  name: "raster",
  viewer_object_type: "image",
  geode_object_type: "RasterImage2D",
  visible: true,
  created_at: "2026-10-08",
};

const IMAGE_3D: DataItem = {
  ...IMAGE_2D,
  data_id: "image-2",
  geode_id: "geode-4",
  name: "volume",
  geode_object_type: "RasterImage3D",
};

const IMAGE_CASES = [
  { image: IMAGE_2D, dimension: 2 },
  { image: IMAGE_3D, dimension: 3 },
];

const MODEL_COMPONENTS = [
  {
    id: "c1",
    geode_id: "c1",
    title: "Corner 1",
    category: "Corner",
    viewer_id: 1,
    is_active: true,
  },
  { id: "s1", geode_id: "s1", title: "Top", category: "Surface", viewer_id: 2, is_active: true },
  { id: "s2", geode_id: "s2", title: "Bottom", category: "Surface", viewer_id: 3, is_active: true },
];

const request = vi.fn<(args: RequestArgs) => Promise<unknown>>();
const getStyle = vi.fn<(id: string) => Record<string, unknown>>();
const item = vi.fn<(id: string) => Promise<DataItem>>();
const getAllMeshComponents = vi.fn<(id: string) => Promise<typeof MODEL_COMPONENTS>>();

function answerAttributes(attributesBySchemaId: Record<string, unknown[]>): void {
  request.mockImplementation(async ({ schema }) => {
    await Promise.resolve();
    return { attributes: attributesBySchemaId[schema.$id] ?? [] };
  });
}

function requestedSchemaIds(): string[] {
  return request.mock.calls.map(([{ schema }]) => schema.$id);
}

describe("the data-details controller handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking a partial store */
    vi.mocked(useDataStore).mockReturnValue({
      item,
      getAllMeshComponents,
    } as unknown as ReturnType<typeof useDataStore>);
    vi.mocked(getDataStyleStore).mockReturnValue({
      getStyle,
    } as unknown as ReturnType<typeof getDataStyleStore>);
    vi.mocked(getBackStore).mockReturnValue({
      request,
    } as unknown as ReturnType<typeof getBackStore>);
    /* oxlint-enable no-unsafe-type-assertion */
  });

  test("describes a mesh with its targets and attributes", async () => {
    const style = { id: MESH.data_id, visibility: true, points: { size: 2 }, polygons: {} };
    item.mockResolvedValue(MESH);
    getStyle.mockReturnValue(style);
    answerAttributes({
      [backSchemas.polygon_attribute_names.$id]: [
        { attribute_name: "depth", nb_items: 1, min_value: 0, max_value: DEPTH_MAX },
      ],
    });

    const details = await controllerHandlers["data-details"]?.({ id: MESH.data_id });

    expect(details).toMatchObject({
      id: MESH.data_id,
      name: "surface",
      geode_object_type: "PolygonalSurface3D",
      viewer_object_type: "mesh",
      targets: ["points", "polygons"],
      style,
    });
    expect(details).toHaveProperty("attributes", [
      {
        target: "polygons",
        location: "polygon",
        name: "depth",
        nb_items: 1,
        min: 0,
        max: DEPTH_MAX,
      },
    ]);
    expect(requestedSchemaIds().toSorted()).toStrictEqual(
      [backSchemas.vertex_attribute_names.$id, backSchemas.polygon_attribute_names.$id].toSorted(),
    );
  });

  test("skips the attribute kinds the mesh type does not have", async () => {
    item.mockResolvedValue(MESH);
    getStyle.mockReturnValue({ id: MESH.data_id, points: {}, edges: {}, polygons: {} });
    answerAttributes({});

    const details = await controllerHandlers["data-details"]?.({ id: MESH.data_id });

    expect(details).toHaveProperty("targets", ["points", "edges", "polygons"]);
    expect(requestedSchemaIds()).not.toContain(backSchemas.edge_attribute_names.$id);
  });

  test("omits the attribute kinds whose request fails", async () => {
    const warn = vi.spyOn(consola, "warn").mockReturnValue(undefined);
    item.mockResolvedValue(MESH);
    getStyle.mockReturnValue({ id: MESH.data_id, polygons: {} });
    // Polygons request their polygon attributes first, then their vertex ones
    request
      .mockRejectedValueOnce(
        Object.assign(new Error("[POST] polygon_attribute_names: 500"), {
          data: { code: 500, name: "Internal Server Error", description: "back unreachable" },
        }),
      )
      .mockResolvedValueOnce({
        attributes: [{ attribute_name: "height", nb_items: 1, min_value: 0, max_value: 1 }],
      });

    const details = await controllerHandlers["data-details"]?.({ id: MESH.data_id });

    expect(details).toHaveProperty("attributes", [
      { target: "polygons", location: "vertex", name: "height", nb_items: 1, min: 0, max: 1 },
    ]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("polygon attributes"),
      "back unreachable",
    );
  });

  test("lists model components grouped by type", async () => {
    item.mockResolvedValue(MODEL);
    getStyle.mockReturnValue({ id: MODEL.data_id });
    getAllMeshComponents.mockResolvedValue(MODEL_COMPONENTS);
    answerAttributes({
      [backSchemas.model_component_polygon_attribute_names.$id]: [
        {
          attribute_name: "thickness",
          nb_items: 1,
          min_value: 1,
          max_value: 2,
          time_steps: [0, 1],
        },
      ],
    });

    const details = await controllerHandlers["data-details"]?.({ id: MODEL.data_id });

    expect(details).toMatchObject({
      targets: ["points", "edges", "corners", "surfaces"],
      components: [
        { geode_id: "c1", name: "Corner 1", type: "Corner" },
        { geode_id: "s1", name: "Top", type: "Surface" },
        { geode_id: "s2", name: "Bottom", type: "Surface" },
      ],
      attributes: [
        {
          target: "surfaces",
          location: "polygon",
          name: "thickness",
          nb_items: 1,
          min: 1,
          max: 2,
          time_steps: [0, 1],
        },
      ],
    });
    expect(request).toHaveBeenCalledWith({
      schema: backSchemas.model_component_polygon_attribute_names,
      params: { id: MODEL.data_id, component_ids: ["s1", "s2"] },
    });
    expect(request).toHaveBeenCalledWith({
      schema: backSchemas.model_component_vertex_attribute_names,
      params: { id: MODEL.data_id, component_ids: ["c1"] },
    });
  });

  test.each(IMAGE_CASES)(
    "describes the image $image.name with its dimension and no attributes",
    async ({ image, dimension }) => {
      const style = { id: image.data_id, visibility: true, opacity: 1 };
      item.mockResolvedValue(image);
      getStyle.mockReturnValue(style);

      const details = await controllerHandlers["data-details"]?.({ id: image.data_id });

      expect(details).toStrictEqual({
        id: image.data_id,
        name: image.name,
        geode_object_type: image.geode_object_type,
        viewer_object_type: "image",
        dimension,
        targets: [],
        attributes: [],
        style,
      });
      expect(request).not.toHaveBeenCalled();
      expect(getAllMeshComponents).not.toHaveBeenCalled();
    },
  );

  test("never asks the back for the attributes of an image, whatever its style", async () => {
    item.mockResolvedValue(IMAGE_3D);
    getStyle.mockReturnValue({ id: IMAGE_3D.data_id, visibility: true, cells: {}, points: {} });

    const details = await controllerHandlers["data-details"]?.({ id: IMAGE_3D.data_id });

    expect(details).toMatchObject({ dimension: 3, targets: [], attributes: [] });
    expect(request).not.toHaveBeenCalled();
  });

  test("describes a model without reading mesh attributes", async () => {
    item.mockResolvedValue(MODEL);
    getStyle.mockReturnValue({ id: MODEL.data_id, points: {}, edges: {} });
    getAllMeshComponents.mockResolvedValue([]);
    answerAttributes({});

    await controllerHandlers["data-details"]?.({ id: MODEL.data_id });

    expect(requestedSchemaIds()).toStrictEqual([]);
  });

  test("throws a ControllerError for an unknown id", async () => {
    item.mockRejectedValue(new Error("Item not found: missing"));

    const details = controllerHandlers["data-details"]?.({ id: "missing" });

    await expect(details).rejects.toBeInstanceOf(ControllerError);
    await expect(details).rejects.toThrow("vease://data");
  });

  test("rethrows data store failures other than a missing item", async () => {
    const failure = new Error("database closed");
    item.mockRejectedValue(failure);

    await expect(controllerHandlers["data-details"]?.({ id: MESH.data_id })).rejects.toBe(failure);
  });
});
