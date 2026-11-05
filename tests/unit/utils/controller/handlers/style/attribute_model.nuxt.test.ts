import {
  DEPTH,
  DEPTH_MAX,
  MESH,
  MODEL,
  ONCE,
  PRESSURE,
  TIME_STEP,
  TIME_STEP_INDEX,
  answerAttributes,
  answerComponents,
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
import { ATTRIBUTE_STYLE_COMMANDS } from "@vease/utils/controller/handlers/style/attribute";
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

const BLOCK_COMMAND = "style/model/blocks/polyhedron/attribute";
const MESH_ROUTES = [
  "mesh/points/vertex",
  "mesh/edges/edge",
  "mesh/edges/vertex",
  "mesh/cells/cell",
  "mesh/cells/vertex",
  "mesh/polygons/polygon",
  "mesh/polygons/vertex",
  "mesh/polyhedra/polyhedron",
  "mesh/polyhedra/vertex",
];

const COMPONENTS = [
  { target: "corners", name: "Corners", type: "Corner", kinds: ["vertex"], geodeIds: ["c1"] },
  { target: "lines", name: "Lines", type: "Line", kinds: ["edge", "vertex"], geodeIds: ["l1"] },
  {
    target: "surfaces",
    name: "Surfaces",
    type: "Surface",
    kinds: ["polygon", "vertex"],
    geodeIds: ["s1", "s2"],
  },
  {
    target: "blocks",
    name: "Blocks",
    type: "Block",
    kinds: ["polyhedron", "vertex"],
    geodeIds: ["b1", "b2"],
  },
];

const SCHEMA_IDS: Record<string, string> = {
  vertex: backSchemas.model_component_vertex_attribute_names.$id,
  edge: backSchemas.model_component_edge_attribute_names.$id,
  polygon: backSchemas.model_component_polygon_attribute_names.$id,
  polyhedron: backSchemas.model_component_polyhedron_attribute_names.$id,
};

const MODEL_CASES = COMPONENTS.flatMap(({ target, name, kinds, geodeIds }) =>
  kinds.map((kind) => ({
    command: `style/model/${target}/${kind}/attribute`,
    schemaId: SCHEMA_IDS[kind] ?? "",
    setter: `setModel${name}${kind.charAt(0).toUpperCase()}${kind.slice(1)}Attribute`,
    activate: `setModel${name}ActiveColoring`,
    target,
    kind,
    geodeIds,
  })),
);

describe("the style/model attribute controller commands", () => {
  const stores = createStores();

  function setter(name: string): ReturnType<typeof styleSetter> {
    return styleSetter(stores, name);
  }

  beforeEach(() => {
    vi.clearAllMocks();
    setupStores(stores);
    answerComponents(
      stores,
      Object.fromEntries(COMPONENTS.map(({ type, geodeIds }) => [type, geodeIds])),
    );
    answerAttributes(stores, {
      [backSchemas.model_component_polyhedron_attribute_names.$id]: [DEPTH, PRESSURE],
    });
  });

  test("has one command per mesh element or model component, and location", () => {
    expect(Object.keys(ATTRIBUTE_STYLE_COMMANDS).toSorted()).toStrictEqual(
      [
        ...MESH_ROUTES.map((route) => `style/${route}/attribute`),
        ...MODEL_CASES.map(({ command }) => command),
      ].toSorted(),
    );
  });

  test.each(MODEL_CASES)(
    "$command colors every $target by its $kind attribute",
    async ({ command, schemaId, setter: attributeSetter, activate, target, kind, geodeIds }) => {
      answerAttributes(stores, { [schemaId]: [DEPTH] });

      await expect(colorOne(command, { id: MODEL.id, name: "depth" })).resolves.toStrictEqual({
        id: MODEL.id,
        target,
        location: kind,
        attribute: "depth",
        item: 0,
        colormap: "batlow",
        minimum: 0,
        maximum: DEPTH_MAX,
      });
      expect(setter(attributeSetter)).toHaveBeenCalledExactlyOnceWith(MODEL.id, geodeIds, {
        name: "depth",
        item: 0,
        minimum: 0,
        maximum: DEPTH_MAX,
        colorMap: "batlow",
      });
      expect(setter(activate)).toHaveBeenCalledExactlyOnceWith(MODEL.id, geodeIds, kind);
      expect(setter(activate)).toHaveBeenCalledAfter(setter(attributeSetter));
      expect(stores.hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
    },
  );

  test("rejects a mesh", async () => {
    await expect(colorOne(BLOCK_COMMAND, { id: MESH.id, name: "depth" })).rejects.toThrow(
      '"surface" is a mesh; use the style/mesh routes',
    );
    expect(stores.request).not.toHaveBeenCalled();
  });

  test("applies a time step on the given components", async () => {
    await colorOne(BLOCK_COMMAND, {
      id: MODEL.id,
      componentIds: ["b2"],
      name: "pressure",
      timeStep: TIME_STEP,
    });

    expect(setter("setModelBlocksPolyhedronAttribute")).toHaveBeenCalledWith(
      MODEL.id,
      ["b2"],
      expect.objectContaining({ name: "pressure" }),
    );
    expect(setter("setModelBlocksPolyhedronAttributeTimeStep")).toHaveBeenCalledWith(
      MODEL.id,
      ["b2"],
      TIME_STEP_INDEX,
    );
    expect(setter("setModelBlocksActiveColoring")).toHaveBeenCalledWith(
      MODEL.id,
      ["b2"],
      "polyhedron",
    );
  });

  test("lists the attributes of the components when not found", async () => {
    await expect(colorOne(BLOCK_COMMAND, { id: MODEL.id, name: "missing" })).rejects.toThrow(
      'Attribute "missing" not found on "brep". Available: blocks/polyhedron: depth, pressure',
    );
  });

  test("rejects component ids the target does not have", async () => {
    await expect(
      colorOne(BLOCK_COMMAND, { id: MODEL.id, componentIds: ["s1"], name: "depth" }),
    ).rejects.toThrow(`"brep" has no blocks with geode id s1`);
    expect(setter("setModelBlocksPolyhedronAttribute")).not.toHaveBeenCalled();
  });

  test("rejects componentIds with several ids before styling any", async () => {
    await expect(
      runCommand(BLOCK_COMMAND, {
        ids: [MODEL.id, MESH.id],
        componentIds: ["b1"],
        name: "depth",
      }),
    ).rejects.toThrow("componentIds belong to one model: give a single id with them");
    expect(stores.request).not.toHaveBeenCalled();
    expect(setter("setModelBlocksPolyhedronAttribute")).not.toHaveBeenCalled();
    expect(stores.hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });
});
