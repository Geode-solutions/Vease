import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { deleteData, renameData, setDataVisibility } from "@vease/utils/data_actions";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { useTreeviewStore } from "@ogw_front/stores/treeview";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@ogw_front/stores/treeview"), () => ({
  useTreeviewStore: vi.fn<typeof useTreeviewStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getDataStyleStore: vi.fn<typeof getDataStyleStore>(),
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

const ID = "data-1";
const ITEM: DataItem = {
  id: ID,
  geode_id: "geode-1",
  name: "surface",
  viewer_type: "mesh",
  geode_object_type: "PolygonalSurface3D",
  visible: true,
  created_at: "2026-10-09",
};
const calls: string[] = [];

const dataStore = {
  deregisterObject: vi.fn<(id: string) => Promise<void>>(),
  deleteItem: vi.fn<(id: string) => Promise<void>>(),
  updateItem: vi.fn<(id: string, changes: unknown) => Promise<void>>(),
  item: vi.fn<(id: string) => Promise<DataItem>>(),
};
const hybridViewerStore = { removeItem: vi.fn<(id: string) => void>() };
const dataStyleStore = { setVisibility: vi.fn<(id: string, visible: boolean) => Promise<void>>() };
const treeviewStore = {
  addItem: vi.fn<(...args: string[]) => void>(),
  removeItem: vi.fn<(id: string) => void>(),
  closeView: vi.fn<(id: string) => void>(),
  renameItem: vi.fn<(id: string, name: string) => void>(),
};

describe("data actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calls.length = 0;
    dataStore.deregisterObject.mockImplementation(async () => {
      calls.push("deregisterObject");
      await Promise.resolve();
    });
    dataStore.deleteItem.mockImplementation(async () => {
      calls.push("deleteItem");
      await Promise.resolve();
    });
    dataStore.updateItem.mockImplementation(async () => {
      calls.push("updateItem");
      await Promise.resolve();
    });
    hybridViewerStore.removeItem.mockImplementation(() => {
      calls.push("hybridViewer.removeItem");
    });
    treeviewStore.removeItem.mockImplementation(() => {
      calls.push("treeview.removeItem");
    });
    treeviewStore.closeView.mockImplementation(() => {
      calls.push("treeview.closeView");
    });
    treeviewStore.renameItem.mockImplementation(() => {
      calls.push("treeview.renameItem");
    });
    treeviewStore.addItem.mockImplementation(() => {
      calls.push("treeview.addItem");
    });
    dataStyleStore.setVisibility.mockImplementation(async () => {
      calls.push("dataStyle.setVisibility");
      await Promise.resolve();
    });
    dataStore.item.mockResolvedValue(ITEM);
    /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
    vi.mocked(useDataStore).mockReturnValue(
      dataStore as unknown as ReturnType<typeof useDataStore>,
    );
    vi.mocked(useTreeviewStore).mockReturnValue(
      treeviewStore as unknown as ReturnType<typeof useTreeviewStore>,
    );
    vi.mocked(getHybridViewerStore).mockReturnValue(
      hybridViewerStore as unknown as ReturnType<typeof getHybridViewerStore>,
    );
    vi.mocked(getDataStyleStore).mockReturnValue(
      dataStyleStore as unknown as ReturnType<typeof getDataStyleStore>,
    );
    /* oxlint-enable no-unsafe-type-assertion */
  });

  test("deletes in the data manager order", async () => {
    await deleteData(ID);

    expect(calls).toStrictEqual([
      "deregisterObject",
      "deleteItem",
      "hybridViewer.removeItem",
      "treeview.removeItem",
      "treeview.closeView",
    ]);
    expect(dataStore.deleteItem).toHaveBeenCalledWith(ID);
  });

  test("renames in the store and the tree", async () => {
    await renameData(ID, "renamed");

    expect(dataStore.updateItem).toHaveBeenCalledWith(ID, { name: "renamed" });
    expect(treeviewStore.renameItem).toHaveBeenCalledWith(ID, "renamed");
    expect(calls).toStrictEqual(["updateItem", "treeview.renameItem"]);
  });

  test("hiding updates the flag, the style and removes the data from the tree", async () => {
    await setDataVisibility(ID, false);

    expect(dataStyleStore.setVisibility).toHaveBeenCalledWith(ID, false);
    expect(dataStore.updateItem).toHaveBeenCalledWith(ID, { visible: false });
    expect(treeviewStore.removeItem).toHaveBeenCalledWith(ID);
    expect(treeviewStore.addItem).not.toHaveBeenCalled();
  });

  test("showing hidden data adds it back to the tree", async () => {
    dataStore.item.mockResolvedValue({ ...ITEM, visible: false });

    await setDataVisibility(ID, true);

    expect(dataStyleStore.setVisibility).toHaveBeenCalledWith(ID, true);
    expect(dataStore.updateItem).toHaveBeenCalledWith(ID, { visible: true });
    expect(treeviewStore.addItem).toHaveBeenCalledWith(
      ITEM.geode_object_type,
      ITEM.name,
      ID,
      ITEM.geode_id,
      ITEM.viewer_type,
    );
  });

  test("showing visible data only reapplies the style, without adding it twice to the tree", async () => {
    await setDataVisibility(ID, true);

    expect(calls).toStrictEqual(["dataStyle.setVisibility"]);
  });
});
