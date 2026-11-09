import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { describe, expect, test, vi } from "vitest";
import { controllerHandlers } from "@vease/utils/controller/index";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

const ITEMS: DataItem[] = [
  {
    data_id: "mesh-1",
    geode_id: "geode-1",
    name: "surface",
    viewer_type: "mesh",
    geode_object_type: "PolygonalSurface3D",
    visible: true,
    created_at: "2026-10-08",
  },
  {
    data_id: "model-1",
    geode_id: "geode-2",
    name: "brep",
    viewer_type: "model",
    geode_object_type: "BRep",
    visible: false,
    created_at: "2026-10-08",
    is_viewable: true,
  },
];

describe("the list-data controller handler", () => {
  test("returns the loaded data summary", async () => {
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking a partial store */
    vi.mocked(useDataStore).mockReturnValue({
      allItems: vi.fn<() => Promise<DataItem[]>>().mockResolvedValue(ITEMS),
    } as unknown as ReturnType<typeof useDataStore>);
    /* oxlint-enable no-unsafe-type-assertion */

    await expect(controllerHandlers["list-data"]?.({})).resolves.toStrictEqual({
      data: [
        {
          id: "mesh-1",
          name: "surface",
          geode_object_type: "PolygonalSurface3D",
          viewer_type: "mesh",
          visible: true,
        },
        {
          id: "model-1",
          name: "brep",
          geode_object_type: "BRep",
          viewer_type: "model",
          visible: false,
        },
      ],
    });
  });
});
