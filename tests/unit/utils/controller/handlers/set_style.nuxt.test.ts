import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { controllerHandlers } from "@vease/utils/controller/index";
import { setDataVisibility } from "@vease/utils/data_actions";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@vease/utils/data_actions"), () => ({
  setDataVisibility: vi.fn<typeof setDataVisibility>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getDataStyleStore: vi.fn<typeof getDataStyleStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

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

const ORANGE = { red: 255, green: 136, blue: 0, alpha: 1 };
const ONCE = 1;
const POINT_SIZE = 5;
const EDGE_WIDTH = 3;

const styleStore = {
  getStyle: vi.fn<(id: string) => Record<string, unknown>>(),
  setMeshVisibility: vi.fn<() => Promise<void>>(),
  setMeshColor: vi.fn<() => Promise<void>>(),
  setMeshEdgesVisibility: vi.fn<() => Promise<void>>(),
  setMeshEdgesWidth: vi.fn<() => Promise<void>>(),
  setModelEdgesVisibility: vi.fn<() => Promise<void>>(),
  setMeshPointsVisibility: vi.fn<() => Promise<void>>(),
  setMeshPointsColor: vi.fn<() => Promise<void>>(),
  setMeshPointsActiveColoring: vi.fn<() => Promise<void>>(),
  setMeshPointsSize: vi.fn<() => Promise<void>>(),
  setMeshPolygonsVisibility: vi.fn<() => Promise<void>>(),
  setMeshPolygonsColor: vi.fn<() => Promise<void>>(),
  setMeshPolygonsActiveColoring: vi.fn<() => Promise<void>>(),
  setModelVisibility: vi.fn<() => Promise<void>>(),
  setModelPointsVisibility: vi.fn<() => Promise<void>>(),
  setModelPointsSize: vi.fn<() => Promise<void>>(),
  setModelSurfacesVisibility: vi.fn<() => Promise<void>>(),
  setModelSurfacesColor: vi.fn<() => Promise<void>>(),
  setModelSurfacesActiveColoring: vi.fn<() => Promise<void>>(),
};
const dataStore = {
  item: vi.fn<(id: string) => Promise<DataItem>>(),
  getMeshComponentGeodeIds: vi.fn<(id: string, type: string) => Promise<string[]>>(),
};
const hybridViewerStore = { remoteRender: vi.fn<() => Promise<void>>() };

async function setStyle(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["set-style"]?.(params);
  return result;
}

describe("the set-style controller handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
    vi.mocked(getDataStyleStore).mockReturnValue(
      styleStore as unknown as ReturnType<typeof getDataStyleStore>,
    );
    vi.mocked(getHybridViewerStore).mockReturnValue(
      hybridViewerStore as unknown as ReturnType<typeof getHybridViewerStore>,
    );
    vi.mocked(useDataStore).mockReturnValue(
      dataStore as unknown as ReturnType<typeof useDataStore>,
    );
    /* oxlint-enable no-unsafe-type-assertion */
    dataStore.item.mockResolvedValue(MESH);
    dataStore.getMeshComponentGeodeIds.mockImplementation(async (_id, type) => {
      await Promise.resolve();
      return type === "Surface" ? ["s1", "s2"] : [];
    });
    styleStore.getStyle.mockReturnValue({ visibility: true, points: {}, polygons: {} });
  });

  test("hides the whole mesh", async () => {
    await expect(setStyle({ id: MESH.id, visibility: false })).resolves.toStrictEqual({
      id: MESH.id,
      applied: ["visibility"],
    });
    expect(setDataVisibility).toHaveBeenCalledWith(MESH.id, false);
    expect(styleStore.setMeshVisibility).not.toHaveBeenCalled();
  });

  test("shows and colors the whole mesh", async () => {
    await setStyle({ id: MESH.id, visibility: true, color: "#ff8800" });

    expect(setDataVisibility).toHaveBeenCalledWith(MESH.id, true);
    expect(styleStore.setMeshColor).toHaveBeenCalledWith(MESH.id, ORANGE);
  });

  test("colors mesh polygons and switches them to constant coloring", async () => {
    await setStyle({ id: MESH.id, target: "polygons", color: "#ff8800" });

    expect(styleStore.setMeshPolygonsColor).toHaveBeenCalledWith(MESH.id, ORANGE);
    expect(styleStore.setMeshPolygonsActiveColoring).toHaveBeenCalledWith(MESH.id, "constant");
  });

  test("sets the point size only on points", async () => {
    await setStyle({ id: MESH.id, target: "points", size: POINT_SIZE });

    expect(styleStore.setMeshPointsSize).toHaveBeenCalledWith(MESH.id, POINT_SIZE);
  });

  test("rejects a size on polygons", async () => {
    await expect(setStyle({ id: MESH.id, target: "polygons", size: POINT_SIZE })).rejects.toThrow(
      /size/u,
    );
  });

  test("rejects a width on points", async () => {
    await expect(setStyle({ id: MESH.id, target: "points", width: EDGE_WIDTH })).rejects.toThrow(
      /width/u,
    );
  });

  test("rejects a target the mesh does not have", async () => {
    await expect(setStyle({ id: MESH.id, target: "edges", visibility: true })).rejects.toThrow(
      '"edges" is not available on "surface"; available: points, polygons',
    );
  });

  test("colors all surfaces of a model when no componentIds are given", async () => {
    dataStore.item.mockResolvedValue(MODEL);
    styleStore.getStyle.mockReturnValue({ visibility: true });

    await setStyle({ id: MODEL.id, target: "surfaces", color: "#ff8800" });

    expect(dataStore.getMeshComponentGeodeIds).toHaveBeenCalledWith(MODEL.id, "Surface");
    expect(styleStore.setModelSurfacesColor).toHaveBeenCalledWith(
      MODEL.id,
      ["s1", "s2"],
      ORANGE,
      "constant",
    );
  });

  test("colors only the given components", async () => {
    dataStore.item.mockResolvedValue(MODEL);
    await setStyle({ id: MODEL.id, target: "surfaces", componentIds: ["s2"], color: "#ff8800" });

    expect(styleStore.setModelSurfacesColor).toHaveBeenCalledWith(
      MODEL.id,
      ["s2"],
      ORANGE,
      "constant",
    );
  });

  test("rejects component ids the target does not have", async () => {
    dataStore.item.mockResolvedValue(MODEL);

    await expect(
      setStyle({ id: MODEL.id, target: "surfaces", componentIds: ["s2", "b1"], visibility: false }),
    ).rejects.toThrow(
      `"brep" has no surfaces with geode id b1; read vease://data/${MODEL.id} for its components`,
    );
    expect(styleStore.setModelSurfacesVisibility).not.toHaveBeenCalled();
  });

  test("applies random coloring to model components", async () => {
    dataStore.item.mockResolvedValue(MODEL);
    await setStyle({ id: MODEL.id, target: "surfaces", componentIds: ["s1"], coloring: "random" });

    expect(styleStore.setModelSurfacesActiveColoring).toHaveBeenCalledWith(
      MODEL.id,
      ["s1"],
      "random",
    );
  });

  test("styles the points of a model", async () => {
    dataStore.item.mockResolvedValue(MODEL);
    await setStyle({ id: MODEL.id, target: "points", visibility: true, size: POINT_SIZE });

    expect(styleStore.setModelPointsVisibility).toHaveBeenCalledWith(MODEL.id, true);
    expect(styleStore.setModelPointsSize).toHaveBeenCalledWith(MODEL.id, POINT_SIZE);
  });

  test("hides a whole model", async () => {
    dataStore.item.mockResolvedValue(MODEL);
    await setStyle({ id: MODEL.id, visibility: false });

    expect(setDataVisibility).toHaveBeenCalledWith(MODEL.id, false);
    expect(styleStore.setModelVisibility).not.toHaveBeenCalled();
  });

  test("rejects a color without target on a model", async () => {
    dataStore.item.mockResolvedValue(MODEL);
    await expect(setStyle({ id: MODEL.id, color: "#ff8800" })).rejects.toThrow(
      "Give a target to style a model: points, edges, corners, lines, surfaces or blocks",
    );
  });

  test("rejects componentIds on a mesh", async () => {
    await expect(
      setStyle({ id: MESH.id, target: "polygons", componentIds: ["s1"], visibility: true }),
    ).rejects.toThrow(/componentIds/u);
  });

  test("rejects an empty change", async () => {
    await expect(setStyle({ id: MESH.id })).rejects.toThrow(
      "Nothing to change: give visibility, color, size, width or coloring",
    );
  });

  test("renders once after applying", async () => {
    await setStyle({ id: MESH.id, target: "points", visibility: true, size: POINT_SIZE });

    expect(hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test("throws when the model has no component of the target type", async () => {
    dataStore.item.mockResolvedValue(MODEL);

    await expect(setStyle({ id: MODEL.id, target: "blocks", visibility: true })).rejects.toThrow(
      '"brep" has no blocks',
    );
  });

  test("styles the edges of a model with the model setter", async () => {
    dataStore.item.mockResolvedValue(MODEL);

    await setStyle({ id: MODEL.id, target: "edges", visibility: true });

    expect(styleStore.setModelEdgesVisibility).toHaveBeenCalledWith(MODEL.id, true);
    expect(styleStore.setMeshEdgesVisibility).not.toHaveBeenCalled();
  });

  test("sets the edge width on mesh edges", async () => {
    styleStore.getStyle.mockReturnValue({ visibility: true, edges: {} });

    await setStyle({ id: MESH.id, target: "edges", width: EDGE_WIDTH });

    expect(styleStore.setMeshEdgesWidth).toHaveBeenCalledWith(MESH.id, EDGE_WIDTH);
  });

  test("rejects random coloring on a mesh element", async () => {
    await expect(setStyle({ id: MESH.id, target: "polygons", coloring: "random" })).rejects.toThrow(
      /random/u,
    );
  });

  test("rejects textures coloring on mesh points", async () => {
    await expect(setStyle({ id: MESH.id, target: "points", coloring: "textures" })).rejects.toThrow(
      /textures/u,
    );
  });

  test("rejects componentIds on model points and edges", async () => {
    dataStore.item.mockResolvedValue(MODEL);

    await expect(
      setStyle({ id: MODEL.id, target: "points", componentIds: ["s1"], visibility: true }),
    ).rejects.toThrow(/componentIds/u);
    await expect(
      setStyle({ id: MODEL.id, target: "edges", componentIds: ["s1"], visibility: true }),
    ).rejects.toThrow(/componentIds/u);
  });

  test("rejects a mesh-only target on a model", async () => {
    dataStore.item.mockResolvedValue(MODEL);

    await expect(setStyle({ id: MODEL.id, target: "cells", visibility: true })).rejects.toThrow(
      /not a model target/u,
    );
  });

  test("rejects textures coloring on model components", async () => {
    dataStore.item.mockResolvedValue(MODEL);

    await expect(
      setStyle({ id: MODEL.id, target: "surfaces", componentIds: ["s1"], coloring: "textures" }),
    ).rejects.toThrow(/textures/u);
  });
});
