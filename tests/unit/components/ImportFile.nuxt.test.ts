import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ImportFile from "@vease/components/ImportFile.vue";
import { flushPromises } from "@vue/test-utils";
import { importWorkflow } from "@ogw_front/utils/import_workflow";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useUserInterfaceStore } from "@vease/stores/user_interface";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/utils/import_workflow"), () => ({
  importWorkflow: vi.fn<typeof importWorkflow>(),
}));

const SAMPLE_FILENAME = "grid.vtp";
const GEODE_TYPE = "BRep";

describe("the ImportFile component", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.mocked(importWorkflow).mockReset();
    vi.mocked(importWorkflow).mockResolvedValue([]);
  });

  // The object tree shows each file with a spinner meanwhile
  test("closes the stepper without waiting for the import", async () => {
    const setShowStepperSpy = vi.spyOn(useUserInterfaceStore(), "setShowStepper");
    vi.mocked(importWorkflow).mockReturnValue(Promise.withResolvers<string[]>().promise);
    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME],
        geodeObjectTypes: { [SAMPLE_FILENAME]: [GEODE_TYPE] },
        skippedFiles: [],
      },
    });
    await wrapper.find('[data-testid="finalizeImportButton"]').trigger("click");
    await flushPromises();
    expect(importWorkflow).toHaveBeenCalledWith([
      { filename: SAMPLE_FILENAME, geode_object_type: GEODE_TYPE },
    ]);
    expect(setShowStepperSpy).toHaveBeenCalledWith(false);
  });

  test("renders import and cancel buttons", () => {
    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME],
        geodeObjectTypes: { [SAMPLE_FILENAME]: [GEODE_TYPE] },
        skippedFiles: [],
      },
    });

    expect(wrapper.text()).toContain("Import");
    expect(wrapper.text()).toContain("Cancel");
  });

  test("calls importWorkflow and updates userInterfaceStore on import click", async () => {
    const userInterfaceStore = useUserInterfaceStore();
    const setShowStepperSpy = vi.spyOn(userInterfaceStore, "setShowStepper");

    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME],
        geodeObjectTypes: { [SAMPLE_FILENAME]: [GEODE_TYPE] },
        skippedFiles: [],
      },
    });

    const importBtn = wrapper.find('[data-testid="finalizeImportButton"]');
    await importBtn.trigger("click");
    await flushPromises();

    expect(importWorkflow).toHaveBeenCalledWith([
      { filename: SAMPLE_FILENAME, geode_object_type: GEODE_TYPE },
    ]);
    expect(wrapper.emitted("reset_values")).toStrictEqual([[]]);
    expect(setShowStepperSpy).toHaveBeenCalledWith(false);
  });

  test("emits reset_values and closes stepper when cancel button is clicked", async () => {
    const userInterfaceStore = useUserInterfaceStore();
    const setShowStepperSpy = vi.spyOn(userInterfaceStore, "setShowStepper");

    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME],
        geodeObjectTypes: { [SAMPLE_FILENAME]: [GEODE_TYPE] },
        skippedFiles: [],
      },
    });

    const [, cancelBtn] = wrapper.findAll("button");
    await cancelBtn?.trigger("click");

    expect(wrapper.emitted("reset_values")).toStrictEqual([[]]);
    expect(setShowStepperSpy).toHaveBeenCalledWith(false);
  });

  test("imports each file with its own type and skips the others", async () => {
    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: [SAMPLE_FILENAME, "model.og_brep", "unsupported.toto", "skipped.vtu"],
        geodeObjectTypes: {
          [SAMPLE_FILENAME]: [GEODE_TYPE],
          "model.og_brep": ["StructuralModel"],
          "skipped.vtu": ["TetrahedralSolid3D"],
        },
        skippedFiles: ["skipped.vtu"],
      },
    });

    await wrapper.find('[data-testid="finalizeImportButton"]').trigger("click");
    await flushPromises();

    expect(importWorkflow).toHaveBeenCalledWith([
      { filename: SAMPLE_FILENAME, geode_object_type: GEODE_TYPE },
      { filename: "model.og_brep", geode_object_type: "StructuralModel" },
    ]);
  });

  test("imports a file once per type when it holds several contents", async () => {
    const warningSpy = vi.spyOn(useFeedbackStore(), "add_warning");
    const wrapper = mountWithPlugins(ImportFile, {
      props: {
        filenames: ["mixed.vtu", "empty.vtu"],
        geodeObjectTypes: {
          "mixed.vtu": ["TriangulatedSurface3D", "TetrahedralSolid3D"],
          "empty.vtu": [],
        },
        skippedFiles: [],
      },
    });

    await wrapper.find('[data-testid="finalizeImportButton"]').trigger("click");
    await flushPromises();

    expect(importWorkflow).toHaveBeenCalledWith([
      { filename: "mixed.vtu", geode_object_type: "TriangulatedSurface3D" },
      { filename: "mixed.vtu", geode_object_type: "TetrahedralSolid3D" },
    ]);
    expect(warningSpy).toHaveBeenCalledExactlyOnceWith("Skipped files: empty.vtu");
  });
});
