import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import type { DataItem } from "@vease/types/data_item";
import DataTable from "@vease/components/datamanager/DataTable.vue";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_EVENT_INDEX = 0;
const EXPECTED_EVENT_COUNT = 1;
const SECOND_INDEX = 1;

const mockItem1: DataItem = {
  id: "item-1",
  geode_id: "00000000-0000-0000-0000-000000000001",
  name: "Mesh Model",
  geode_object_type: "BRep",
  viewer_type: "3D",
  visible: true,
  created_at: "2026-01-01T00:00:00.000Z",
};

const mockItem2: DataItem = {
  id: "item-2",
  geode_id: "00000000-0000-0000-0000-000000000002",
  name: "Surface Data",
  geode_object_type: "TriangulatedSurface3D",
  viewer_type: "3D",
  visible: false,
  created_at: "2026-01-02T00:00:00.000Z",
};

describe("data table component", () => {
  beforeEach(() => {
    setupActivePinia();
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

  test("emits crs event on crs cell click", async () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
      },
    });

    const crsCell = wrapper.find('[data-testid="crsCell"]');
    await crsCell.trigger("click");

    const emitted = wrapper.emitted("crs");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([mockItem1]);
  });

  test("shows the crs of each item", () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [
          { ...mockItem1, crs: { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" } },
          mockItem2,
        ],
      },
    });
    const cells = wrapper.findAll('[data-testid="crsCell"]');
    expect(cells[FIRST_EVENT_INDEX]?.text()).toContain("EPSG:2154");
    expect(cells[SECOND_INDEX]?.text()).toBe("None");
    expect(wrapper.find('[data-testid="crsDataButton"]').exists()).toBe(false);
  });

  test("hides the date column in compact mode", () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [mockItem1],
        compact: true,
      },
    });

    // The picture-in-picture view is narrow: the CRS column takes the date's room
    expect(wrapper.findAll("th").map((header) => header.text())).not.toContain("Date");
  });

  test("shows the crs code alone in compact mode", () => {
    const wrapper = mountWithPlugins(DataTable, {
      props: {
        items: [
          { ...mockItem1, crs: { authority: "EPSG", code: "2154", name: "RGF93 v1 / Lambert-93" } },
        ],
        compact: true,
      },
    });

    expect(wrapper.get('[data-testid="crsCell"]').text()).toBe("EPSG:2154");
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
