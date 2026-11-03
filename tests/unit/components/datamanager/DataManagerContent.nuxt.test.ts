import { type CrsItem, type DataItem, useDataStore } from "@ogw_front/stores/data";
import { assertDefined, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getDataStyleStore, getHybridViewerStore } from "@vease/utils/external_stores";
import DataManagerContent from "@vease/components/datamanager/DataManagerContent.vue";
import type DataManagerHeader from "@vease/components/datamanager/DataManagerHeader.vue";
import DataTable from "@vease/components/datamanager/DataTable.vue";
import DeleteDialog from "@ogw_front/components/DeleteDialog.vue";
import RenameDialog from "@vease/components/datamanager/RenameDialog.vue";
import { flushPromises } from "@vue/test-utils";
import { useCrsStore } from "@ogw_front/stores/crs";
import { useTreeviewStore } from "@ogw_front/stores/treeview";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/components/datamanager/DataManagerHeader.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: {
    name: "DataManagerHeader",
    props: ["searchValue", "activeTab", "tabs", "compact"],
    emits: ["update:searchValue", "update:activeTab"],
    template: "<div class='data-manager-header-stub'></div>",
  } as unknown as typeof DataManagerHeader,
}));

vi.mock(import("@vease/components/datamanager/DataTable.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
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
  } as unknown as typeof DataTable,
}));

vi.mock(import("@ogw_front/components/DeleteDialog.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: {
    name: "DeleteDialog",
    props: ["show", "item", "selectedCount"],
    emits: ["update:show", "confirm"],
    template: "<div class='delete-dialog-stub'></div>",
  } as unknown as typeof DeleteDialog,
}));

vi.mock(import("@vease/components/datamanager/RenameDialog.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  default: {
    name: "RenameDialog",
    props: ["show", "item", "initialName"],
    emits: ["update:show", "confirm"],
    template: "<div class='rename-dialog-stub'></div>",
  } as unknown as typeof RenameDialog,
}));

const mockItem1: DataItem = {
  id: "item-1",
  geode_id: "00000000-0000-0000-0000-000000000001",
  name: "Item 1",
  geode_object_type: "BRep",
  visible: true,
  created_at: "2026-01-01T00:00:00.000Z",
  viewer_type: "3D",
};

const mockItem2: DataItem = {
  id: "item-2",
  geode_id: "00000000-0000-0000-0000-000000000002",
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
  const mockCloseView = vi.fn<(id: string) => void>();
  const mockRenameItem = vi.fn<(id: string, name: string) => void>();
  const mockFocusCameraOnObject = vi.fn<(id: string) => void>();
  const mockRemoveViewerItem = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

  beforeEach(() => {
    setupActivePinia();

    const dataStore = useDataStore();
    vi.spyOn(dataStore, "refAllItems").mockReturnValue(ref<DataItem[]>([mockItem1, mockItem2]));
    // Read by the crs store (project crs, warnings)
    vi.spyOn(dataStore, "refCrsItems").mockReturnValue(ref<CrsItem[]>([mockItem1, mockItem2]));
    vi.spyOn(dataStore, "updateItem").mockImplementation(mockUpdateItem);
    vi.spyOn(dataStore, "deregisterObject").mockImplementation(mockDeregisterObject);
    vi.spyOn(dataStore, "deleteItem").mockImplementation(mockDeleteItem);

    const treeviewStore = useTreeviewStore();
    vi.spyOn(treeviewStore, "addItem").mockImplementation(mockAddItem);
    vi.spyOn(treeviewStore, "removeItem").mockImplementation(mockRemoveItem);
    vi.spyOn(treeviewStore, "renameItem").mockImplementation(mockRenameItem);
    vi.spyOn(treeviewStore, "closeView").mockImplementation(mockCloseView);

    vi.spyOn(getDataStyleStore(), "setVisibility").mockImplementation(mockSetVisibility);

    const hybridViewerStore = getHybridViewerStore();
    vi.spyOn(hybridViewerStore, "focusCameraOnObject").mockImplementation(mockFocusCameraOnObject);
    vi.spyOn(hybridViewerStore, "removeItem").mockImplementation(mockRemoveViewerItem);
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

  test("asks for a crs edit from the table", async () => {
    const wrapper = mountWithPlugins(DataManagerContent);

    const dataTable = wrapper.findComponent(DataTable);
    dataTable.vm.$emit("crs", mockItem1.id);
    await flushPromises();

    expect(useCrsStore().crsEditRequest).toBe(mockItem1.id);
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
