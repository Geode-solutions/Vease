import {
  MESH,
  MODEL,
  ONCE,
  ORANGE,
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
import { MESH_STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/mesh";
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

const POINT_SIZE = 5;
const EDGE_WIDTH = 3;

const ELEMENTS = [
  { element: "points", setter: "Points" },
  { element: "edges", setter: "Edges" },
  { element: "cells", setter: "Cells" },
  { element: "polygons", setter: "Polygons" },
  { element: "polyhedra", setter: "Polyhedra" },
];

interface SetterCase {
  command: string;
  params: Record<string, unknown>;
  calls: [string, ...unknown[]][];
}

// Every command that only calls dataStyle store setters, with the calls it makes on MESH
const SETTER_CASES: SetterCase[] = [
  {
    command: "style/mesh/color",
    params: { color: ORANGE_HEX },
    calls: [["setMeshColor", MESH.id, ORANGE]],
  },
  ...ELEMENTS.flatMap(({ element, setter }) => [
    {
      command: `style/mesh/${element}/visibility`,
      params: { visibility: false },
      calls: [[`setMesh${setter}Visibility`, MESH.id, false]] satisfies SetterCase["calls"],
    },
    {
      command: `style/mesh/${element}/color`,
      params: { color: ORANGE_HEX },
      calls: [
        [`setMesh${setter}Color`, MESH.id, ORANGE],
        [`setMesh${setter}ActiveColoring`, MESH.id, "constant"],
      ] satisfies SetterCase["calls"],
    },
  ]),
  {
    command: "style/mesh/points/size",
    params: { size: POINT_SIZE },
    calls: [["setMeshPointsSize", MESH.id, POINT_SIZE]],
  },
  {
    command: "style/mesh/edges/width",
    params: { width: EDGE_WIDTH },
    calls: [["setMeshEdgesWidth", MESH.id, EDGE_WIDTH]],
  },
  {
    command: "style/mesh/cells/coloring",
    params: { coloring: "textures" },
    calls: [["setMeshCellsActiveColoring", MESH.id, "textures"]],
  },
  {
    command: "style/mesh/polygons/coloring",
    params: { coloring: "constant" },
    calls: [["setMeshPolygonsActiveColoring", MESH.id, "constant"]],
  },
];

const ALL_CASES = [
  { command: "style/mesh/visibility", params: { visibility: false } },
  ...SETTER_CASES,
];

// The MESH fixture only has points and polygons
const UNAVAILABLE_CASES = SETTER_CASES.map(({ command, params }) => ({
  command,
  params,
  element: command.split("/")[2] ?? "",
})).filter(({ element }) => ["edges", "cells", "polyhedra"].includes(element));

describe("the style/mesh controller commands", () => {
  const stores = createStores();

  beforeEach(() => {
    vi.clearAllMocks();
    setupStores(stores);
    styleSetter(stores, "getStyle").mockReturnValue(
      Object.fromEntries([["visibility", true], ...ELEMENTS.map(({ element }) => [element, {}])]),
    );
  });

  test("has one command per mesh style route", () => {
    expect(Object.keys(MESH_STYLE_COMMANDS).toSorted()).toStrictEqual(
      ALL_CASES.map(({ command }) => command).toSorted(),
    );
  });

  test("hides the whole mesh through the data tree", async () => {
    await expect(
      runCommand("style/mesh/visibility", { ids: [MESH.id], visibility: false }),
    ).resolves.toStrictEqual({ ids: [MESH.id] });

    expect(setDataVisibility).toHaveBeenCalledExactlyOnceWith(MESH.id, false);
    expect(styleSetter(stores, "setMeshVisibility")).not.toHaveBeenCalled();
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test.each(SETTER_CASES)(
    "$command calls its store setters",
    async ({ command, params, calls }) => {
      await expect(runCommand(command, { ids: [MESH.id], ...params })).resolves.toStrictEqual({
        ids: [MESH.id],
      });

      expect(calls.map(([setter]) => styleSetter(stores, setter).mock.calls)).toStrictEqual(
        calls.map(([, ...args]) => [args]),
      );
      expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
    },
  );

  test.each(ELEMENTS)(
    "switches $element to constant coloring after setting their color",
    async ({ element, setter }) => {
      await runCommand(`style/mesh/${element}/color`, { ids: [MESH.id], color: ORANGE_HEX });

      expect(styleSetter(stores, `setMesh${setter}ActiveColoring`)).toHaveBeenCalledAfter(
        styleSetter(stores, `setMesh${setter}Color`),
      );
      expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledAfter(
        styleSetter(stores, `setMesh${setter}ActiveColoring`),
      );
    },
  );

  test.each(UNAVAILABLE_CASES)(
    "$command rejects a mesh without $element",
    async ({ command, params, element }) => {
      styleSetter(stores, "getStyle").mockReturnValue({
        visibility: true,
        points: {},
        polygons: {},
      });

      await expect(runCommand(command, { ids: [MESH.id], ...params })).rejects.toThrow(
        `"${element}" is not available on "surface"; available: points, polygons`,
      );
      expect(stores.hybridViewerStore.remoteRender).not.toHaveBeenCalled();
    },
  );

  test.each(ALL_CASES)("$command rejects a model", async ({ command, params }) => {
    await expect(runCommand(command, { ids: [MODEL.id], ...params })).rejects.toThrow(
      '"brep" is a model; use the style/model routes',
    );
    expect(setDataVisibility).not.toHaveBeenCalled();
  });
});
