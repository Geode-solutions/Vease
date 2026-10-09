import { beforeEach, describe, expect, test, vi } from "vitest";
import { deleteData, renameData } from "@vease/utils/data_actions";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { useDataStore } from "@ogw_front/stores/data";
import { useTreeviewStore } from "@ogw_front/stores/treeview";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/data"), () => ({
  useDataStore: vi.fn<typeof useDataStore>(),
}));

vi.mock(import("@ogw_front/stores/treeview"), () => ({
  useTreeviewStore: vi.fn<typeof useTreeviewStore>(),
}));

vi.mock(import("@vease/utils/external_stores"), () => ({
  getHybridViewerStore: vi.fn<typeof getHybridViewerStore>(),
}));

const ID = "data-1";
const calls: string[] = [];

const dataStore = {
  deregisterObject: vi.fn<(id: string) => Promise<void>>(),
  deleteItem: vi.fn<(id: string) => Promise<void>>(),
  updateItem: vi.fn<(id: string, changes: unknown) => Promise<void>>(),
};
const hybridViewerStore = { removeItem: vi.fn<(id: string) => void>() };
const treeviewStore = {
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
});
