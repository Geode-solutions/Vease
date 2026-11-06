import { type VueWrapper, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import CreateHorizonStack from "@vease/components/tools/CreateHorizonStack.vue";
import { createHorizonStack } from "@vease/utils/controller/handlers/horizon_stack";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/utils/controller/handlers/horizon_stack"), () => ({
  createHorizonStack: vi.fn<typeof createHorizonStack>(),
  horizonStackInfo: vi.fn<() => Promise<never>>(),
}));

async function fill(wrapper: VueWrapper, testId: string, value: string): Promise<void> {
  await wrapper.find(`[data-testid="${testId}"] input`).setValue(value);
}

function submitButton(wrapper: VueWrapper): ReturnType<VueWrapper["find"]> {
  return wrapper.find('[data-testid="submitButton"]');
}

describe("the CreateHorizonStack component", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.mocked(createHorizonStack).mockReset();
    vi.mocked(createHorizonStack).mockResolvedValue({ id: "stack-id", name: "stack" });
  });

  test("starts with one horizon between two units and cannot submit", () => {
    const wrapper: VueWrapper = mountWithPlugins(CreateHorizonStack);

    expect(wrapper.find('[data-testid="horizonStackHorizon-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="horizonStackUnit-1"]').exists()).toBe(true);
    expect(submitButton(wrapper).attributes("disabled")).toBeDefined();
  });

  test("adds a horizon with the unit below it", async () => {
    const wrapper: VueWrapper = mountWithPlugins(CreateHorizonStack);

    await wrapper.find('[data-testid="addHorizonButton"]').trigger("click");

    expect(wrapper.find('[data-testid="horizonStackHorizon-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="horizonStackUnit-2"]').exists()).toBe(true);
  });

  test("creates the stack from the typed names and reports it", async () => {
    const wrapper: VueWrapper = mountWithPlugins(CreateHorizonStack);
    await fill(wrapper, "horizonStackName", "stack");
    await fill(wrapper, "horizonStackHorizon-0", "Top");
    await fill(wrapper, "horizonStackUnit-0", "Above");

    await submitButton(wrapper).trigger("click");
    await flushPromises();

    expect(createHorizonStack).toHaveBeenCalledWith({
      name: "stack",
      horizons: ["Top"],
      unit_names: ["Above", "Unit 2"],
    });
    expect(wrapper.emitted("created")).toHaveLength(1);
  });
});
