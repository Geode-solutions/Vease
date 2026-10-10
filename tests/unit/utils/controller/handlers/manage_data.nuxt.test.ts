import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { deleteData, renameData } from "@vease/utils/data_actions";
import { controllerHandlers } from "@vease/utils/controller/index";
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
  renameData: vi.fn<typeof renameData>(),
}));

const ITEM: DataItem = {
  id: "mesh-1",
  geode_id: "geode-1",
  name: "surface",
  viewer_type: "mesh",
  geode_object_type: "PolygonalSurface3D",
  visible: true,
  created_at: "2026-10-08",
};

const dataStore = { item: vi.fn<(id: string) => Promise<DataItem>>() };
const hybridViewerStore = { remoteRender: vi.fn<() => Promise<void>>() };

async function manageData(params: Record<string, unknown>): Promise<unknown> {
  const result = await controllerHandlers["manage-data"]?.(params);
  return result;
}

describe("the manage-data controller handler", () => {
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

  test("renames", async () => {
    await expect(
      manageData({ action: "rename", id: ITEM.id, name: "renamed" }),
    ).resolves.toStrictEqual({ id: ITEM.id, action: "rename" });
    expect(renameData).toHaveBeenCalledWith(ITEM.id, "renamed");
  });

  test("rename needs a name", async () => {
    await expect(manageData({ action: "rename", id: ITEM.id })).rejects.toThrow(/name/u);
    expect(renameData).not.toHaveBeenCalled();
  });

  test("deletes and renders", async () => {
    await expect(manageData({ action: "delete", id: ITEM.id })).resolves.toStrictEqual({
      id: ITEM.id,
      action: "delete",
    });
    expect(deleteData).toHaveBeenCalledWith(ITEM.id);
    expect(hybridViewerStore.remoteRender).toHaveBeenCalledWith();
  });

  test("rejects an unknown id", async () => {
    dataStore.item.mockRejectedValue(new Error("Item not found: nope"));

    await expect(manageData({ action: "delete", id: "nope" })).rejects.toThrow(
      'No data with id "nope"',
    );
    expect(deleteData).not.toHaveBeenCalled();
  });
});
