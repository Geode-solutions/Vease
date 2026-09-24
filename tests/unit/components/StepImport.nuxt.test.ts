import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import StepImport from "@vease/components/StepImport.vue";
import { useStepperTree } from "@ogw_front/composables/stepper_tree.js";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/components/Stepper.vue"), () => ({
  default: {
    name: "Stepper",
    props: ["stepperTree"],
    template:
      "<div class='stepper-stub'><button class='close-btn' @click='$emit(\"close\")'>Close</button><button class='reset-btn' @click='$emit(\"reset_values\")'>Reset</button></div>",
  },
}));

vi.mock(import("@ogw_front/composables/stepper_tree.js"), () => ({
  useStepperTree: vi.fn<() => any>(),
}));

const FILE_NAME = "model.vtp";

describe("the StepImport component", () => {
  const resetValuesMock = vi.fn<() => void>();

  beforeEach(() => {
    setupActivePinia();
    resetValuesMock.mockReset();

    vi.mocked(useStepperTree).mockReturnValue({
      reset_values: resetValuesMock,
    } as unknown as ReturnType<typeof useStepperTree>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders Stepper container component", () => {
    const wrapper = mountWithPlugins(StepImport);

    expect(wrapper.find(".stepper-stub").exists()).toBe(true);
  });

  test("resets values and emits close when close event is triggered on Stepper", async () => {
    const uiStore = useUIStore();
    const setDroppedFilesSpy = vi.spyOn(uiStore, "setDroppedFiles");

    const sampleFile = new File(["dummy"], FILE_NAME);
    const wrapper = mountWithPlugins(StepImport, {
      props: { files: [sampleFile] },
    });

    const closeBtn = wrapper.find(".close-btn");
    await closeBtn.trigger("click");

    expect(setDroppedFilesSpy).toHaveBeenCalledWith([]);
    expect(resetValuesMock).toHaveBeenCalledWith();
    expect(wrapper.emitted("close")).toStrictEqual([[]]);
  });

  test("resets stepper tree values when showStepper becomes false", async () => {
    const uiStore = useUIStore();
    uiStore.showStepper = true;

    mountWithPlugins(StepImport);

    uiStore.setShowStepper(false);
    await nextTick();

    expect(resetValuesMock).toHaveBeenCalledWith();
  });
});
