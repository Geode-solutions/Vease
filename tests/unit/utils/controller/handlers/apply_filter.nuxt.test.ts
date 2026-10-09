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
  created_at: "2026-10-09",
};

const VERTEX_SCHEMA_ID = backSchemas.vertex_attribute_names.$id;
const OTHER: DataItem = { ...MESH, id: "mesh-2", name: "other" };

const DEPTH_MAX = 10;
const CUSTOM_MIN = 2;
const CUSTOM_MAX = 4;
const EXPLODE_FACTOR = 0.5;
const DEFAULT_EXPLODE_FACTOR = 0.2;
const SHRINK_FACTOR = 0.6;
const MIDDLE_TIME = 0.5;
const DEFAULT_SHRINK_FACTOR = 0.8;
const MAX_I = 4;
const MAX_J = 5;
const MAX_K = 6;
const MAX_INDICES: [number, number, number] = [MAX_I, MAX_J, MAX_K];
const DEPTH = { attribute_name: "depth", nb_items: 1, min_value: 0, max_value: DEPTH_MAX };
const PRESSURE = {
  attribute_name: "pressure",
  nb_items: 1,
  min_value: 0,
  max_value: 1,
  time_steps: [0, MIDDLE_TIME, 1],
};
const PLANES = [{ origin: [0, 0, 0], normal: [0, 0, 1] }];

const request = vi.fn<(args: RequestArgs) => Promise<unknown>>();
const dataStore = { item: vi.fn<(id: string) => Promise<DataItem>>() };
const hybridViewerStore = {
  setShrink: vi.fn<() => Promise<void>>(),
  setExplode: vi.fn<() => Promise<void>>(),
  setSlice: vi.fn<() => Promise<[number, number, number]>>(),
  setClippingPlanes: vi.fn<() => Promise<void>>(),
  setThreshold: vi.fn<() => Promise<void>>(),
  remoteRender: vi.fn<() => Promise<void>>(),
};
const styleStore = { getStyle: vi.fn<(id: string) => Record<string, unknown>>() };

async function applyFilter(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["apply-filter"]?.(params);
  return result;
}

describe("the apply-filter controller handler", () => {
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
    dataStore.item.mockImplementation(async (id) => {
      await Promise.resolve();
      if (id === MESH.id) {
        return MESH;
      }
      if (id === OTHER.id) {
        return OTHER;
      }
      throw new Error(`Item not found: ${id}`);
    });
    styleStore.getStyle.mockReturnValue({ visibility: true, points: {}, polygons: {} });
    hybridViewerStore.setSlice.mockResolvedValue(MAX_INDICES);
    request.mockImplementation(async ({ schema }) => {
      await Promise.resolve();
      return {
        attributes: schema.$id === backSchemas.polygon_attribute_names.$id ? [DEPTH, PRESSURE] : [],
      };
    });
  });

  test("shrinks with the default factor", async () => {
    await expect(applyFilter({ filter: "shrink", ids: [MESH.id] })).resolves.toStrictEqual({
      filter: "shrink",
      ids: [MESH.id],
      factor: DEFAULT_SHRINK_FACTOR,
    });
    expect(hybridViewerStore.setShrink).toHaveBeenCalledWith([MESH.id], DEFAULT_SHRINK_FACTOR);
    expect(hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });

  test("shrinks several data with the given factor", async () => {
    await applyFilter({ filter: "shrink", ids: [MESH.id, OTHER.id], factor: SHRINK_FACTOR });

    expect(hybridViewerStore.setShrink).toHaveBeenCalledWith([MESH.id, OTHER.id], SHRINK_FACTOR);
  });

  test("removing a shrink restores factor 1", async () => {
    await applyFilter({ filter: "shrink", ids: [MESH.id], remove: true });

    expect(hybridViewerStore.setShrink).toHaveBeenCalledWith([MESH.id], 1);
  });

  test("explodes with the default factor, or restores 0 when removing", async () => {
    await applyFilter({ filter: "explode", ids: [MESH.id] });
    await applyFilter({ filter: "explode", ids: [MESH.id], remove: true });
    await applyFilter({ filter: "explode", ids: [MESH.id], factor: EXPLODE_FACTOR });

    expect(hybridViewerStore.setExplode).toHaveBeenNthCalledWith(
      1,
      [MESH.id],
      DEFAULT_EXPLODE_FACTOR,
    );
    expect(hybridViewerStore.setExplode).toHaveBeenNthCalledWith(2, [MESH.id], 0);
    expect(hybridViewerStore.setExplode).toHaveBeenNthCalledWith(3, [MESH.id], EXPLODE_FACTOR);
  });

  test("slices and reports the maximum indices", async () => {
    const slices = [{ axis: 2, index: 1 }];

    await expect(applyFilter({ filter: "slice", ids: [MESH.id], slices })).resolves.toStrictEqual({
      filter: "slice",
      ids: [MESH.id],
      maxIndices: MAX_INDICES,
    });
    expect(hybridViewerStore.setSlice).toHaveBeenCalledWith([MESH.id], slices);
  });

  test("slices need slices unless removing", async () => {
    await expect(applyFilter({ filter: "slice", ids: [MESH.id] })).rejects.toThrow(
      "slice needs slices",
    );
    expect(hybridViewerStore.setSlice).not.toHaveBeenCalled();

    await applyFilter({ filter: "slice", ids: [MESH.id], remove: true });

    expect(hybridViewerStore.setSlice).toHaveBeenCalledWith([MESH.id], []);
  });

  test("clips with planes, or clears them when removing", async () => {
    await applyFilter({ filter: "clip", ids: [MESH.id], planes: PLANES });
    await applyFilter({ filter: "clip", ids: [MESH.id], remove: true });

    expect(hybridViewerStore.setClippingPlanes).toHaveBeenNthCalledWith(1, [MESH.id], PLANES);
    expect(hybridViewerStore.setClippingPlanes).toHaveBeenNthCalledWith(2, [MESH.id], []);
    await expect(applyFilter({ filter: "clip", ids: [MESH.id] })).rejects.toThrow(
      "clip needs planes",
    );
  });

  test("thresholds with the attribute range by default", async () => {
    await expect(
      applyFilter({ filter: "threshold", ids: [MESH.id], attribute: "depth" }),
    ).resolves.toStrictEqual({
      filter: "threshold",
      ids: [MESH.id],
      attribute: "depth",
      location: "polygon",
      item: 0,
      minimum: 0,
      maximum: DEPTH_MAX,
    });
    expect(hybridViewerStore.setThreshold).toHaveBeenCalledWith([MESH.id], {
      name: "depth",
      location: "cell",
      item: 0,
      minimum: 0,
      maximum: DEPTH_MAX,
    });
  });

  test("thresholds a vertex attribute with the given range", async () => {
    request.mockResolvedValue({ attributes: [DEPTH] });

    await applyFilter({
      filter: "threshold",
      ids: [MESH.id],
      attribute: "depth",
      location: "point",
      minimum: CUSTOM_MIN,
      maximum: CUSTOM_MAX,
    });

    expect(hybridViewerStore.setThreshold).toHaveBeenCalledWith([MESH.id], {
      name: "depth",
      location: "point",
      item: 0,
      minimum: CUSTOM_MIN,
      maximum: CUSTOM_MAX,
    });
  });

  test.each(["vertex", "point"])(
    "thresholds a vertex attribute on points with location %s",
    async (location) => {
      request.mockResolvedValue({ attributes: [DEPTH] });

      await expect(
        applyFilter({ filter: "threshold", ids: [MESH.id], attribute: "depth", location }),
      ).resolves.toMatchObject({ location: "vertex" });
      expect(hybridViewerStore.setThreshold).toHaveBeenCalledWith(
        [MESH.id],
        expect.objectContaining({ location: "point" }),
      );
    },
  );

  test("thresholds a polygon attribute on cells with location polygon", async () => {
    request.mockResolvedValue({ attributes: [DEPTH] });

    await expect(
      applyFilter({ filter: "threshold", ids: [MESH.id], attribute: "depth", location: "polygon" }),
    ).resolves.toMatchObject({ location: "polygon" });
    expect(hybridViewerStore.setThreshold).toHaveBeenCalledWith(
      [MESH.id],
      expect.objectContaining({ location: "cell" }),
    );
  });

  test("a cell threshold does not match a vertex attribute", async () => {
    request.mockImplementation(async ({ schema }) => {
      await Promise.resolve();
      return { attributes: [DEPTH].filter(() => schema.$id === VERTEX_SCHEMA_ID) };
    });

    await expect(
      applyFilter({ filter: "threshold", ids: [MESH.id], attribute: "depth", location: "cell" }),
    ).rejects.toThrow('Attribute "depth" not found');
  });

  test("thresholds a time series on its first step array", async () => {
    await applyFilter({ filter: "threshold", ids: [MESH.id], attribute: "pressure" });

    expect(hybridViewerStore.setThreshold).toHaveBeenCalledWith(
      [MESH.id],
      expect.objectContaining({ name: "pressure@0" }),
    );
  });

  test("threshold needs an attribute unless removing, and removing clears it", async () => {
    await expect(applyFilter({ filter: "threshold", ids: [MESH.id] })).rejects.toThrow(
      "threshold needs attribute",
    );

    await applyFilter({ filter: "threshold", ids: [MESH.id], remove: true });

    expect(hybridViewerStore.setThreshold).toHaveBeenCalledWith([MESH.id]);
  });

  test("threshold needs both minimum and maximum, or neither", async () => {
    await expect(
      applyFilter({ filter: "threshold", ids: [MESH.id], attribute: "depth", minimum: 1 }),
    ).rejects.toThrow("Give both minimum and maximum");
  });

  test("threshold rejects a minimum greater than the maximum", async () => {
    await expect(
      applyFilter({
        filter: "threshold",
        ids: [MESH.id],
        attribute: "depth",
        minimum: CUSTOM_MAX,
        maximum: CUSTOM_MIN,
      }),
    ).rejects.toThrow(`minimum (${CUSTOM_MAX}) is greater than maximum (${CUSTOM_MIN})`);
    expect(hybridViewerStore.setThreshold).not.toHaveBeenCalled();
  });

  test("rejects an unknown id", async () => {
    await expect(applyFilter({ filter: "shrink", ids: [MESH.id, "nope"] })).rejects.toThrow(
      'No data with id "nope"',
    );
    expect(hybridViewerStore.setShrink).not.toHaveBeenCalled();
  });
});
