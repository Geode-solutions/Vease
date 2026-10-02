import { assertDefined, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import type { DataItem } from "@vease/types/data_item";
import DataManagerContent from "@vease/components/datamanager/DataManagerContent.vue";
import type DataManagerHeader from "@vease/components/datamanager/DataManagerHeader.vue";
import DataTable from "@vease/components/datamanager/DataTable.vue";
import DeleteDialog from "@ogw_front/components/DeleteDialog.vue";
import RenameDialog from "@vease/components/datamanager/RenameDialog.vue";
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
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof DataManagerHeader,
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
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof DataTable,
}));

vi.mock(import("@ogw_front/components/DeleteDialog.vue"), () => ({
  default: {
    name: "DeleteDialog",
    props: ["show", "item", "selectedCount"],
    emits: ["update:show", "confirm"],
    template: "<div class='delete-dialog-stub'></div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof DeleteDialog,
}));

vi.mock(import("@vease/components/datamanager/RenameDialog.vue"), () => ({
  default: {
    name: "RenameDialog",
    props: ["show", "item", "initialName"],
    emits: ["update:show", "confirm"],
    template: "<div class='rename-dialog-stub'></div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof RenameDialog,
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
    const mockDataStore = {
      refAllItems: (): typeof itemsRef => itemsRef,
      updateItem: mockUpdateItem,
      deregisterObject: mockDeregisterObject,
      deleteItem: mockDeleteItem,
    };
    vi.mocked(useDataStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
      mockDataStore as unknown as ReturnType<typeof useDataStore>,
    );

    const mockTreeviewStore = {
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      renameItem: mockRenameItem,
    };
    vi.mocked(useTreeviewStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
      mockTreeviewStore as unknown as ReturnType<typeof useTreeviewStore>,
    );

    vi.mocked(getDataStyleStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
      { setVisibility: mockSetVisibility } as unknown as ReturnType<typeof getDataStyleStore>,
    );

    const mockHybridViewerStore = {
      focusCameraOnObject: mockFocusCameraOnObject,
      removeItem: mockRemoveViewerItem,
    };
    vi.mocked(getHybridViewerStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the subset of the store this suite touches
      mockHybridViewerStore as unknown as ReturnType<typeof getHybridViewerStore>,
    );
  });

  test("renders header and data table subcomponents", () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    expect(wrapper.find(".data-manager-header-stub").exists()).toBe(true);
    expect(wrapper.find(".data-table-stub").exists()).toBe(true);
  });

  test("toggles item visibility and updates data store and treeview store", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent(DataTable);
    dataTable.vm.$emit("toggle-visibility", mockItem1, false);
    await flushPromises();

    expect(mockUpdateItem).toHaveBeenCalledWith("item-1", { visible: false });
    expect(mockSetVisibility).toHaveBeenCalledWith("item-1", false, mockItem1);
    expect(mockRemoveItem).toHaveBeenCalledWith("item-1");
  });

  test("focuses camera when focus-camera event is emitted", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent(DataTable);
    dataTable.vm.$emit("focus-camera", mockItem1);
    await flushPromises();

    expect(mockFocusCameraOnObject).toHaveBeenCalledWith("item-1");
  });

  test("isolates item by making target visible and others invisible", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent(DataTable);
    dataTable.vm.$emit("isolate", mockItem1);
    await flushPromises();

    expect(mockUpdateItem).toHaveBeenCalledWith("item-1", { visible: true });
    expect(mockUpdateItem).toHaveBeenCalledWith("item-2", { visible: false });
    expect(mockFocusCameraOnObject).toHaveBeenCalledWith("item-1");
  });

  test("opens rename dialog and executes rename", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent(DataTable);
    dataTable.vm.$emit("rename", mockItem1);
    await flushPromises();

    const renameDialog = wrapper.findComponent(RenameDialog);
    expect(renameDialog.props("show")).toBe(true);

    renameDialog.vm.$emit("confirm", "New Name");
    await flushPromises();

    expect(mockUpdateItem).toHaveBeenCalledWith("item-1", { name: "New Name" });
    expect(mockRenameItem).toHaveBeenCalledWith("item-1", "New Name");
  });

  test("opens delete dialog and executes delete", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent(DataTable);
    dataTable.vm.$emit("delete", mockItem1);
    await flushPromises();

    const singleDeleteDialog = assertDefined(
      wrapper.findAllComponents(DeleteDialog)[0],
      "Expected a single DeleteDialog component to be rendered",
    );
    expect(singleDeleteDialog.props("show")).toBe(true);

    singleDeleteDialog.vm.$emit("confirm");
    await flushPromises();

    expect(mockDeregisterObject).toHaveBeenCalledWith("item-1");
    expect(mockDeleteItem).toHaveBeenCalledWith("item-1");
    expect(mockRemoveViewerItem).toHaveBeenCalledWith("item-1");
    expect(mockRemoveItem).toHaveBeenCalledWith("item-1");
  });
});
