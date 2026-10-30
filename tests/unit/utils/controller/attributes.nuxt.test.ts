import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getDataStyleStore } from "@vease/utils/external_stores";
import { ControllerError } from "@vease/utils/controller/errors";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { findAttribute } from "@vease/utils/controller/attributes";

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

const MESH: DataItem = {
  id: "mesh-1",
  geode_id: "geode-1",
  name: "surface",
  viewer_type: "mesh",
  geode_object_type: "PolygonalSurface3D",
  visible: true,
  created_at: "2026-10-08",
};

const MODEL: DataItem = {
  ...MESH,
  id: "model-1",
  geode_id: "geode-2",
  name: "brep",
  viewer_type: "model",
  geode_object_type: "BRep",
};

const DEPTH = { attribute_name: "depth", nb_items: 1, min_value: 0, max_value: 10 };
const HEIGHT = { attribute_name: "height", nb_items: 1, min_value: 0, max_value: 1 };

const request = vi.fn<(args: RequestArgs) => Promise<unknown>>();
const getStyle = vi.fn<(id: string) => Record<string, unknown>>();
const item = vi.fn<(id: string) => Promise<DataItem>>();
const getMeshComponentGeodeIds = vi.fn<(id: string, type: string) => Promise<string[]>>();

function answerAttributes(attributesBySchemaId: Record<string, unknown[]>): void {
  request.mockImplementation(async ({ schema }) => {
    await Promise.resolve();
    return { attributes: attributesBySchemaId[schema.$id] ?? [] };
  });
}

function answerComponents(geodeIdsByType: Record<string, string[]>): void {
  getMeshComponentGeodeIds.mockImplementation(async (_id, type) => {
    await Promise.resolve();
    return geodeIdsByType[type] ?? [];
  });
}

describe("the controller attribute lookup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
    vi.mocked(useDataStore).mockReturnValue({
      item,
      getMeshComponentGeodeIds,
    } as unknown as ReturnType<typeof useDataStore>);
    vi.mocked(getDataStyleStore).mockReturnValue({
      getStyle,
    } as unknown as ReturnType<typeof getDataStyleStore>);
    vi.mocked(getBackStore).mockReturnValue({
      request,
    } as unknown as ReturnType<typeof getBackStore>);
    /* oxlint-enable no-unsafe-type-assertion */
    item.mockResolvedValue(MESH);
    getStyle.mockReturnValue({ visibility: true, points: {}, edges: {}, polygons: {} });
  });

  test("finds a polygon attribute on a surface mesh", async () => {
    answerAttributes({ [backSchemas.polygon_attribute_names.$id]: [DEPTH] });

    await expect(findAttribute({ id: MESH.id, name: "depth" })).resolves.toStrictEqual({
      target: "polygons",
      kind: "polygon",
      attribute: DEPTH,
    });
  });

  test("prefers the requested target", async () => {
    answerAttributes({
      [backSchemas.vertex_attribute_names.$id]: [DEPTH],
      [backSchemas.polygon_attribute_names.$id]: [DEPTH],
    });

    await expect(
      findAttribute({ id: MESH.id, name: "depth", target: "points" }),
    ).resolves.toStrictEqual({ target: "points", kind: "vertex", attribute: DEPTH });
  });

  test("prefers the highest-dimension target when none is given", async () => {
    answerAttributes({ [backSchemas.vertex_attribute_names.$id]: [DEPTH] });

    await expect(findAttribute({ id: MESH.id, name: "depth" })).resolves.toStrictEqual({
      target: "polygons",
      kind: "vertex",
      attribute: DEPTH,
    });
  });

  test("filters by location", async () => {
    answerAttributes({
      [backSchemas.vertex_attribute_names.$id]: [DEPTH],
      [backSchemas.polygon_attribute_names.$id]: [DEPTH],
    });

    await expect(
      findAttribute({ id: MESH.id, name: "depth", location: "vertex" }),
    ).resolves.toStrictEqual({ target: "polygons", kind: "vertex", attribute: DEPTH });
  });

  test("lists the available attributes when not found", async () => {
    getStyle.mockReturnValue({ visibility: true, points: {}, polygons: {} });
    answerAttributes({
      [backSchemas.vertex_attribute_names.$id]: [HEIGHT],
      [backSchemas.polygon_attribute_names.$id]: [DEPTH],
    });

    const found = findAttribute({ id: MESH.id, name: "pressure" });

    await expect(found).rejects.toBeInstanceOf(ControllerError);
    await expect(found).rejects.toThrow(
      'Attribute "pressure" not found on "surface". Available: polygons/polygon: depth; ' +
        "polygons/vertex: height",
    );
  });

  test("rejects a target the mesh does not have", async () => {
    await expect(findAttribute({ id: MESH.id, name: "depth", target: "blocks" })).rejects.toThrow(
      '"blocks" is not available on "surface"; available: points, edges, polygons',
    );
  });

  test("searches every component of the model target with components", async () => {
    item.mockResolvedValue(MODEL);
    answerComponents({ Surface: ["s1", "s2"] });
    answerAttributes({ [backSchemas.model_component_polygon_attribute_names.$id]: [DEPTH] });

    await expect(findAttribute({ id: MODEL.id, name: "depth" })).resolves.toStrictEqual({
      target: "surfaces",
      kind: "polygon",
      attribute: DEPTH,
      componentIds: ["s1", "s2"],
    });
    expect(request).toHaveBeenCalledWith({
      schema: backSchemas.model_component_polygon_attribute_names,
      params: { id: MODEL.id, component_ids: ["s1", "s2"] },
    });
  });

  test("uses the given model components", async () => {
    item.mockResolvedValue(MODEL);
    answerComponents({ Block: ["b1", "b2"] });
    answerAttributes({ [backSchemas.model_component_polyhedron_attribute_names.$id]: [DEPTH] });

    await expect(
      findAttribute({ id: MODEL.id, name: "depth", target: "blocks", componentIds: ["b2"] }),
    ).resolves.toStrictEqual({
      target: "blocks",
      kind: "polyhedron",
      attribute: DEPTH,
      componentIds: ["b2"],
    });
    expect(request).toHaveBeenCalledWith({
      schema: backSchemas.model_component_polyhedron_attribute_names,
      params: { id: MODEL.id, component_ids: ["b2"] },
    });
  });

  test("rejects component ids that are not of the target type", async () => {
    item.mockResolvedValue(MODEL);
    answerComponents({ Block: ["b1", "b2"] });

    await expect(
      findAttribute({ id: MODEL.id, name: "depth", target: "blocks", componentIds: ["b2", "s1"] }),
    ).rejects.toThrow('"brep" has no blocks with geode id s1');
    expect(request).not.toHaveBeenCalled();
  });

  test("rejects a model target without components", async () => {
    item.mockResolvedValue(MODEL);
    getMeshComponentGeodeIds.mockResolvedValue([]);

    await expect(findAttribute({ id: MODEL.id, name: "depth", target: "blocks" })).rejects.toThrow(
      '"brep" has no blocks',
    );
  });

  test("rejects componentIds without a model target", async () => {
    item.mockResolvedValue(MODEL);

    await expect(
      findAttribute({ id: MODEL.id, name: "depth", componentIds: ["s1"] }),
    ).rejects.toThrow("componentIds needs a target");
  });

  test("rejects componentIds on a mesh", async () => {
    await expect(
      findAttribute({ id: MESH.id, name: "depth", target: "polygons", componentIds: ["s1"] }),
    ).rejects.toThrow("componentIds only applies to model");
  });
});
