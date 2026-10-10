import { beforeEach, describe, expect, test, vi } from "vitest";
import { getBackStore, getHybridViewerStore } from "@vease/utils/external_stores";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { controllerHandlers } from "@vease/utils/controller/index";
import { importItem } from "@ogw_front/utils/import_workflow";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/external_stores"), () => ({
  getBackStore: vi.fn<typeof getBackStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importItem: vi.fn<typeof importItem>(),
}));

const created = back_schemas.opengeodeweb_back.create;
const ITEM = { id: "new-1", name: "created", geode_id: "g", geode_object_type: "EdgedCurve3D" };
const SQUARE: [number, number, number][] = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
];
const XYZ_SQUARE = SQUARE.map(([x, y, z]) => ({ x, y, z }));

const backStore = { request: vi.fn<(options: unknown) => Promise<unknown>>() };
const hybridViewerStore = { remoteRender: vi.fn<() => Promise<void>>() };

async function createData(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["create-data"]?.(params);
  return result;
}

describe("the create-data controller handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
    vi.mocked(getBackStore).mockReturnValue(
      backStore as unknown as ReturnType<typeof getBackStore>,
    );
    vi.mocked(getHybridViewerStore).mockReturnValue(
      hybridViewerStore as unknown as ReturnType<typeof getHybridViewerStore>,
    );
    /* oxlint-enable no-unsafe-type-assertion */
    backStore.request.mockResolvedValue(ITEM);
  });

  test("creates a closed curve with a closing edge", async () => {
    await createData({ kind: "curve", name: "loop", points: SQUARE, closed: true });

    expect(backStore.request).toHaveBeenCalledWith({
      schema: created.edged_curve,
      params: {
        name: "loop",
        points: XYZ_SQUARE,
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
        ],
      },
    });
  });

  test("creates an open curve without a closing edge", async () => {
    await createData({ kind: "curve", name: "line", points: SQUARE.slice(0, 3) });

    expect(backStore.request).toHaveBeenCalledWith({
      schema: created.edged_curve,
      params: {
        name: "line",
        points: XYZ_SQUARE.slice(0, 3),
        edges: [
          [0, 1],
          [1, 2],
        ],
      },
    });
  });

  test("creates a surface with one polygon", async () => {
    await createData({ kind: "surface", name: "quad", points: SQUARE });

    expect(backStore.request).toHaveBeenCalledWith({
      schema: created.polygonal_surface,
      params: { name: "quad", points: XYZ_SQUARE, polygons: [[0, 1, 2, 3]] },
    });
  });

  test("creates a point", async () => {
    await createData({ kind: "point", name: "p", points: [[1, 2, 3]] });

    expect(backStore.request).toHaveBeenCalledWith({
      schema: created.point_set,
      params: { name: "p", points: [{ x: 1, y: 2, z: 3 }] },
    });
  });

  test("rejects a surface with 2 points", async () => {
    await expect(
      createData({ kind: "surface", name: "bad", points: SQUARE.slice(0, 2) }),
    ).rejects.toThrow(/at least 3 points/u);
    expect(backStore.request).not.toHaveBeenCalled();
  });

  test("rejects a curve with 1 point", async () => {
    await expect(
      createData({ kind: "curve", name: "bad", points: SQUARE.slice(0, 1) }),
    ).rejects.toThrow(/at least 2 points/u);
  });

  test("imports the created item", async () => {
    await expect(
      createData({ kind: "curve", name: "loop", points: SQUARE }),
    ).resolves.toStrictEqual({ id: ITEM.id, name: ITEM.name });
    expect(importItem).toHaveBeenCalledWith(ITEM);
    expect(hybridViewerStore.remoteRender).toHaveBeenCalledWith();
  });
});
