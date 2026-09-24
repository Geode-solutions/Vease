import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import DataManagerPiP from "@vease/components/datamanager/DataManagerPiP.vue";
import { navigateTo } from "#app/composables/router";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("#app/composables/router"), async (importOriginal) => {
  const actual = await importOriginal<typeof import("#app/composables/router")>();
  return { ...actual, navigateTo: vi.fn<typeof navigateTo>() };
});

vi.mock(import("@vease/components/datamanager/DataManagerContent.vue"), () => ({
  default: {
    name: "DataManagerContent",
    props: {
      compact: Boolean,
    },
    template: "<div class='data-manager-content-stub'></div>",
  },
}));

vi.mock(import("@vease/components/Layout/ResizablePiP.vue"), () => ({
  default: {
    name: "ResizablePiP",
    props: [
      "storageKey",
      "escapeFunction",
      "defaultWidth",
      "defaultHeight",
      "minWidth",
      "minHeight",
    ],
    template: `
      <div class="resizable-pip-stub" :data-storage-key="storageKey">
        <slot name="handle" />
        <slot />
      </div>
    `,
  },
}));

describe("data manager pip component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders pip header title and child content", () => {
    const wrapper = mountWithPlugins(DataManagerPiP);

    expect(wrapper.text()).toContain("Data Manager");
    expect(wrapper.find(".data-manager-content-stub").exists()).toBe(true);
  });

  test("passes compact prop to data manager content", () => {
    const wrapper = mountWithPlugins(DataManagerPiP);

    const contentComponent = wrapper.findComponent({ name: "DataManagerContent" });
    expect(contentComponent.props("compact")).toBe(true);
  });

  test("expands to full page on expand button click", async () => {
    const wrapper = mountWithPlugins(DataManagerPiP);

    const uiStore = useUIStore();
    uiStore.setShowDataManagerPiP(true);

    const expandButton = wrapper.find('[data-testid="dataManagerPiPExpandButton"]');
    await expandButton.trigger("click");

    expect(uiStore.showDataManagerPiP).toBe(false);
    expect(navigateTo).toHaveBeenCalledWith("/data_manager");
  });

  test("closes pip on close button click", async () => {
    const wrapper = mountWithPlugins(DataManagerPiP);

    const uiStore = useUIStore();
    uiStore.setShowDataManagerPiP(true);

    const [, closeButton] = wrapper.findAll(".v-btn");
    expect(closeButton).toBeDefined();
    await closeButton.trigger("click");

    expect(uiStore.showDataManagerPiP).toBe(false);
  });
});
