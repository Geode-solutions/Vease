import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getBackStore,
  getDataStyleStore,
  getHybridViewerStore,
} from "@vease/utils/external_stores";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { controllerHandlers } from "@vease/utils/controller/index";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getDataStyleStore: vi.fn<typeof getDataStyleStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
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

const ONCE = 1;
const DEPTH_MAX = 10;
const VELOCITY_ITEMS = 3;
const VELOCITY_Y_MIN = -2;
const VELOCITY_Y_MAX = 5;
const CUSTOM_MIN = -1;
const CUSTOM_MAX = 4;
const TIME_STEP = 0.5;
const TIME_STEP_INDEX = 1;
const LAST_TIME_STEP_INDEX = 2;
const MISSING_TIME_STEP = 2;
const DEPTH = { attribute_name: "depth", nb_items: 1, min_value: 0, max_value: DEPTH_MAX };
const VELOCITY = {
  attribute_name: "velocity",
  nb_items: VELOCITY_ITEMS,
  min_values: [0, VELOCITY_Y_MIN, 0],
  max_values: [1, VELOCITY_Y_MAX, 1],
};
const PRESSURE = {
  attribute_name: "pressure",
  nb_items: 1,
  min_value: 0,
  max_value: 1,
  time_steps: [0, TIME_STEP, 1],
};

const request = vi.fn<(args: RequestArgs) => Promise<unknown>>();
const styleStore = {
  getStyle: vi.fn<(id: string) => Record<string, unknown>>(),
  meshPolygonsPolygonAttributeColorMap: vi.fn<(id: string) => string | undefined>(),
  setMeshPolygonsPolygonAttribute: vi.fn<() => Promise<void>>(),
  meshPolygonsPolygonAttributeTimeStep: vi.fn<(id: string) => number | undefined>(),
  setMeshPolygonsPolygonAttributeTimeStep: vi.fn<() => Promise<void>>(),
  meshPolygonsVertexAttributeColorMap: vi.fn<(id: string) => string | undefined>(),
  setMeshPolygonsVertexAttribute: vi.fn<() => Promise<void>>(),
  meshPolygonsVertexAttributeTimeStep: vi.fn<(id: string) => number | undefined>(),
  setMeshPolygonsVertexAttributeTimeStep: vi.fn<() => Promise<void>>(),
  setMeshPolygonsActiveColoring: vi.fn<() => Promise<void>>(),
  modelBlocksPolyhedronAttributeColorMap: vi.fn<(id: string) => string | undefined>(),
  setModelBlocksPolyhedronAttribute: vi.fn<() => Promise<void>>(),
  modelBlocksPolyhedronAttributeTimeStep: vi.fn<(id: string) => number | undefined>(),
  setModelBlocksPolyhedronAttributeTimeStep: vi.fn<() => Promise<void>>(),
  setModelBlocksActiveColoring: vi.fn<() => Promise<void>>(),
};
const dataStore = {
  item: vi.fn<(id: string) => Promise<DataItem>>(),
  getMeshComponentGeodeIds: vi.fn<(id: string, type: string) => Promise<string[]>>(),
};
const hybridViewerStore = { remoteRender: vi.fn<() => Promise<void>>() };

function answerAttributes(attributesBySchemaId: Record<string, unknown[]>): void {
  request.mockImplementation(async ({ schema }) => {
    await Promise.resolve();
    return { attributes: attributesBySchemaId[schema.$id] ?? [] };
  });
}

function answerComponents(geodeIdsByType: Record<string, string[]>): void {
  dataStore.getMeshComponentGeodeIds.mockImplementation(async (_id, type) => {
    await Promise.resolve();
    return geodeIdsByType[type] ?? [];
  });
}

async function colorByAttribute(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["color-by-attribute"]?.(params);
  return result;
}

describe("the color-by-attribute controller handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
    vi.mocked(getDataStyleStore).mockReturnValue(
      styleStore as unknown as ReturnType<typeof getDataStyleStore>,
    );
    vi.mocked(getHybridViewerStore).mockReturnValue(
      hybridViewerStore as unknown as ReturnType<typeof getHybridViewerStore>,
    );
    vi.mocked(getBackStore).mockReturnValue({
      request,
    } as unknown as ReturnType<typeof getBackStore>);
    vi.mocked(useDataStore).mockReturnValue(
      dataStore as unknown as ReturnType<typeof useDataStore>,
    );
    /* oxlint-enable no-unsafe-type-assertion */
    dataStore.item.mockResolvedValue(MESH);
    styleStore.meshPolygonsPolygonAttributeColorMap.mockReturnValue(undefined);
    styleStore.meshPolygonsPolygonAttributeTimeStep.mockReturnValue(undefined);
    styleStore.getStyle.mockReturnValue({ visibility: true, points: {}, polygons: {} });
    answerAttributes({
      [backSchemas.polygon_attribute_names.$id]: [DEPTH, VELOCITY, PRESSURE],
    });
  });

  test("colors a mesh by attribute with default range and colormap", async () => {
    await expect(colorByAttribute({ id: MESH.id, attribute: "depth" })).resolves.toStrictEqual({
      id: MESH.id,
      target: "polygons",
      location: "polygon",
      attribute: "depth",
      item: 0,
      colormap: "batlow",
      minimum: 0,
      maximum: DEPTH_MAX,
    });
    expect(styleStore.setMeshPolygonsPolygonAttribute).toHaveBeenCalledWith(MESH.id, {
      name: "depth",
      item: 0,
      minimum: 0,
      maximum: DEPTH_MAX,
      colorMap: "batlow",
    });
    expect(styleStore.setMeshPolygonsActiveColoring).toHaveBeenCalledWith(MESH.id, "polygon");
  });

  test("sets the attribute, then the active coloring, then renders", async () => {
    await colorByAttribute({ id: MESH.id, attribute: "depth" });

    expect(styleStore.setMeshPolygonsActiveColoring).toHaveBeenCalledAfter(
      styleStore.setMeshPolygonsPolygonAttribute,
    );
    expect(hybridViewerStore.remoteRender).toHaveBeenCalledAfter(
      styleStore.setMeshPolygonsActiveColoring,
    );
    expect(styleStore.setMeshPolygonsPolygonAttributeTimeStep).not.toHaveBeenCalled();
  });

  test("keeps the current colormap of the attribute by default", async () => {
    styleStore.meshPolygonsPolygonAttributeColorMap.mockReturnValue("batlowK");

    await colorByAttribute({ id: MESH.id, attribute: "depth" });

    expect(styleStore.setMeshPolygonsPolygonAttribute).toHaveBeenCalledWith(
      MESH.id,
      expect.objectContaining({ colorMap: "batlowK" }),
    );
  });

  test("uses the given range, item and colormap", async () => {
    await colorByAttribute({
      id: MESH.id,
      attribute: "velocity",
      item: 1,
      minimum: CUSTOM_MIN,
      maximum: CUSTOM_MAX,
      colormap: "batlowK",
      noDataColor: "#ff8800",
    });

    expect(styleStore.setMeshPolygonsPolygonAttribute).toHaveBeenCalledWith(MESH.id, {
      name: "velocity",
      item: 1,
      minimum: CUSTOM_MIN,
      maximum: CUSTOM_MAX,
      colorMap: "batlowK",
      no_data_color: { red: 255, green: 136, blue: 0, alpha: 1 },
    });
  });

  test("defaults the range to the range of the item", async () => {
    await colorByAttribute({ id: MESH.id, attribute: "velocity", item: 1 });

    expect(styleStore.setMeshPolygonsPolygonAttribute).toHaveBeenCalledWith(
      MESH.id,
      expect.objectContaining({ minimum: VELOCITY_Y_MIN, maximum: VELOCITY_Y_MAX }),
    );
  });

  test("rejects an item out of range", async () => {
    await expect(
      colorByAttribute({ id: MESH.id, attribute: "velocity", item: VELOCITY_ITEMS }),
    ).rejects.toThrow("nb_items 3");
    expect(styleStore.setMeshPolygonsPolygonAttribute).not.toHaveBeenCalled();
  });

  test("rejects an unknown colormap", async () => {
    await expect(
      colorByAttribute({ id: MESH.id, attribute: "depth", colormap: "rainbowish" }),
    ).rejects.toThrow('Unknown colormap "rainbowish"; read vease://colormaps');
  });

  test("rejects a minimum greater than the maximum", async () => {
    await expect(
      colorByAttribute({
        id: MESH.id,
        attribute: "depth",
        minimum: CUSTOM_MAX,
        maximum: CUSTOM_MIN,
      }),
    ).rejects.toThrow("minimum (4) is greater than maximum (-1)");
  });

  test("keeps the stored step of a time series without timeStep", async () => {
    styleStore.meshPolygonsPolygonAttributeTimeStep.mockReturnValue(LAST_TIME_STEP_INDEX);

    await expect(colorByAttribute({ id: MESH.id, attribute: "pressure" })).resolves.toMatchObject({
      timeStep: 1,
    });
    expect(styleStore.setMeshPolygonsPolygonAttributeTimeStep).toHaveBeenCalledWith(
      MESH.id,
      LAST_TIME_STEP_INDEX,
    );
  });

  test("shows the first step of a time series without a valid stored step", async () => {
    styleStore.meshPolygonsPolygonAttributeTimeStep.mockReturnValue(VELOCITY_ITEMS);

    await expect(colorByAttribute({ id: MESH.id, attribute: "pressure" })).resolves.toMatchObject({
      timeStep: 0,
    });
    expect(styleStore.setMeshPolygonsPolygonAttributeTimeStep).toHaveBeenCalledWith(MESH.id, 0);
  });

  test("colors mesh polygons by a vertex attribute through the vertex setters", async () => {
    styleStore.meshPolygonsVertexAttributeColorMap.mockReturnValue(undefined);
    answerAttributes({ [backSchemas.vertex_attribute_names.$id]: [PRESSURE] });

    await colorByAttribute({ id: MESH.id, attribute: "pressure", timeStep: TIME_STEP });

    expect(styleStore.setMeshPolygonsVertexAttribute).toHaveBeenCalledWith(MESH.id, {
      name: "pressure",
      item: 0,
      minimum: 0,
      maximum: 1,
      colorMap: "batlow",
    });
    expect(styleStore.setMeshPolygonsVertexAttributeTimeStep).toHaveBeenCalledWith(
      MESH.id,
      TIME_STEP_INDEX,
    );
    expect(styleStore.setMeshPolygonsActiveColoring).toHaveBeenCalledWith(MESH.id, "vertex");
  });

  test("rejects a minimum without a maximum", async () => {
    await expect(
      colorByAttribute({ id: MESH.id, attribute: "depth", minimum: CUSTOM_MIN }),
    ).rejects.toThrow("Give both minimum and maximum");
  });

  test("applies a time step that exists", async () => {
    await expect(
      colorByAttribute({ id: MESH.id, attribute: "pressure", timeStep: TIME_STEP }),
    ).resolves.toMatchObject({ timeStep: TIME_STEP });

    expect(styleStore.setMeshPolygonsPolygonAttributeTimeStep).toHaveBeenCalledWith(
      MESH.id,
      TIME_STEP_INDEX,
    );
    expect(styleStore.setMeshPolygonsPolygonAttributeTimeStep).toHaveBeenCalledAfter(
      styleStore.setMeshPolygonsPolygonAttribute,
    );
    expect(styleStore.setMeshPolygonsActiveColoring).toHaveBeenCalledAfter(
      styleStore.setMeshPolygonsPolygonAttributeTimeStep,
    );
  });

  test("rejects a missing time step", async () => {
    await expect(
      colorByAttribute({ id: MESH.id, attribute: "pressure", timeStep: MISSING_TIME_STEP }),
    ).rejects.toThrow("available: 0, 0.5, 1");
  });

  test("colors model blocks on all blocks by default", async () => {
    dataStore.item.mockResolvedValue(MODEL);
    answerComponents({ Block: ["b1", "b2"] });
    answerAttributes({ [backSchemas.model_component_polyhedron_attribute_names.$id]: [DEPTH] });

    await expect(colorByAttribute({ id: MODEL.id, attribute: "depth" })).resolves.toMatchObject({
      target: "blocks",
      location: "polyhedron",
    });
    expect(styleStore.setModelBlocksPolyhedronAttribute).toHaveBeenCalledWith(
      MODEL.id,
      ["b1", "b2"],
      { name: "depth", item: 0, minimum: 0, maximum: DEPTH_MAX, colorMap: "batlow" },
    );
    expect(styleStore.setModelBlocksActiveColoring).toHaveBeenCalledWith(
      MODEL.id,
      ["b1", "b2"],
      "polyhedron",
    );
    expect(hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test("applies a time step on the given model components", async () => {
    dataStore.item.mockResolvedValue(MODEL);
    answerComponents({ Block: ["b1", "b2"] });
    styleStore.modelBlocksPolyhedronAttributeColorMap.mockReturnValue(undefined);
    answerAttributes({
      [backSchemas.model_component_polyhedron_attribute_names.$id]: [PRESSURE],
    });

    await colorByAttribute({
      id: MODEL.id,
      target: "blocks",
      componentIds: ["b2"],
      attribute: "pressure",
      timeStep: TIME_STEP,
    });

    expect(styleStore.setModelBlocksPolyhedronAttribute).toHaveBeenCalledWith(
      MODEL.id,
      ["b2"],
      expect.objectContaining({ name: "pressure" }),
    );
    expect(styleStore.setModelBlocksPolyhedronAttributeTimeStep).toHaveBeenCalledWith(
      MODEL.id,
      ["b2"],
      TIME_STEP_INDEX,
    );
    expect(styleStore.setModelBlocksActiveColoring).toHaveBeenCalledWith(
      MODEL.id,
      ["b2"],
      "polyhedron",
    );
  });
});
