// oxlint-disable max-lines
import {
  DEPTH,
  DEPTH_MAX,
  MESH,
  MODEL,
  ONCE,
  ORANGE,
  ORANGE_HEX,
  OTHER_MESH,
  PRESSURE,
  TIME_STEP,
  TIME_STEP_INDEX,
  answerAttributes,
  colorOne,
  createStores,
  runCommand,
  setupStores,
  styleSetter,
} from "@vease_tests/unit/utils/controller/handlers/style/fixtures";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type {
  getBackStore,
  getDataStyleStore,
  getHybridViewerStore,
} from "@vease/utils/external_stores";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import type { useDataStore } from "@ogw_front/stores/data";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getDataStyleStore: vi.fn<typeof getDataStyleStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

const backSchemas = back_schemas.opengeodeweb_back;

const POLYGON_COMMAND = "style/mesh/polygons/polygon/attribute";
const VERTEX_COMMAND = "style/mesh/polygons/vertex/attribute";
const VELOCITY_ITEMS = 3;
const VELOCITY_Y_MIN = -2;
const VELOCITY_Y_MAX = 5;
const CUSTOM_MIN = -1;
const CUSTOM_MAX = 4;
const LAST_TIME_STEP_INDEX = 2;
const MISSING_TIME_STEP = 2;
const VELOCITY = {
  attribute_name: "velocity",
  nb_items: VELOCITY_ITEMS,
  min_values: [0, VELOCITY_Y_MIN, 0],
  max_values: [1, VELOCITY_Y_MAX, 1],
};

describe("the style/mesh attribute controller commands", () => {
  const stores = createStores();

  function setter(name: string): ReturnType<typeof styleSetter> {
    return styleSetter(stores, name);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    setupStores(stores);
    answerAttributes(stores, {
      [backSchemas.polygon_attribute_names.$id]: [DEPTH, VELOCITY, PRESSURE],
    });
  });

  test("colors a mesh by attribute with default range and colormap", async () => {
    await expect(
      colorOne(POLYGON_COMMAND, { id: MESH.data_id, name: "depth" }),
    ).resolves.toStrictEqual({
      id: MESH.data_id,
      target: "polygons",
      location: "polygon",
      attribute: "depth",
      item: 0,
      colormap: "batlow",
      minimum: 0,
      maximum: DEPTH_MAX,
    });
    expect(setter("setMeshPolygonsPolygonAttribute")).toHaveBeenCalledWith(MESH.data_id, {
      name: "depth",
      item: 0,
      minimum: 0,
      maximum: DEPTH_MAX,
      colorMap: "batlow",
    });
    expect(setter("setMeshPolygonsActiveColoring")).toHaveBeenCalledWith(MESH.data_id, "polygon");
  });

  test("colors several meshes by the same attribute in one call and renders once", async () => {
    await expect(
      runCommand(POLYGON_COMMAND, { ids: [MESH.data_id, OTHER_MESH.data_id], name: "depth" }),
    ).resolves.toMatchObject({ ids: [MESH.data_id, OTHER_MESH.data_id] });

    expect(setter("setMeshPolygonsPolygonAttribute")).toHaveBeenCalledWith(
      MESH.data_id,
      expect.objectContaining({ name: "depth" }),
    );
    expect(setter("setMeshPolygonsPolygonAttribute")).toHaveBeenCalledWith(
      OTHER_MESH.data_id,
      expect.objectContaining({ name: "depth" }),
    );
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test("sets the attribute, then the active coloring, then renders", async () => {
    await colorOne(POLYGON_COMMAND, { id: MESH.data_id, name: "depth" });

    expect(setter("setMeshPolygonsActiveColoring")).toHaveBeenCalledAfter(
      setter("setMeshPolygonsPolygonAttribute"),
    );
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledAfter(
      setter("setMeshPolygonsActiveColoring"),
    );
    expect(setter("setMeshPolygonsPolygonAttributeTimeStep")).not.toHaveBeenCalled();
  });

  test("keeps the current colormap of the attribute by default", async () => {
    setter("meshPolygonsPolygonAttributeColorMap").mockReturnValue("batlowK");

    await colorOne(POLYGON_COMMAND, { id: MESH.data_id, name: "depth" });

    expect(setter("setMeshPolygonsPolygonAttribute")).toHaveBeenCalledWith(
      MESH.data_id,
      expect.objectContaining({ colorMap: "batlowK" }),
    );
  });

  test("uses the given range, item, colormap and no-data color", async () => {
    await colorOne(POLYGON_COMMAND, {
      id: MESH.data_id,
      name: "velocity",
      item: 1,
      minimum: CUSTOM_MIN,
      maximum: CUSTOM_MAX,
      colormap: "batlowK",
      noDataColor: ORANGE_HEX,
    });

    expect(setter("setMeshPolygonsPolygonAttribute")).toHaveBeenCalledWith(MESH.data_id, {
      name: "velocity",
      item: 1,
      minimum: CUSTOM_MIN,
      maximum: CUSTOM_MAX,
      colorMap: "batlowK",
      no_data_color: ORANGE,
    });
  });

  test("defaults the range to the range of the item", async () => {
    await colorOne(POLYGON_COMMAND, { id: MESH.data_id, name: "velocity", item: 1 });

    expect(setter("setMeshPolygonsPolygonAttribute")).toHaveBeenCalledWith(
      MESH.data_id,
      expect.objectContaining({ minimum: VELOCITY_Y_MIN, maximum: VELOCITY_Y_MAX }),
    );
  });

  test.each([
    { params: { name: "velocity", item: VELOCITY_ITEMS }, error: "nb_items 3" },
    {
      params: { name: "depth", colormap: "rainbowish" },
      error: 'Unknown colormap "rainbowish"; read vease://colormaps',
    },
    {
      params: { name: "depth", minimum: CUSTOM_MAX, maximum: CUSTOM_MIN },
      error: "minimum (4) is greater than maximum (-1)",
    },
    { params: { name: "depth", minimum: CUSTOM_MIN }, error: "Give both minimum and maximum" },
    { params: { name: "pressure", timeStep: MISSING_TIME_STEP }, error: "available: 0, 0.5, 1" },
    {
      params: { name: "missing" },
      error: 'Attribute "missing" not found on "surface". Available: polygons/polygon: depth',
    },
  ])("rejects $error", async ({ params, error }) => {
    await expect(colorOne(POLYGON_COMMAND, { id: MESH.data_id, ...params })).rejects.toThrow(error);
    expect(setter("setMeshPolygonsPolygonAttribute")).not.toHaveBeenCalled();
    expect(stores.hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });

  test("keeps the stored step of a time series without timeStep", async () => {
    setter("meshPolygonsPolygonAttributeTimeStep").mockReturnValue(LAST_TIME_STEP_INDEX);

    await expect(
      colorOne(POLYGON_COMMAND, { id: MESH.data_id, name: "pressure" }),
    ).resolves.toMatchObject({ timeStep: 1 });
    expect(setter("setMeshPolygonsPolygonAttributeTimeStep")).toHaveBeenCalledWith(
      MESH.data_id,
      LAST_TIME_STEP_INDEX,
    );
  });

  test("shows the first step of a time series without a valid stored step", async () => {
    setter("meshPolygonsPolygonAttributeTimeStep").mockReturnValue(VELOCITY_ITEMS);

    await expect(
      colorOne(POLYGON_COMMAND, { id: MESH.data_id, name: "pressure" }),
    ).resolves.toMatchObject({ timeStep: 0 });
    expect(setter("setMeshPolygonsPolygonAttributeTimeStep")).toHaveBeenCalledWith(MESH.data_id, 0);
  });

  test("applies a time step that exists", async () => {
    await expect(
      colorOne(POLYGON_COMMAND, { id: MESH.data_id, name: "pressure", timeStep: TIME_STEP }),
    ).resolves.toMatchObject({ timeStep: TIME_STEP });

    expect(setter("setMeshPolygonsPolygonAttributeTimeStep")).toHaveBeenCalledWith(
      MESH.data_id,
      TIME_STEP_INDEX,
    );
    expect(setter("setMeshPolygonsPolygonAttributeTimeStep")).toHaveBeenCalledAfter(
      setter("setMeshPolygonsPolygonAttribute"),
    );
    expect(setter("setMeshPolygonsActiveColoring")).toHaveBeenCalledAfter(
      setter("setMeshPolygonsPolygonAttributeTimeStep"),
    );
  });

  test("colors mesh polygons by a vertex attribute through the vertex setters", async () => {
    answerAttributes(stores, { [backSchemas.vertex_attribute_names.$id]: [PRESSURE] });

    await colorOne(VERTEX_COMMAND, { id: MESH.data_id, name: "pressure", timeStep: TIME_STEP });

    expect(setter("setMeshPolygonsVertexAttribute")).toHaveBeenCalledWith(MESH.data_id, {
      name: "pressure",
      item: 0,
      minimum: 0,
      maximum: 1,
      colorMap: "batlow",
    });
    expect(setter("setMeshPolygonsVertexAttributeTimeStep")).toHaveBeenCalledWith(
      MESH.data_id,
      TIME_STEP_INDEX,
    );
    expect(setter("setMeshPolygonsActiveColoring")).toHaveBeenCalledWith(MESH.data_id, "vertex");
  });

  test("looks the attribute up at the location of the command only", async () => {
    await expect(colorOne(VERTEX_COMMAND, { id: MESH.data_id, name: "depth" })).rejects.toThrow(
      'Attribute "depth" not found on "surface". Available: polygons/polygon: depth, velocity, pressure',
    );
    expect(setter("setMeshPolygonsPolygonAttribute")).not.toHaveBeenCalled();
  });

  test("rejects an element the mesh does not have", async () => {
    await expect(
      colorOne("style/mesh/edges/edge/attribute", { id: MESH.data_id, name: "depth" }),
    ).rejects.toThrow('"edges" is not available on "surface"; available: points, polygons');
  });

  test("rejects componentIds on a mesh", async () => {
    await expect(
      colorOne(POLYGON_COMMAND, { id: MESH.data_id, componentIds: ["s1"], name: "depth" }),
    ).rejects.toThrow("componentIds only applies to model corners, lines, surfaces, blocks");
  });

  test("reports the data of the other viewer type as failed", async () => {
    await expect(
      runCommand(POLYGON_COMMAND, { ids: [MESH.data_id, MODEL.data_id], name: "depth" }),
    ).resolves.toMatchObject({
      ids: [MESH.data_id],
      attributes: [{ id: MESH.data_id, attribute: "depth" }],
      failed: [{ id: MODEL.data_id, error: '"brep" is a model; use the style/model routes' }],
    });
  });
});
