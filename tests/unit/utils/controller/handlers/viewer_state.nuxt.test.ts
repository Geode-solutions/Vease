import { beforeEach, describe, expect, test, vi } from "vitest";
import type { CameraOptions } from "@ogw_internal/stores/hybrid_viewer/vtk_types";
import { controllerHandlers } from "@vease/utils/controller/index";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { getTable } from "@ogw_internal/database/database.js";
import { setupActivePinia } from "@vease_tests/utils";
import { useCameraManagerStore } from "@ogw_front/stores/camera_manager";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/external_stores"), () => ({
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

const Z_SCALING = 2.5;
const CAMERA_OPTIONS: CameraOptions = {
  focal_point: [0, 0, 0],
  view_up: [0, 0, 1],
  position: [0, 0, 1],
  view_angle: 30,
  clipping_range: [1, 2],
  distance: 1,
};

describe("the viewer-state controller handler", () => {
  beforeEach(async () => {
    setupActivePinia();
    await getTable("camera_positions").clear();
  });

  test("reports z scaling and saved camera positions", async () => {
    vi.mocked(getHybridViewerStore).mockReturnValue({
      zScale: Z_SCALING,
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store
    } as unknown as ReturnType<typeof getHybridViewerStore>);
    const cameraManagerStore = useCameraManagerStore();
    await cameraManagerStore.saveCameraPosition("top", CAMERA_OPTIONS);
    await cameraManagerStore.saveCameraPosition("side", CAMERA_OPTIONS);

    const state = await controllerHandlers["viewer-state"]?.({});
    const saved = await getTable<{ id: number }>("camera_positions").toArray();
    const [topId, sideId] = saved.map(({ id }) => id);

    expect(state).toStrictEqual({
      zScaling: Z_SCALING,
      cameraPositions: [
        { id: topId, name: "top" },
        { id: sideId, name: "side" },
      ],
      orientations: ["xplus", "xminus", "yplus", "yminus", "zplus", "zminus"],
    });
  });
});
