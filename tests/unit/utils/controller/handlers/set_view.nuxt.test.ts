import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { CameraOptions } from "@ogw_internal/stores/hybrid_viewer/vtk_types";
import { controllerHandlers } from "@vease/utils/controller/index";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { getTable } from "@ogw_internal/database/database.js";
import { useCameraManagerStore } from "@ogw_front/stores/camera_manager";
import { useViewerStore } from "@ogw_front/stores/viewer";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@ogw_front/stores/viewer"), () => ({
  useViewerStore: vi.fn<typeof useViewerStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

const MODEL: DataItem = {
  id: "model-1",
  geode_id: "geode-1",
  name: "brep",
  viewer_type: "model",
  geode_object_type: "BRep",
  visible: true,
  created_at: "2026-10-09",
};

const MESH: DataItem = { ...MODEL, id: "mesh-1", name: "surface", viewer_type: "mesh" };

const ONCE = 1;
const Z_SCALING = 3;
// oxlint-disable-next-line eslint/id-length -- r, g, b are the viewer parameter names
const ORANGE = { r: 255, g: 136, b: 0 };
const FIRST_VIEWER_ID = 7;
const SECOND_VIEWER_ID = 8;
const VIEWER_IDS = [FIRST_VIEWER_ID, SECOND_VIEWER_ID];
const VIEW_ANGLE = 30;
const NEAR = 0.1;
const FAR = 100;
const CAMERA_OPTIONS: CameraOptions = {
  focal_point: [0, 0, 0],
  view_up: [0, 0, 1],
  position: [1, 1, 1],
  view_angle: VIEW_ANGLE,
  clipping_range: [NEAR, FAR],
  distance: 1,
};

const dataStore = {
  item: vi.fn<(id: string) => Promise<DataItem>>(),
  getMeshComponentsViewerIds: vi.fn<() => Promise<number[]>>(),
};
const viewerStore = { request: vi.fn<(args: unknown) => Promise<unknown>>() };
const hybridViewerStore = {
  resetCamera: vi.fn<() => void>(),
  focusCameraOnObject: vi.fn<() => Promise<void>>(),
  setCameraOrientation: vi.fn<() => void>(),
  setCamera: vi.fn<() => void>(),
  setZScaling: vi.fn<() => Promise<void>>(),
  remoteRender: vi.fn<() => Promise<void>>(),
  camera_options: CAMERA_OPTIONS,
  genericRenderWindow: {} as object | undefined,
};

async function setView(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["set-view"]?.(params);
  return result;
}

describe("the set-view controller handler", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
    vi.mocked(getHybridViewerStore).mockReturnValue(
      hybridViewerStore as unknown as ReturnType<typeof getHybridViewerStore>,
    );
    vi.mocked(useDataStore).mockReturnValue(
      dataStore as unknown as ReturnType<typeof useDataStore>,
    );
    vi.mocked(useViewerStore).mockReturnValue(
      viewerStore as unknown as ReturnType<typeof useViewerStore>,
    );
    /* oxlint-enable no-unsafe-type-assertion */
    dataStore.item.mockResolvedValue(MODEL);
    dataStore.getMeshComponentsViewerIds.mockResolvedValue(VIEWER_IDS);
    hybridViewerStore.genericRenderWindow = {};
    await getTable("camera_positions").clear();
  });

  test("reset resets the camera", async () => {
    await expect(setView({ action: "reset" })).resolves.toStrictEqual({ action: "reset" });
    expect(hybridViewerStore.resetCamera).toHaveBeenCalledTimes(ONCE);
  });

  test("focus focuses the camera on the whole data", async () => {
    await setView({ action: "focus", id: MODEL.id });

    expect(hybridViewerStore.focusCameraOnObject).toHaveBeenCalledWith(MODEL.id, []);
  });

  test("focus converts component geode ids to viewer ids", async () => {
    await setView({ action: "focus", id: MODEL.id, componentIds: ["block-a", "block-b"] });

    expect(dataStore.getMeshComponentsViewerIds).toHaveBeenCalledWith(MODEL.id, [
      "block-a",
      "block-b",
    ]);
    expect(hybridViewerStore.focusCameraOnObject).toHaveBeenCalledWith(MODEL.id, VIEWER_IDS);
  });

  test("focus needs an id", async () => {
    await expect(setView({ action: "focus" })).rejects.toThrow("focus needs id");
  });

  test("focus rejects an unknown id", async () => {
    dataStore.item.mockRejectedValue(new Error("Item not found: nope"));

    await expect(setView({ action: "focus", id: "nope" })).rejects.toThrow(
      'No data with id "nope"',
    );
  });

  test("focus rejects componentIds on a mesh", async () => {
    dataStore.item.mockResolvedValue(MESH);

    await expect(setView({ action: "focus", id: MESH.id, componentIds: ["a"] })).rejects.toThrow(
      "componentIds only applies to models",
    );
  });

  test("orient sets the camera orientation", async () => {
    await expect(setView({ action: "orient", orientation: "zplus" })).resolves.toStrictEqual({
      action: "orient",
      orientation: "zplus",
    });
    expect(hybridViewerStore.setCameraOrientation).toHaveBeenCalledWith("zplus");
  });

  test("orient needs an orientation", async () => {
    await expect(setView({ action: "orient" })).rejects.toThrow("orient needs orientation");
    expect(hybridViewerStore.setCameraOrientation).not.toHaveBeenCalled();
  });

  test("save stores the current camera and returns the saved positions", async () => {
    const result = await setView({ action: "save", name: "top" });

    const [saved] = await getTable<{ id: number; name: string }>("camera_positions").toArray();
    expect(saved?.name).toBe("top");
    expect(result).toStrictEqual({
      action: "save",
      positions: [{ id: saved?.id, name: "top" }],
    });
  });

  test("save needs a name", async () => {
    await expect(setView({ action: "save" })).rejects.toThrow("save needs name");
  });

  test("restore applies the saved camera", async () => {
    await useCameraManagerStore().saveCameraPosition("top", CAMERA_OPTIONS);
    const [saved] = await getTable<{ id: number }>("camera_positions").toArray();

    await expect(setView({ action: "restore", positionId: saved?.id })).resolves.toStrictEqual({
      action: "restore",
      positionId: saved?.id,
      name: "top",
    });
    expect(hybridViewerStore.setCamera).toHaveBeenCalledWith(CAMERA_OPTIONS);
  });

  test("restore restores through the viewer when there is no render window", async () => {
    await useCameraManagerStore().saveCameraPosition("top", CAMERA_OPTIONS);
    const [saved] = await getTable<{ id: number }>("camera_positions").toArray();
    hybridViewerStore.genericRenderWindow = undefined;
    viewerStore.request.mockResolvedValue({});

    await setView({ action: "restore", positionId: saved?.id });

    expect(hybridViewerStore.setCamera).not.toHaveBeenCalled();
    expect(viewerStore.request).toHaveBeenCalledTimes(ONCE);
  });

  test("restore lists saved positions when the id is unknown", async () => {
    await useCameraManagerStore().saveCameraPosition("top", CAMERA_OPTIONS);

    await expect(setView({ action: "restore", positionId: 999 })).rejects.toThrow(
      /No camera position 999.*top/u,
    );
    expect(hybridViewerStore.setCamera).not.toHaveBeenCalled();
  });

  test("restore needs a positionId", async () => {
    await expect(setView({ action: "restore" })).rejects.toThrow("restore needs positionId");
  });

  test("scene sets the z scaling and renders", async () => {
    await expect(setView({ action: "scene", zScaling: Z_SCALING })).resolves.toStrictEqual({
      action: "scene",
      zScaling: Z_SCALING,
    });
    expect(hybridViewerStore.setZScaling).toHaveBeenCalledWith(Z_SCALING);
    expect(hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test("scene sets background from hex", async () => {
    await setView({ action: "scene", backgroundColor: "#ff8800" });

    expect(viewerStore.request).toHaveBeenCalledWith(
      expect.objectContaining({ params: { color: ORANGE } }),
    );
  });

  test("scene toggles axes and grid", async () => {
    await setView({ action: "scene", axes: true, grid: false });

    expect(viewerStore.request).toHaveBeenCalledWith(
      expect.objectContaining({ params: { visibility: true } }),
    );
    expect(viewerStore.request).toHaveBeenCalledWith(
      expect.objectContaining({ params: { visibility: false } }),
    );
  });

  test("scene needs at least one setting", async () => {
    await expect(setView({ action: "scene" })).rejects.toThrow(
      "scene needs zScaling, backgroundColor, axes or grid",
    );
    expect(hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });
});
