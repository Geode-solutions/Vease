import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import CreateTools from "@vease/components/CreateTools.vue";
import type GlassCardComponent from "@ogw_front/components/GlassCard.vue";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

const { glassCardStub } = vi.hoisted(() => ({
  glassCardStub: {
    name: "GlassCard",
    props: ["variant", "padding", "escapeFunction"],
    template: "<div class='glass-card-stub' @click='$emit(\"click\")'><slot /></div>",
  },
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- simplified component stub cast to the real component's module type, established repo pattern.
  default: glassCardStub as unknown as typeof GlassCardComponent,
}));

const TOOL_ID_ONE = "tool-alpha";
const TOOL_TITLE_ONE = "Alpha Tool";
const TOOL_DESC_ONE = "Description for alpha tool";
const DUMMY_COMPONENT_NAME = "DummyToolComponent";

describe("the CreateTools component", () => {
  beforeEach(() => {
    setupActivePinia();
    const uiStore = useUIStore();
    uiStore.toolsDefinitions = [
      {
        id: TOOL_ID_ONE,
        title: TOOL_TITLE_ONE,
        description: TOOL_DESC_ONE,
        iconType: "mdi",
        iconSource: "mdi-pencil",
        component: {
          name: DUMMY_COMPONENT_NAME,
          template:
            "<div class='tool-component-stub'><button class='created-btn' @click='$emit(\"created\")'>Create</button><button class='close-btn' @click='$emit(\"close\")'>Close</button></div>",
        },
      },
    ];
    uiStore.showCreateTools = true;
  });

  test("renders the list of active tools when no tool is selected", () => {
    const wrapper = mountWithPlugins(CreateTools);

    expect(wrapper.text()).toContain("Create New Object");
    expect(wrapper.text()).toContain("Choose a drawing tool to get started.");
    expect(wrapper.text()).toContain(TOOL_TITLE_ONE);
    expect(wrapper.text()).toContain(TOOL_DESC_ONE);
  });

  test("selects a tool card and displays its component", async () => {
    const wrapper = mountWithPlugins(CreateTools);

    const card = wrapper.find(`[data-testid="createToolCard-${TOOL_ID_ONE}"]`);
    await card.trigger("click");

    expect(wrapper.find(".tool-component-stub").exists()).toBe(true);
  });

  test("returns to tool selection list when back button is clicked", async () => {
    const wrapper = mountWithPlugins(CreateTools);

    const card = wrapper.find(`[data-testid="createToolCard-${TOOL_ID_ONE}"]`);
    await card.trigger("click");
    expect(wrapper.find(".tool-component-stub").exists()).toBe(true);

    const backBtn = wrapper.find(".back-btn button");
    await backBtn.trigger("click");

    expect(wrapper.find(".tool-component-stub").exists()).toBe(false);
    expect(wrapper.text()).toContain("Create New Object");
  });

  test("hides creation view and calls setShowCreateTools when tool emits created", async () => {
    const uiStore = useUIStore();
    const setShowCreateToolsSpy = vi.spyOn(uiStore, "setShowCreateTools");

    const wrapper = mountWithPlugins(CreateTools);

    const card = wrapper.find(`[data-testid="createToolCard-${TOOL_ID_ONE}"]`);
    await card.trigger("click");

    const createdBtn = wrapper.find(".created-btn");
    await createdBtn.trigger("click");

    expect(setShowCreateToolsSpy).toHaveBeenCalledWith(false);
  });

  test("displays alert message when selected tool component is missing", async () => {
    const uiStore = useUIStore();
    // ActiveTools is derived from toolsDefinitions, so to exercise the
    // "component missing" fallback the tool must still be listed but have
    // No registered component.
    uiStore.toolsDefinitions = [
      {
        id: TOOL_ID_ONE,
        title: TOOL_TITLE_ONE,
        description: TOOL_DESC_ONE,
        iconType: "mdi",
        iconSource: "mdi-pencil",
        component: undefined,
      },
    ];

    const wrapper = mountWithPlugins(CreateTools);

    const card = wrapper.find(`[data-testid="createToolCard-${TOOL_ID_ONE}"]`);
    await card.trigger("click");

    expect(wrapper.text()).toContain(`Component not found for **${TOOL_ID_ONE}**`);
  });
});
