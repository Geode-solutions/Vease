import {
  MESH,
  MISSING_ERROR,
  MISSING_ID,
  MODEL,
  ONCE,
  ORANGE,
  ORANGE_HEX,
  OTHER_MESH,
  createStores,
  runCommand,
  setupStores,
  styleSetter,
} from "@vease_tests/unit/utils/controller/handlers/style/fixtures";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { checkMesh, checkModel } from "@vease/utils/controller/handlers/style/common";
import type {
  getBackStore,
  getDataStyleStore,
  getHybridViewerStore,
} from "@vease/utils/external_stores";
import { STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/index";
import { controllerHandlers } from "@vease/utils/controller/index";
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

// 16 mesh, 16 model and 16 attribute routes
const STYLE_COMMAND_COUNT = 48;

describe("the style commands", () => {
  const stores = createStores();

  beforeEach(() => {
    vi.clearAllMocks();
    setupStores(stores);
  });

  test("registers one controller command per style route", () => {
    expect(Object.keys(STYLE_COMMANDS)).toHaveLength(STYLE_COMMAND_COUNT);
    expect(Object.keys(controllerHandlers)).toStrictEqual(
      expect.arrayContaining(Object.keys(STYLE_COMMANDS)),
    );
    expect(Object.keys(controllerHandlers)).not.toContain("set-style");
    expect(Object.keys(controllerHandlers)).not.toContain("color-by-attribute");
  });

  test("styles every data, then renders once", async () => {
    await expect(
      runCommand("style/mesh/color", { ids: [MESH.id, OTHER_MESH.id], color: ORANGE_HEX }),
    ).resolves.toStrictEqual({ ids: [MESH.id, OTHER_MESH.id] });

    const setMeshColor = styleSetter(stores, "setMeshColor");
    expect(setMeshColor).toHaveBeenCalledWith(MESH.id, ORANGE);
    expect(setMeshColor).toHaveBeenCalledWith(OTHER_MESH.id, ORANGE);
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledAfter(setMeshColor);
  });

  test("reports the data it could not style and keeps the others", async () => {
    await expect(
      runCommand("style/mesh/color", {
        ids: [MESH.id, MISSING_ID, MODEL.id],
        color: ORANGE_HEX,
      }),
    ).resolves.toStrictEqual({
      ids: [MESH.id],
      failed: [
        { id: MISSING_ID, error: MISSING_ERROR },
        { id: MODEL.id, error: '"brep" is a model; use the style/model routes' },
      ],
    });
    expect(styleSetter(stores, "setMeshColor")).toHaveBeenCalledExactlyOnceWith(MESH.id, ORANGE);
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test("throws one message when no data could be styled, without rendering", async () => {
    await expect(
      runCommand("style/mesh/points/size", { ids: [MISSING_ID, MISSING_ID], size: 1 }),
    ).rejects.toHaveProperty("message", MISSING_ERROR);
    expect(stores.hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });
});

describe("the style viewer type checks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupStores(createStores());
  });

  test("accepts a mesh and any element it has", () => {
    expect(() => {
      checkMesh(MESH);
      checkMesh(MESH, "polygons");
    }).not.toThrow();
  });

  test("lists the elements the mesh has when one is missing", () => {
    expect(() => {
      checkMesh(MESH, "polyhedra");
    }).toThrow('"polyhedra" is not available on "surface"; available: points, polygons');
  });

  test("rejects a model on the mesh routes", () => {
    expect(() => {
      checkMesh(MODEL);
    }).toThrow('"brep" is a model; use the style/model routes');
  });

  test("accepts a model and rejects a mesh on the model routes", () => {
    expect(() => {
      checkModel(MODEL);
    }).not.toThrow();
    expect(() => {
      checkModel(MESH);
    }).toThrow('"surface" is a mesh; use the style/mesh routes');
  });
});
