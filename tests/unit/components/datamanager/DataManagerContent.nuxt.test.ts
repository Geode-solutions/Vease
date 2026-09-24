import { beforeEach, describe, expect, test, vi } from "vitest";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import type { DataItem } from "@vease/types/data_item";
import DataManagerContent from "@vease/components/datamanager/DataManagerContent.vue";
import { flushPromises } from "@vue/test-utils";
import { useDataStore } from "@ogw_front/stores/data";
import { useTreeviewStore } from "@ogw_front/stores/treeview";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/components/datamanager/DataManagerHeader.vue"), () => ({
  default: {
    name: "DataManagerHeader",
    props: ["searchValue", "activeTab", "tabs", "compact"],
    emits: ["update:searchValue", "update:activeTab"],
    template: "<div class='data-manager-header-stub'></div>",
  },
}));

vi.mock(import("@vease/components/datamanager/DataTable.vue"), () => ({
  default: {
    name: "DataTable",
    props: ["items", "search", "compact", "selectedIds"],
    emits: [
      "update:selectedIds",
      "toggle-visibility",
      "toggle-visibility-selected",
      "focus-camera",
      "isolate",
      "rename",
      "delete",
      "delete-selected",
    ],
    template: "<div class='data-table-stub'></div>",
  },
}));

vi.mock(import("@ogw_front/components/DeleteDialog.vue"), () => ({
  default: {
    name: "DeleteDialog",
    props: ["show", "item", "selectedCount"],
    emits: ["update:show", "confirm"],
    template: "<div class='delete-dialog-stub'></div>",
  },
}));

vi.mock(import("@vease/components/datamanager/RenameDialog.vue"), () => ({
  default: {
    name: "RenameDialog",
    props: ["show", "item", "initialName"],
    emits: ["update:show", "confirm"],
    template: "<div class='rename-dialog-stub'></div>",
  },
}));

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

const mockItem1: DataItem = {
  id: "item-1",
  name: "Item 1",
  geode_object_type: "BRep",
  visible: true,
  created_at: "2026-01-01T00:00:00.000Z",
  viewer_type: "3D",
};

const mockItem2: DataItem = {
  id: "item-2",
  name: "Item 2",
  geode_object_type: "TriangulatedSurface3D",
  visible: false,
  created_at: "2026-01-02T00:00:00.000Z",
  viewer_type: "3D",
};

describe("data manager content component", () => {
  const mockUpdateItem = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockDeregisterObject = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockDeleteItem = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockSetVisibility = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockAddItem = vi.fn<(type: string, name: string, id: string, viewerType: string) => void>();
  const mockRemoveItem = vi.fn<(id: string) => void>();
  const mockRenameItem = vi.fn<(id: string, name: string) => void>();
  const mockFocusCameraOnObject = vi.fn<(id: string) => void>();
  const mockRemoveViewerItem = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

  beforeEach(() => {
    setupActivePinia();

    const itemsRef = ref([mockItem1, mockItem2]);
    vi.mocked(useDataStore).mockReturnValue({
      refAllItems: () => itemsRef,
      updateItem: mockUpdateItem,
      deregisterObject: mockDeregisterObject,
      deleteItem: mockDeleteItem,
    } as unknown as ReturnType<typeof useDataStore>);

    vi.mocked(useTreeviewStore).mockReturnValue({
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      renameItem: mockRenameItem,
    } as unknown as ReturnType<typeof useTreeviewStore>);

    vi.mocked(getDataStyleStore).mockReturnValue({
      setVisibility: mockSetVisibility,
    } as unknown as ReturnType<typeof getDataStyleStore>);

    vi.mocked(getHybridViewerStore).mockReturnValue({
      focusCameraOnObject: mockFocusCameraOnObject,
      removeItem: mockRemoveViewerItem,
    } as unknown as ReturnType<typeof getHybridViewerStore>);
  });

  test("renders header and data table subcomponents", () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    expect(wrapper.find(".data-manager-header-stub").exists()).toBe(true);
    expect(wrapper.find(".data-table-stub").exists()).toBe(true);
  });

  test("toggles item visibility and updates data store and treeview store", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent({ name: "DataTable" });
    await dataTable.vm.$emit("toggle-visibility", mockItem1, false);
    await flushPromises();

    expect(mockUpdateItem).toHaveBeenCalledWith("item-1", { visible: false });
    expect(mockSetVisibility).toHaveBeenCalledWith("item-1", false, mockItem1);
    expect(mockRemoveItem).toHaveBeenCalledWith("item-1");
  });

  test("focuses camera when focus-camera event is emitted", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent({ name: "DataTable" });
    await dataTable.vm.$emit("focus-camera", mockItem1);
    await flushPromises();

    expect(mockFocusCameraOnObject).toHaveBeenCalledWith("item-1");
  });

  test("isolates item by making target visible and others invisible", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent({ name: "DataTable" });
    await dataTable.vm.$emit("isolate", mockItem1);
    await flushPromises();

    expect(mockUpdateItem).toHaveBeenCalledWith("item-1", { visible: true });
    expect(mockUpdateItem).toHaveBeenCalledWith("item-2", { visible: false });
    expect(mockFocusCameraOnObject).toHaveBeenCalledWith("item-1");
  });

  test("opens rename dialog and executes rename", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent({ name: "DataTable" });
    await dataTable.vm.$emit("rename", mockItem1);

    const renameDialog = wrapper.findComponent({ name: "RenameDialog" });
    expect(renameDialog.props("show")).toBe(true);

    await renameDialog.vm.$emit("confirm", "New Name");
    await flushPromises();

    expect(mockUpdateItem).toHaveBeenCalledWith("item-1", { name: "New Name" });
    expect(mockRenameItem).toHaveBeenCalledWith("item-1", "New Name");
  });

  test("opens delete dialog and executes delete", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent({ name: "DataTable" });
    await dataTable.vm.$emit("delete", mockItem1);

    const [singleDeleteDialog] = wrapper.findAllComponents({ name: "DeleteDialog" });
    expect(singleDeleteDialog.props("show")).toBe(true);

    await singleDeleteDialog.vm.$emit("confirm");
    await flushPromises();

    expect(mockDeregisterObject).toHaveBeenCalledWith("item-1");
    expect(mockDeleteItem).toHaveBeenCalledWith("item-1");
    expect(mockRemoveViewerItem).toHaveBeenCalledWith("item-1");
    expect(mockRemoveItem).toHaveBeenCalledWith("item-1");
  });
});
