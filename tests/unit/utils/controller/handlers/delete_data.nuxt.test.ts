import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { controllerHandlers } from "@vease/utils/controller/index";
import { deleteData } from "@vease/utils/data_actions";
import { getHybridViewerStore } from "@vease/utils/external_stores";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

vi.mock(import("@vease/utils/data_actions"), () => ({
  deleteData: vi.fn<typeof deleteData>(),
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

const OTHER_ID = "mesh-2";
const ONCE = 1;

const dataStore = { item: vi.fn<(id: string) => Promise<DataItem>>() };
const hybridViewerStore = { remoteRender: vi.fn<() => Promise<void>>() };

async function remove(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["delete-data"]?.(params);
  return result;
}

describe("the delete-data controller handler", () => {
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

  test("deletes every listed data and renders once", async () => {
    await expect(remove({ ids: [ITEM.data_id, OTHER_ID] })).resolves.toStrictEqual({
      ids: [ITEM.data_id, OTHER_ID],
    });
    expect(deleteData).toHaveBeenCalledWith(ITEM.data_id);
    expect(deleteData).toHaveBeenCalledWith(OTHER_ID);
    expect(hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test("reports the unknown ids and deletes the others", async () => {
    dataStore.item
      .mockResolvedValueOnce(ITEM)
      .mockRejectedValueOnce(new Error("Item not found: nope"));

    await expect(remove({ ids: [ITEM.data_id, "nope"] })).resolves.toStrictEqual({
      ids: [ITEM.data_id],
      failed: [
        { id: "nope", error: 'No data with id "nope"; read vease://data for the loaded data' },
      ],
    });
    expect(deleteData).toHaveBeenCalledTimes(ONCE);
  });

  test("rejects an unknown id", async () => {
    dataStore.item.mockRejectedValue(new Error("Item not found: nope"));

    await expect(remove({ ids: ["nope"] })).rejects.toThrow('No data with id "nope"');
    expect(deleteData).not.toHaveBeenCalled();
  });
});
