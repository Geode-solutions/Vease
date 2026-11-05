import {
  MESH,
  MODEL,
  ONCE,
  ORANGE,
  ORANGE_HEX,
  answerComponents,
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
import { MODEL_STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/model";
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

const COMPONENTS = [
  { target: "corners", name: "Corners", type: "Corner", geodeIds: ["c1"] },
  { target: "lines", name: "Lines", type: "Line", geodeIds: ["l1", "l2"] },
  { target: "surfaces", name: "Surfaces", type: "Surface", geodeIds: ["s1", "s2"] },
  { target: "blocks", name: "Blocks", type: "Block", geodeIds: ["b1"] },
];

// The value param of each component property and the setter call it makes
const PROPERTIES = [
  { property: "visibility", params: { visibility: false }, setter: "Visibility", args: [false] },
  { property: "color", params: { color: ORANGE_HEX }, setter: "Color", args: [ORANGE, "constant"] },
  {
    property: "coloring",
    params: { coloring: "random" },
    setter: "ActiveColoring",
    args: ["random"],
  },
];

const COMPONENT_CASES = COMPONENTS.flatMap((component) =>
  PROPERTIES.map((property) => ({
    command: `style/model/${component.target}/${property.property}`,
    params: property.params,
    setter: `setModel${component.name}${property.setter}`,
    args: property.args,
    target: component.target,
    type: component.type,
    geodeIds: component.geodeIds,
  })),
);

interface SetterCase {
  command: string;
  params: Record<string, unknown>;
  calls: [string, ...unknown[]][];
}

const WHOLE_CASES: SetterCase[] = [
  {
    command: "style/model/points/visibility",
    params: { visibility: false },
    calls: [["setModelPointsVisibility", MODEL.id, false]],
  },
  {
    command: "style/model/points/size",
    params: { size: POINT_SIZE },
    calls: [["setModelPointsSize", MODEL.id, POINT_SIZE]],
  },
  {
    command: "style/model/edges/visibility",
    params: { visibility: true },
    calls: [["setModelEdgesVisibility", MODEL.id, true]],
  },
];

const ALL_CASES = [
  { command: "style/model/visibility", params: { visibility: false } },
  ...WHOLE_CASES,
  ...COMPONENT_CASES,
];

describe("the style/model controller commands", () => {
  const stores = createStores();

  beforeEach(() => {
    vi.clearAllMocks();
    setupStores(stores);
    answerComponents(
      stores,
      Object.fromEntries(COMPONENTS.map(({ type, geodeIds }) => [type, geodeIds])),
    );
  });

  test("has one command per model style route", () => {
    expect(Object.keys(MODEL_STYLE_COMMANDS).toSorted()).toStrictEqual(
      ALL_CASES.map(({ command }) => command).toSorted(),
    );
  });

  test("hides the whole model through the data tree", async () => {
    await expect(
      runCommand("style/model/visibility", { ids: [MODEL.id], visibility: false }),
    ).resolves.toStrictEqual({ ids: [MODEL.id] });

    expect(setDataVisibility).toHaveBeenCalledExactlyOnceWith(MODEL.id, false);
    expect(styleSetter(stores, "setModelVisibility")).not.toHaveBeenCalled();
    expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test.each(WHOLE_CASES)(
    "$command styles the whole model with the model setter",
    async ({ command, params, calls }) => {
      await expect(runCommand(command, { ids: [MODEL.id], ...params })).resolves.toStrictEqual({
        ids: [MODEL.id],
      });

      expect(calls.map(([setter]) => styleSetter(stores, setter).mock.calls)).toStrictEqual(
        calls.map(([, ...args]) => [args]),
      );
      expect(styleSetter(stores, "setMeshPointsVisibility")).not.toHaveBeenCalled();
      expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
    },
  );

  test.each(COMPONENT_CASES)(
    "$command styles every component of the target type by default",
    async ({ command, params, setter, args, type, geodeIds }) => {
      await expect(runCommand(command, { ids: [MODEL.id], ...params })).resolves.toStrictEqual({
        ids: [MODEL.id],
      });

      expect(stores.dataStore.getMeshComponentGeodeIds).toHaveBeenCalledWith(MODEL.id, type);
      expect(styleSetter(stores, setter)).toHaveBeenCalledExactlyOnceWith(
        MODEL.id,
        geodeIds,
        ...args,
      );
      expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
    },
  );

  test.each(COMPONENT_CASES.filter(({ target }) => target === "surfaces"))(
    "$command styles only the given components",
    async ({ command, params, setter, args }) => {
      await runCommand(command, { ids: [MODEL.id], componentIds: ["s2"], ...params });

      expect(styleSetter(stores, setter)).toHaveBeenCalledExactlyOnceWith(
        MODEL.id,
        ["s2"],
        ...args,
      );
    },
  );

  test("rejects component ids the target does not have", async () => {
    await expect(
      runCommand("style/model/surfaces/visibility", {
        ids: [MODEL.id],
        componentIds: ["s2", "b1"],
        visibility: false,
      }),
    ).rejects.toThrow(
      `"brep" has no surfaces with geode id b1; read vease://data/${MODEL.id} for its components`,
    );
    expect(styleSetter(stores, "setModelSurfacesVisibility")).not.toHaveBeenCalled();
    expect(stores.hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });

  test("rejects a model without component of the target type", async () => {
    answerComponents(stores, { Surface: ["s1"] });

    await expect(
      runCommand("style/model/blocks/visibility", { ids: [MODEL.id], visibility: true }),
    ).rejects.toThrow('"brep" has no blocks');
  });

  test("rejects componentIds with several ids", async () => {
    await expect(
      runCommand("style/model/surfaces/color", {
        ids: [MODEL.id, MESH.id],
        componentIds: ["s1"],
        color: ORANGE_HEX,
      }),
    ).rejects.toThrow("componentIds belong to one model: give a single id with them");
    expect(styleSetter(stores, "setModelSurfacesColor")).not.toHaveBeenCalled();
  });

  test.each(ALL_CASES)("$command rejects a mesh", async ({ command, params }) => {
    await expect(runCommand(command, { ids: [MESH.id], ...params })).rejects.toThrow(
      '"surface" is a mesh; use the style/mesh routes',
    );
    expect(setDataVisibility).not.toHaveBeenCalled();
  });
});
