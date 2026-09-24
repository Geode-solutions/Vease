import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import type { DataItem } from "@vease/types/data_item";
import DataTable from "@vease/components/datamanager/DataTable.vue";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_EVENT_INDEX = 0;
const EXPECTED_EVENT_COUNT = 1;

const mockItem1: DataItem = {
  id: "item-1",
  name: "Mesh Model",
  geode_object_type: "BRep",
  visible: true,
  created_at: "2026-01-01T00:00:00.000Z",
};

const mockItem2: DataItem = {
  id: "item-2",
  name: "Surface Data",
  geode_object_type: "TriangulatedSurface3D",
  visible: false,
  created_at: "2026-01-02T00:00:00.000Z",
};

describe("data table component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders items in data table", () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1, mockItem2],
      },
    });

    expect(wrapper.text()).toContain("Mesh Model");
    expect(wrapper.text()).toContain("Surface Data");
    expect(wrapper.text()).toContain("BRep");
    expect(wrapper.text()).toContain("TriangulatedSurface3D");
  });

  test("renders empty state message when no items provided", () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [],
      },
    });

    expect(wrapper.text()).toContain("No data available");
  });

  test("emits toggle-visibility event on item visibility button click", async () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
      },
    });

    const visibilityButton = wrapper.find('[data-testid="dataVisibilityButton"]');
    await visibilityButton.trigger("click");

    const emitted = wrapper.emitted("toggle-visibility");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([mockItem1]);
  });

  test("emits focus-camera event on focus camera button click", async () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
      },
    });

    const focusButton = wrapper.find('[data-testid="focusDataButton"]');
    await focusButton.trigger("click");

    const emitted = wrapper.emitted("focus-camera");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([mockItem1]);
  });

  test("emits isolate event on isolate item button click", async () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
      },
    });

    const isolateButton = wrapper.find('[data-testid="isolateDataButton"]');
    await isolateButton.trigger("click");

    const emitted = wrapper.emitted("isolate");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([mockItem1]);
  });

  test("emits rename event on rename button click and double click on name", async () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
      },
    });

    const renameButton = wrapper.find('[data-testid="renameDataButton"]');
    await renameButton.trigger("click");

    const emitted = wrapper.emitted("rename");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([mockItem1]);
  });

  test("emits delete event on row delete button click", async () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
      },
    });

    const deleteButton = wrapper.find('[data-testid="deleteDataButton"]');
    await deleteButton.trigger("click");

    const emitted = wrapper.emitted("delete");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([mockItem1]);
  });

  test("emits toggle-visibility-selected on header visibility button click", async () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
      },
    });

    const headerVisibilityButton = wrapper.find('[data-testid="toggleVisibilityHeaderButton"]');
    await headerVisibilityButton.trigger("click");

    const emitted = wrapper.emitted("toggle-visibility-selected");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([]);
  });

  test("emits delete-selected on header delete all button click when items are selected", async () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
        selectedIds: [mockItem1],
      },
    });

    const deleteAllButton = wrapper.find('[data-testid="deleteAllSelectedButton"]');
    await deleteAllButton.trigger("click");

    const emitted = wrapper.emitted("delete-selected");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([]);
  });
});
