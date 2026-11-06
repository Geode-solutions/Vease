import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { controllerHandlers } from "@vease/utils/controller/index";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { renameData } from "@vease/utils/data_actions";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@vease/utils/data_actions"), () => ({
  renameData: vi.fn<typeof renameData>(),
}));

const ITEM: DataItem = {
  data_id: "mesh-1",
  geode_id: "geode-1",
  name: "surface",
  viewer_type: "mesh",
  geode_object_type: "PolygonalSurface3D",
  visible: true,
  created_at: "2026-10-08",
};

const dataStore = { item: vi.fn<(id: string) => Promise<DataItem>>() };
const hybridViewerStore = { remoteRender: vi.fn<() => Promise<void>>() };

async function rename(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["rename-data"]?.(params);
  return result;
}

describe("the rename-data controller handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
    vi.mocked(getHybridViewerStore).mockReturnValue(
      hybridViewerStore as unknown as ReturnType<typeof getHybridViewerStore>,
    );
    vi.mocked(useDataStore).mockReturnValue(
      dataStore as unknown as ReturnType<typeof useDataStore>,
    );
    /* oxlint-enable no-unsafe-type-assertion */
    dataStore.item.mockResolvedValue(ITEM);
  });

  test("renames without rendering", async () => {
    await expect(rename({ id: ITEM.data_id, name: "renamed" })).resolves.toStrictEqual({
      id: ITEM.data_id,
      name: "renamed",
    });
    expect(renameData).toHaveBeenCalledWith(ITEM.data_id, "renamed");
    expect(hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });

  test("rejects an unknown id", async () => {
    dataStore.item.mockRejectedValue(new Error("Item not found: nope"));

    await expect(rename({ id: "nope", name: "renamed" })).rejects.toThrow('No data with id "nope"');
    expect(renameData).not.toHaveBeenCalled();
  });
});
