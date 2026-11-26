import {
  IMAGE_2D,
  IMAGE_3D,
  MESH,
  MODEL,
  ONCE,
  ORANGE_HEX,
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
import { IMAGE_STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/image";
import { STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/index";
import { setDataVisibility } from "@vease/utils/data_actions";
import type { useDataStore } from "@ogw_front/stores/data";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@vease/utils/data_actions"), () => ({
  setDataVisibility: vi.fn<typeof setDataVisibility>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getDataStyleStore: vi.fn<typeof getDataStyleStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

const HALF = 0.5;
const IMAGES = [IMAGE_2D, IMAGE_3D];
const IMAGE_COMMANDS = [
  { command: "style/image/visibility", params: { visibility: false } },
  { command: "style/image/opacity", params: { opacity: HALF } },
];

// Every value a non-image style command may read, so that only the viewer type check fails
const ANY_STYLE_PARAMS = {
  visibility: false,
  color: ORANGE_HEX,
  size: 1,
  width: 1,
  coloring: "constant",
  name: "depth",
};

const NON_IMAGE_CASES = Object.keys(STYLE_COMMANDS)
  .filter((command) => !command.startsWith("style/image/"))
  .flatMap((command) => IMAGES.map((image) => ({ command, image, name: image.name })));

describe("the style/image controller commands", () => {
  const stores = createStores();

  beforeEach(() => {
    vi.clearAllMocks();
    setupStores(stores);
    styleSetter(stores, "getStyle").mockReturnValue({ visibility: true, opacity: 1 });
  });

  test("has one command per image style route", () => {
    expect(Object.keys(IMAGE_STYLE_COMMANDS).toSorted()).toStrictEqual(
      IMAGE_COMMANDS.map(({ command }) => command).toSorted(),
    );
  });

  test("hides 2D and 3D images through the data tree, then renders once", async () => {
    await expect(
      runCommand("style/image/visibility", {
        ids: [IMAGE_2D.data_id, IMAGE_3D.data_id],
        visibility: false,
      }),
    ).resolves.toStrictEqual({ ids: [IMAGE_2D.data_id, IMAGE_3D.data_id] });

    expect(vi.mocked(setDataVisibility).mock.calls).toStrictEqual([
      [IMAGE_2D.data_id, false],
      [IMAGE_3D.data_id, false],
    ]);
    expect(styleSetter(stores, "setImageVisibility")).not.toHaveBeenCalled();
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test("sets the opacity of 2D and 3D images, then renders once", async () => {
    await expect(
      runCommand("style/image/opacity", {
        ids: [IMAGE_2D.data_id, IMAGE_3D.data_id],
        opacity: HALF,
      }),
    ).resolves.toStrictEqual({ ids: [IMAGE_2D.data_id, IMAGE_3D.data_id] });

    const setImageOpacity = styleSetter(stores, "setImageOpacity");
    expect(setImageOpacity.mock.calls).toStrictEqual([
      [IMAGE_2D.data_id, HALF],
      [IMAGE_3D.data_id, HALF],
    ]);
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledAfter(setImageOpacity);
  });

  test.each(IMAGE_COMMANDS)("$command rejects a mesh and a model", async ({ command, params }) => {
    await expect(
      runCommand(command, { ids: [IMAGE_2D.data_id, MESH.data_id, MODEL.data_id], ...params }),
    ).resolves.toStrictEqual({
      ids: [IMAGE_2D.data_id],
      failed: [
        { id: MESH.data_id, error: '"surface" is a mesh; use the style/mesh routes' },
        { id: MODEL.data_id, error: '"brep" is a model; use the style/model routes' },
      ],
    });
  });

  test.each(NON_IMAGE_CASES)("$command rejects the image $name", async ({ command, image }) => {
    await expect(
      runCommand(command, { ids: [image.data_id], ...ANY_STYLE_PARAMS }),
    ).rejects.toThrow(`"${image.name}" is an image; use the style/image routes`);
    expect(setDataVisibility).not.toHaveBeenCalled();
    expect(stores.request).not.toHaveBeenCalled();
    expect(stores.hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });
});
