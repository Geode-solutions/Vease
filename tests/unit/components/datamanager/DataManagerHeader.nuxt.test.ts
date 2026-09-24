import { type DataManagerTab, useUIStore } from "@vease/stores/ui";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import DataManagerHeader from "@vease/components/datamanager/DataManagerHeader.vue";
import { mount } from "@vue/test-utils";
import { navigateTo } from "#app/composables/router";

const FIRST_EVENT_INDEX = 0;
const EXPECTED_EVENT_COUNT = 1;

vi.mock(import("#app/composables/router"), async (importOriginal) => {
  const actual = await importOriginal<typeof import("#app/composables/router")>();
  return { ...actual, navigateTo: vi.fn<typeof navigateTo>() };
});

vi.mock(import("@ogw_front/components/SearchBar.vue"), () => ({
  default: {
    name: "SearchBar",
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template:
      "<input class='search-bar-stub' :value='modelValue' @input=\"$emit('update:modelValue', $event.target.value)\" />",
  },
}));

const mockCustomTab: DataManagerTab = {
  id: "custom-tab",
  title: "Custom Tab",
  icon: "mdi-cog",
  component: { name: "CustomComponent", template: "<div>Custom</div>" },
};

describe("data manager header component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders default data tab and additional tabs", () => {
    const wrapper = mount(DataManagerHeader, {
      props: {
        activeTab: "data",
        tabs: [mockCustomTab],
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain("Data Manager");
    expect(wrapper.text()).toContain("Custom Tab");
  });

  test("emits update:activeTab when a tab is clicked", async () => {
    const wrapper = mount(DataManagerHeader, {
      props: {
        activeTab: "data",
        tabs: [mockCustomTab],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const tabs = wrapper.findAll(".v-tab");
    const customTabButton = tabs.find((tabItem) => tabItem.text().includes("Custom Tab"));
    await customTabButton?.trigger("click");

    const emitted = wrapper.emitted("update:activeTab");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual(["custom-tab"]);
  });

  test("renders picture in picture button when compact is false", () => {
    const wrapper = mount(DataManagerHeader, {
      props: {
        compact: false,
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('[data-testid="dataManagerPiPButton"]').exists()).toBe(true);
  });

  test("does not render picture in picture button when compact is true", () => {
    const wrapper = mount(DataManagerHeader, {
      props: {
        compact: true,
      },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('[data-testid="dataManagerPiPButton"]').exists()).toBe(false);
  });

  test("enters PiP and navigates to root on PiP button click", async () => {
    const wrapper = mount(DataManagerHeader, {
      props: {
        compact: false,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const uiStore = useUIStore();
    const pipButton = wrapper.find('[data-testid="dataManagerPiPButton"]');
    await pipButton.trigger("click");

    expect(uiStore.showDataManagerPiP).toBe(true);
    expect(navigateTo).toHaveBeenCalledWith("/");
  });

  test("emits update:searchValue when search input changes", async () => {
    const wrapper = mount(DataManagerHeader, {
      props: {
        searchValue: "",
      },
      global: {
        plugins: [vuetify],
      },
    });

    const input = wrapper.find(".search-bar-stub");
    await input.setValue("test search");

    const emitted = wrapper.emitted("update:searchValue");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual(["test search"]);
  });

  test("exposes focusSearch method", () => {
    const wrapper = mount(DataManagerHeader, {
      global: {
        plugins: [vuetify],
      },
    });

    const exposed = wrapper.vm as unknown as { focusSearch: () => void };
    expect(exposed.focusSearch).toBeTypeOf("function");
    expect(() => {
      exposed.focusSearch();
    }).not.toThrow();
  });
});
