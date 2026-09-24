import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import BatchActionBanner from "@vease/components/datamanager/BatchActionBanner.vue";
import type { DataItem } from "@vease/types/data_item";
import { mount } from "@vue/test-utils";

const FIRST_EVENT_INDEX = 0;
const EXPECTED_EVENT_COUNT = 1;

const mockItem1: DataItem = {
  id: "item-1",
  name: "Item 1",
  geode_object_type: "BRep",
  visible: true,
  created_at: "2026-01-01T00:00:00.000Z",
};

const mockItem2: DataItem = {
  id: "item-2",
  name: "Item 2",
  geode_object_type: "TriangulatedSurface3D",
  visible: false,
  created_at: "2026-01-02T00:00:00.000Z",
};

describe("batch action banner component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("does not render banner when selectedIds is empty", () => {
    const wrapper = mount(BatchActionBanner, {
      props: {
        selectedIds: [],
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find(".banner-container").exists()).toBe(false);
  });

  test("displays singular item text when one item is selected", () => {
    const wrapper = mount(BatchActionBanner, {
      props: {
        selectedIds: [mockItem1],
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain("1 item selected");
  });

  test("displays plural items text when multiple items are selected", () => {
    const wrapper = mount(BatchActionBanner, {
      props: {
        selectedIds: [mockItem1, mockItem2],
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain("2 items selected");
  });

  test("emits toggle-visibility-selected event on visibility button click", async () => {
    const wrapper = mount(BatchActionBanner, {
      props: {
        selectedIds: [mockItem1],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const button = wrapper.find('[data-testid="batchVisibilityButton"]');
    await button.trigger("click");

    const emitted = wrapper.emitted("toggle-visibility-selected");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([]);
  });

  test("emits delete event on delete button click", async () => {
    const wrapper = mount(BatchActionBanner, {
      props: {
        selectedIds: [mockItem1],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const button = wrapper.find('[data-testid="batchDeleteButton"]');
    await button.trigger("click");

    const emitted = wrapper.emitted("delete");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([]);
  });

  test("emits clear event on close button click", async () => {
    const wrapper = mount(BatchActionBanner, {
      props: {
        selectedIds: [mockItem1],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const closeButton = wrapper.find(".v-btn--icon");
    await closeButton.trigger("click");

    const emitted = wrapper.emitted("clear");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([]);
  });
});
