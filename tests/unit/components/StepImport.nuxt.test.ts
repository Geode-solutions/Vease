import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import StepImport from "@vease/components/StepImport.vue";
import type Stepper from "@ogw_front/components/Stepper.vue";
import { flushPromises } from "@vue/test-utils";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useStepperTree } from "@ogw_front/composables/stepper_tree.js";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/components/Stepper.vue"), () => ({
  default: {
    name: "Stepper",
    props: ["stepperTree"],
    template:
      "<div class='stepper-stub'><button class='close-btn' @click='$emit(\"close\")'>Close</button><button class='reset-btn' @click='$emit(\"reset_values\")'>Reset</button></div>",
    // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of Stepper this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  } as unknown as typeof Stepper,
}));

vi.mock(import("@ogw_front/composables/stepper_tree.js"), () => ({
  useStepperTree: vi.fn<typeof useStepperTree>(),
}));

const FILE_NAME = "model.vtp";

describe("the StepImport component", () => {
  const resetValuesMock = vi.fn<() => void>();

  beforeEach(() => {
    setupActivePinia();
    resetValuesMock.mockReset();

    vi.mocked(useStepperTree).mockReturnValue({
      reset_values: resetValuesMock,
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for casting a plain mock object to a composable's return type
    } as unknown as ReturnType<typeof useStepperTree>);
  });

  test("renders Stepper container component", async () => {
    const wrapper = mountWithPlugins(StepImport);
    await flushPromises();

    expect(wrapper.find(".stepper-stub").exists()).toBe(true);
  });

  test("resets values and emits close when close event is triggered on Stepper", async () => {
    const uiStore = useUIStore();
    const setDroppedFilesSpy = vi.spyOn(uiStore, "setDroppedFiles");

    const sampleFile = new File(["dummy"], FILE_NAME);
    const wrapper = mountWithPlugins(StepImport, {
      props: { files: [sampleFile] },
    });

    await flushPromises();
    const closeBtn = wrapper.find(".close-btn");
    await closeBtn.trigger("click");

    expect(setDroppedFilesSpy).toHaveBeenCalledWith([]);
    expect(resetValuesMock).toHaveBeenCalledWith();
    expect(wrapper.emitted("close")).toStrictEqual([[]]);
  });

  test("refuses a time series file selected with other files", async () => {
    const actual = await vi.importActual<{ useStepperTree: typeof useStepperTree }>(
      "@ogw_front/composables/stepper_tree.js",
    );
    const stepperTrees: ReturnType<typeof useStepperTree>[] = [];
    vi.mocked(useStepperTree).mockImplementation((steps, initialState) => {
      const stepperTree = actual.useStepperTree(steps, initialState);
      stepperTrees.push(stepperTree);
      return stepperTree;
    });
    const warningSpy = vi.spyOn(useFeedbackStore(), "add_warning");

    mountWithPlugins(StepImport);
    const [stepperTree] = stepperTrees;
    // What the file selector emits once the files are uploaded
    stepperTree?.update_values({
      files: [new File(["pvd"], "series.pvd"), new File(["vtu"], "rank_0.vtu")],
      time_series: ["pvd"],
    });
    await flushPromises();

    expect(warningSpy).toHaveBeenCalledWith("Import the time series file alone");
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
