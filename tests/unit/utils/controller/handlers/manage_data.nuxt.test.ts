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

const OTHER_ID = "mesh-2";
const ONCE = 1;

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
      manageData({ action: "rename", ids: [ITEM.id], name: "renamed" }),
    ).resolves.toStrictEqual({ action: "rename", ids: [ITEM.id], name: "renamed" });
    expect(renameData).toHaveBeenCalledWith(ITEM.id, "renamed");
    expect(hybridViewerStore.remoteRender).not.toHaveBeenCalled();
  });

  test("rename needs a name", async () => {
    await expect(manageData({ action: "rename", ids: [ITEM.id] })).rejects.toThrow(/name/u);
    expect(renameData).not.toHaveBeenCalled();
  });

  test("rename needs exactly one id", async () => {
    await expect(
      manageData({ action: "rename", ids: [ITEM.id, OTHER_ID], name: "renamed" }),
    ).rejects.toThrow("rename needs exactly one id");
    expect(renameData).not.toHaveBeenCalled();
  });

  test("deletes every listed data and renders once", async () => {
    await expect(manageData({ action: "delete", ids: [ITEM.id, OTHER_ID] })).resolves.toStrictEqual(
      { action: "delete", ids: [ITEM.id, OTHER_ID] },
    );
    expect(deleteData).toHaveBeenCalledWith(ITEM.id);
    expect(deleteData).toHaveBeenCalledWith(OTHER_ID);
    expect(hybridViewerStore.remoteRender).toHaveBeenCalledTimes(ONCE);
  });

  test("reports the unknown ids and deletes the others", async () => {
    dataStore.item
      .mockResolvedValueOnce(ITEM)
      .mockRejectedValueOnce(new Error("Item not found: nope"));

    await expect(manageData({ action: "delete", ids: [ITEM.id, "nope"] })).resolves.toStrictEqual({
      action: "delete",
      ids: [ITEM.id],
      failed: [
        { id: "nope", error: 'No data with id "nope"; read vease://data for the loaded data' },
      ],
    });
    expect(deleteData).toHaveBeenCalledTimes(ONCE);
  });

  test("rejects an unknown id", async () => {
    dataStore.item.mockRejectedValue(new Error("Item not found: nope"));

    await expect(manageData({ action: "delete", ids: ["nope"] })).rejects.toThrow(
      'No data with id "nope"',
    );
    expect(deleteData).not.toHaveBeenCalled();
  });

  test("delete needs ids", async () => {
    await expect(manageData({ action: "delete" })).rejects.toThrow("delete needs ids");
  });

  test("rejects create options on another action", async () => {
    await expect(manageData({ action: "delete", ids: [ITEM.id], kind: "point" })).rejects.toThrow(
      "kind cannot be given to delete",
    );
    expect(deleteData).not.toHaveBeenCalled();
  });

  test("create needs kind, name and points", async () => {
    await expect(manageData({ action: "create", name: "p" })).rejects.toThrow(
      "create needs kind, name and points",
    );
  });

  test("create takes no ids", async () => {
    await expect(
      manageData({
        action: "create",
        ids: [ITEM.id],
        kind: "point",
        name: "p",
        points: [[0, 0, 0]],
      }),
    ).rejects.toThrow("ids cannot be given to create");
  });
});
