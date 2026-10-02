import { type DataManagerTab, useUIStore } from "@vease/stores/ui";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import DataManagerHeader from "@vease/components/datamanager/DataManagerHeader.vue";
import type SearchBar from "@ogw_front/components/SearchBar.vue";
import { navigateTo } from "#app/composables/router";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_EVENT_INDEX = 0;
const EXPECTED_EVENT_COUNT = 1;

vi.mock(import("#app/composables/router"), async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, navigateTo: vi.fn<typeof navigateTo>() };
});

vi.mock(import("@ogw_front/components/SearchBar.vue"), () => ({
  default: {
    name: "SearchBar",
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template:
      "<input class='search-bar-stub' :value='modelValue' @input=\"$emit('update:modelValue', $event.target.value)\" />",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of the component this suite touches
  } as unknown as typeof SearchBar,
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

  test("renders default data tab and additional tabs", () => {
    const wrapper = mountWithPlugins(DataManagerHeader, {
      props: {
        activeTab: "data",
        tabs: [mockCustomTab],
      },
    });

    expect(wrapper.text()).toContain("Data Manager");
    expect(wrapper.text()).toContain("Custom Tab");
  });

  test("emits update:activeTab when a tab is clicked", async () => {
    const wrapper = mountWithPlugins(DataManagerHeader, {
      props: {
        activeTab: "data",
        tabs: [mockCustomTab],
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
    const wrapper = mountWithPlugins(DataManagerHeader, {
      props: {
        compact: false,
      },
    });

    expect(wrapper.find('[data-testid="dataManagerPiPButton"]').exists()).toBe(true);
  });

  test("does not render picture in picture button when compact is true", () => {
    const wrapper = mountWithPlugins(DataManagerHeader, {
      props: {
        compact: true,
      },
    });

    expect(wrapper.find('[data-testid="dataManagerPiPButton"]').exists()).toBe(false);
  });

  test("enters PiP and navigates to root on PiP button click", async () => {
    const wrapper = mountWithPlugins(DataManagerHeader, {
      props: {
        compact: false,
      },
    });

    const uiStore = useUIStore();
    const pipButton = wrapper.find('[data-testid="dataManagerPiPButton"]');
    await pipButton.trigger("click");

    expect(uiStore.showDataManagerPiP).toBe(true);
    expect(navigateTo).toHaveBeenCalledWith("/");
  });

  test("emits update:searchValue when search input changes", async () => {
    const wrapper = mountWithPlugins(DataManagerHeader, {
      props: {
        searchValue: "",
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
    const wrapper = mountWithPlugins(DataManagerHeader);

    // MountWithPlugins's shared generics don't propagate defineExpose() types, so the
    // Exposed member has to be re-typed from the component's own definition here.
    // oxlint-disable-next-line no-unsafe-type-assertion -- see comment above; there's no clean fix without changing the shared mountWithPlugins helper
    const exposed = wrapper.vm as unknown as { focusSearch: () => void };
    expect(exposed.focusSearch).toBeTypeOf("function");
    expect(() => {
      exposed.focusSearch();
    }).not.toThrow();
  });
});
